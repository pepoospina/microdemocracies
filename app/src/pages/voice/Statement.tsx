import { Anchor, Box, Spinner, Text } from 'grommet';
import { AppButton, AppCardProps } from '../../ui-components';
import { useMutation, useQuery } from 'react-query';
import { StatementRead, AppStatementBacking, SignedObject } from '../../types';
import { FUNCTIONS_BASE } from '../../config/appConfig';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { useCallback } from 'react';
import { useSignMessage } from 'wagmi';
import { getStatementBackers, isStatementBacker } from '../../firestore/getters';
import { useThemeContext } from '../../components/app';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { COMMUNITY_MEMBER } from '../../config/community';
import { useAccountContext } from '../../wallet/AccountContext';

interface IStatement extends AppCardProps {
  statement?: StatementRead;
  preview?: boolean;
  boxStyle?: React.CSSProperties;
}

export const Statement = (props: IStatement) => {
  const { constants } = useThemeContext();
  const { isConnected } = useAccountContext();
  const { tokenId } = useConnectedMember();
  const { signMessageAsync } = useSignMessage();

  const { data: backers, refetch: _refetchBackers } = useQuery(['backers', props.statement?.id], () => {
    if (props.statement) {
      return getStatementBackers(props.statement.id);
    }
  });

  const { data: isBacker, refetch: refetchIsBacker } = useQuery(['isBacker', props.statement?.id, tokenId], () => {
    if (props.statement && tokenId) {
      return isStatementBacker(props.statement.id, tokenId);
    }
  });

  const { mutateAsync: sendBack } = useMutation(async (backing: SignedObject<AppStatementBacking>) => {
    return fetch(FUNCTIONS_BASE + '/voice/statement/back', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backing),
    });
  });

  const isAuthor = tokenId && props.statement && tokenId === props.statement.object.author;
  const canBack = tokenId && isBacker !== undefined && !isBacker && isAuthor !== undefined && !isAuthor;

  const back = useCallback(async () => {
    if (props.statement && tokenId) {
      const backing: AppStatementBacking = {
        backer: tokenId,
        statement: props.statement.object.statement,
        statementId: props.statement.id,
      };
      const signature = await signMessageAsync({ message: JSON.stringify(backing) });
      const res = await sendBack({
        object: backing,
        signature,
      });
      const body = await res.json();
      if (body.success) {
        refetchBackers();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.statement, tokenId]);

  const refetchBackers = () => {
    _refetchBackers();
    refetchIsBacker();
  };

  return (
    <Box style={{ ...props.boxStyle }}>
      <Box style={{ backgroundColor: constants.colors.primary, color: 'white' }} pad="small">
        {props.statement ? (
          <Box>
            <Box
              style={{
                marginBottom: '8px',
                flexShrink: 0,
              }}
              pad="medium">
              <Text
                size="medium"
                style={{
                  textTransform: 'uppercase',
                  lineHeight: '125%',
                  fontWeight: '800',
                }}>
                {props.statement.object.statement}
              </Text>
            </Box>
            <Box direction="row" style={{ margin: '0px 0', flexShrink: 0 }}>
              <Box>
                <Text>
                  by{' '}
                  <Anchor style={{ color: 'white' }}>
                    {COMMUNITY_MEMBER} #{props.statement.object.author}
                  </Anchor>
                </Text>
              </Box>
              <Box direction="row" style={{ flexGrow: 1 }} justify="end" align="center">
                {backers && backers.length > 0 ? (
                  <>
                    <Box direction="row" align="center">
                      {backers.map((backer) => {
                        return (
                          <Box
                            key={backer.object.backer}
                            style={{
                              height: '32px',
                              width: '32px',
                              borderRadius: '16px',
                              border: 'solid 1px white',
                            }}
                            align="center"
                            justify="center">
                            <Text size="small">#{backer.object.backer}</Text>
                          </Box>
                        );
                      })}
                    </Box>
                    <Text style={{ marginLeft: '6px' }}>
                      <b>back this</b>
                    </Text>
                  </>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <Spinner></Spinner>
        )}
      </Box>
      {!props.preview && !isAuthor ? (
        <Box direction="row" justify="end">
          {isConnected ? (
            !isBacker ? (
              <AppButton
                label="back"
                disabled={!canBack}
                style={{ padding: '6px 32px' }}
                primary
                onClick={() => back()}></AppButton>
            ) : (
              <Box
                style={{
                  padding: '6px 32px',
                  borderRadius: '4px',
                  backgroundColor: constants.colors.primaryLight,
                  color: 'white',
                  fontWeight: 800,
                }}>
                <Text>YOU BACK THIS</Text>
              </Box>
            )
          ) : (
            <AppConnectButton label="connect to back" style={{ padding: '6px 32px' }}></AppConnectButton>
          )}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

// {props.preview ? (
//   <></>
// ) : (
//   <>
//     {canBack ? <AppButton label="back" onClick={() => back()}></AppButton> : <></>}
//     <Text>Backers: </Text>
//     {backers ? (
//       backers.map((backer) => {
//         return <Box>{backer.object.backer}</Box>;
//       })
//     ) : (
//       <></>
//     )}
//     {isBacker ? <Box>You back this</Box> : <></>}
//   </>
// )}
