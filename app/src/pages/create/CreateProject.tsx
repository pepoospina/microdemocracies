import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text } from 'grommet';
import { FormNext, FormPrevious } from 'grommet-icons';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { encodeFunctionData } from 'viem';
import { utils } from 'ethers';

import { appName } from '../../config/community';
import { StatementEditable } from '../voice/StatementEditable';
import { AppHeading } from '../../ui-components';
import { DetailsSelector } from './DetailsSelector';
import { DetailsForm } from '../join/DetailsForm';

import { AppConnect } from '../../components/app/AppConnect';
import { ProjectSummary } from './ProjectSummary';
import { DetailsAndPlatforms, HexStr, PAP, SelectedDetails } from '../../types';
import { getFactoryAddress, registryFactoryABI } from '../../utils/contracts.json';
import { deriveEntity } from '../../utils/cid-hash';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { RouteNames } from '../../App';
import { useAccountContext } from '../../wallet/AccountContext';
import { postMember, postProject } from '../../utils/project';
import { RegistryCreatedEvent } from '../../utils/viem.types';
import { putObject } from '../../utils/store';
import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';
import { Bold } from '../landing/LandingPage';
import { AppBottomButtons } from '../common/BottomButtons';

const NPAGES = 4;

export const CreateProject = () => {
  const navigate = useNavigate();

  const { addUserOp, aaAddress, isSuccess, events, owner } = useAccountContext();

  const [pageIx, setPageIx] = useState(0);
  const [founderDetails, setFounderDetails] = useState<DetailsAndPlatforms>();
  const [whoStatement, setWhoStatement] = useState<string>('');
  // const [whatStatement, setWhatStatement] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedDetails, setDetails] = useState<SelectedDetails>();

  const founderPap: PAP | undefined =
    aaAddress && founderDetails
      ? {
          account: aaAddress,
          person: founderDetails,
        }
      : undefined;

  const boxStyle: React.CSSProperties = {};

  const createProject = async () => {
    if (!aaAddress || !founderPap || !addUserOp) return;

    setIsCreating(true);

    const founder = await putObject(founderPap);
    const statement = {
      whoStatement,
    };
    const statementEntity = await putObject({ statement });
    const salt = utils.keccak256(utils.toUtf8Bytes(Date.now().toString())) as HexStr;

    // TODO weird encodedFunctionData asking for zero parameters
    const callData = encodeFunctionData({
      abi: registryFactoryABI,
      functionName: 'create',
      args: ['MRS', 'micro(r)evolutions ', [founderPap.account as HexStr], [founder.cid], statementEntity.cid, salt],
    });

    const registryFactoryAddress = await getFactoryAddress();

    addUserOp(
      {
        target: registryFactoryAddress,
        data: callData,
        value: BigInt(0),
      },
      true
    );
  };

  const registerProject = useCallback(
    async (event: RegistryCreatedEvent) => {
      if (!owner) throw new Error('Owner not defined');
      if (!aaAddress) throw new Error('aaAddress not defined');

      const projectId = Number(event.args.number);
      const address = event.args.newRegistry as HexStr;

      if (!selectedDetails) throw new Error('selectedDetails undefined');

      /** sign the "what" of the project */
      await postProject({
        projectId,
        address,
        whatStatement: '',
        whoStatement,
        selectedDetails,
      });

      await postMember({
        projectId,
        aaAddress,
      });

      navigate(RouteNames.ProjectHome((event.args as any).number));
      setIsCreating(false);
    },
    [owner, aaAddress, selectedDetails, whoStatement, navigate]
  );

  useEffect(() => {
    if (isSuccess && events) {
      const event = events.find((e) => e.eventName === 'RegistryCreated') as RegistryCreatedEvent | undefined;
      if (event) {
        registerProject(event);
      }
    }
  }, [isSuccess, events, navigate]);

  const nextPage = () => {
    if (pageIx < NPAGES - 1) {
      setPageIx(pageIx + 1);
    }

    if (pageIx === NPAGES - 1) {
      createProject();
    }
  };

  const prevPage = () => {
    if (pageIx === 0) {
      navigate(-1);
    }
    if (pageIx > 0) {
      setPageIx(pageIx - 1);
    }
  };

  const prevStr = (() => {
    if (pageIx === 0) return 'back';
    return 'prev';
  })();

  const nextStr = (() => {
    if (pageIx === 1) return 'next';
    if (pageIx === 2) return 'review';
    if (pageIx === 3) return 'create';
    return 'next';
  })();

  const nextDisabled = (() => {
    if (pageIx === 2 && !founderPap) return true;
    if (pageIx === 3 && !whoStatement) return true;
    return false;
  })();

  if (isCreating) {
    return (
      <BoxCentered fill>
        <Text>Creating your micro(r)evolution</Text>
        <Spinner></Spinner>
      </BoxCentered>
    );
  }

  const pages: ReactNode[] = [
    <Box style={boxStyle}>
      <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
        <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300', flexShrink: 0 }}>
          <AppHeading level="3">This micro(r)revolution is for anyone who:</AppHeading>
          <Text style={{ margin: '12px 0px 0px 0px' }}>
            <Bold>Examples are:</Bold> "LIVES IN...", "STUDIES AT...", "WANTS TO...", etc.
          </Text>
        </Box>
        <Box>
          <StatementEditable
            onChanged={(value) => {
              if (value) setWhoStatement(value);
            }}
            editable
            placeholder="WANTS TO..."></StatementEditable>
        </Box>
      </Box>

      <Box style={{ width: '100%', flexShrink: 0, overflowY: 'auto' }} pad="large">
        <DetailsSelector onChanged={(details) => setDetails(details)}></DetailsSelector>
      </Box>
    </Box>,

    <Box style={boxStyle}>
      <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
        <Box style={{ marginBottom: '24px' }}>
          <AppHeading level="3">Your details:</AppHeading>
        </Box>
        <DetailsForm selected={selectedDetails} onChange={(details) => setFounderDetails(details)}></DetailsForm>
      </Box>
    </Box>,

    <Box style={boxStyle}>
      <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
        <AppHeading level="3">Connect Account:</AppHeading>
        <Box pad="large" style={{ flexShrink: 0 }}>
          <AppConnect></AppConnect>
        </Box>
      </Box>
    </Box>,

    <Box style={boxStyle}>
      <ProjectSummary
        selectedDetails={selectedDetails}
        whatStatement={''}
        whoStatement={whoStatement}
        founderPap={founderPap}></ProjectSummary>
    </Box>,
  ];

  return (
    <ViewportPage>
      <ViewportHeadingLarge label="Start a micro(r)evolution"></ViewportHeadingLarge>

      <Box>
        {' '}
        {pages.map((page, ix) => {
          return (
            <div key={ix} style={{ height: '100%', width: '100%', display: pageIx === ix ? 'block' : 'none' }}>
              {page}
            </div>
          );
        })}
      </Box>

      <AppBottomButtons
        left={{
          action: () => prevPage(),
          icon: <FormPrevious></FormPrevious>,
          label: prevStr,
        }}
        right={{
          action: () => nextPage(),
          icon: <FormNext></FormNext>,
          label: nextStr,
          disabled: nextDisabled,
        }}></AppBottomButtons>
    </ViewportPage>
  );
};
