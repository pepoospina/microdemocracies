import { Box, Spinner, Text } from 'grommet';
import { AppStatementRead } from '../../types';

import { StatementEditable } from './StatementEditable';
import { useEffect, useState } from 'react';
import { Favorite } from 'grommet-icons';
import { useQuery } from 'react-query';
import { countStatementBackings } from '../../firestore/getters';
import { AppButton } from '../../ui-components/AppButton';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { useBackingSend } from './useBackingSend';
import { CircleIndicator } from '../../components/app/CircleIndicator';

export const StatementCard = (props: { statement: AppStatementRead; containerStyle?: React.CSSProperties }) => {
  const { statement } = props;

  const { tokenId } = useConnectedMember();
  const [isBacking, setIsBacking] = useState<boolean>(false);
  const [alreadyLiked, setAlreadyLiked] = useState<boolean>();

  const {
    data: nBacking,
    isLoading,
    refetch: refetchCount,
  } = useQuery(['statementBackers', statement.id], () => {
    return countStatementBackings(statement.id);
  });

  const { backStatement, isSuccessBacking, errorBacking } = useBackingSend();

  const canBack = tokenId !== undefined && tokenId !== null;

  const back = () => {
    if (backStatement) {
      setIsBacking(true);
      backStatement(statement.id, statement.treeId);
    }
  };

  useEffect(() => {
    if (isSuccessBacking) {
      setIsBacking(false);
      refetchCount();
    }
  }, [isSuccessBacking]);

  useEffect(() => {
    if (errorBacking) {
      setIsBacking(false);
      if (errorBacking.toLocaleLowerCase().includes('already posted')) {
        setAlreadyLiked(true);
      }
    }
  }, [errorBacking]);

  useEffect(() => {
    if (alreadyLiked) {
      setTimeout(() => {
        setAlreadyLiked(false);
      }, 3000);
    }
  }, [alreadyLiked]);

  return (
    <Box style={{ position: 'relative', flexShrink: 0, ...props.containerStyle }}>
      <StatementEditable
        value={props.statement.statement}
        containerStyle={{ paddingBottom: '22px' }}></StatementEditable>
      <Box
        direction="row"
        justify="end"
        gap="small"
        align="center"
        pad={{ horizontal: 'medium' }}
        style={{
          position: 'absolute',
          bottom: '-12px',
          left: '0px',
          width: '100%',
        }}>
        <CircleIndicator
          borderWidth="4px"
          icon={
            <Box>
              <Text color="white">{!isLoading ? <b>{nBacking}</b> : <Spinner color="white"></Spinner>}</Text>
            </Box>
          }></CircleIndicator>
        <AppButton plain onClick={() => back()} disabled={!canBack}>
          <CircleIndicator
            size={48}
            icon={
              isBacking ? <Spinner color="white"></Spinner> : <Favorite color="white" style={{ height: '20px' }} />
            }></CircleIndicator>
        </AppButton>

        {alreadyLiked ? (
          <Box style={{ position: 'absolute', bottom: '48px' }}>
            <Text color="white">already backed!</Text>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};
