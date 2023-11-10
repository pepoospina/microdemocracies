import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text } from 'grommet';
import { FormNext, FormPrevious } from 'grommet-icons';
import { useEffect, useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';
import { encodeFunctionData } from 'viem';
import { utils } from 'ethers';

import { appName } from '../../config/community';
import { StatementEditable } from '../voice/StatementEditable';
import { AppButton, AppHeading } from '../../ui-components';
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
import { postStatement } from '../../utils/statements';
import { postProject } from '../../utils/project';
import { RegistryCreatedEvent } from '../../utils/viem.types';

const NPAGES = 5;

export const CreateProject = () => {
  const navigate = useNavigate();

  const [formIndex, setFormIndex] = useState(0);

  const { addUserOp, aaAddress, sendUserOps, isSuccess, isSending, error, events, signMessage } = useAccountContext();
  const [founderDetails, setFounderDetails] = useState<DetailsAndPlatforms>();
  const [whoStatement, setWhoStatement] = useState<string>('Only people I like');
  const [whatStatement, setWhatStatement] = useState<string>('Change the world');
  const [selectedDetails, setDetails] = useState<SelectedDetails>();

  const founderPap: PAP | undefined =
    aaAddress && founderDetails
      ? {
          account: aaAddress,
          person: founderDetails,
        }
      : undefined;

  const boxStyle: React.CSSProperties = { width: '100vw', height: 'calc(100vh - 60px - 50px)', overflowY: 'auto' };

  const btnStyle: React.CSSProperties = {
    width: '0px',
    display: 'none',
  };

  const createProject = async () => {
    if (!aaAddress || !founderPap || !addUserOp) return;

    const entity = await deriveEntity(founderPap);
    const salt = utils.keccak256(utils.toUtf8Bytes(Date.now().toString())) as HexStr;

    // TODO weird encodedFunctionData asking for zero parameters
    const callData = (encodeFunctionData as any)({
      abi: registryFactoryABI,
      functionName: 'create',
      args: ['MRS', 'micro(r)evolutions ', [founderPap.account as HexStr], [entity.cid], salt],
    });

    const registryFactoryAddress = await getFactoryAddress();

    addUserOp({
      target: registryFactoryAddress,
      data: callData,
      value: BigInt(0),
    });

    if (!sendUserOps) return;
    sendUserOps();
  };

  const registerProject = async (event: RegistryCreatedEvent) => {
    const projectId = Number(event.args.number);
    const address = event.args.newRegistry as HexStr;

    if (!selectedDetails) throw new Error('selectedDetails undefined');
    if (!signMessage) throw new Error('signMessage undefined');

    /** sign the "what" of the project */
    await postProject({
      projectId,
      address,
      whatStatement,
      whoStatement,
      selectedDetails,
    });

    await postStatement(1, whatStatement, signMessage);

    navigate(RouteNames.ProjectHome((event.args as any).number));
  };

  useEffect(() => {
    if (isSuccess && events) {
      const event = events.find((e) => e.eventName === 'RegistryCreated') as RegistryCreatedEvent | undefined;
      if (event) {
        registerProject(event);
      }
    }
  }, [isSuccess, events, navigate]);

  const nextPage = () => {
    if (formIndex < NPAGES - 1) {
      setFormIndex(formIndex + 1);
    }

    if (formIndex === NPAGES - 1) {
      createProject();
    }
  };

  const prevPage = () => {
    if (formIndex > 0) {
      setFormIndex(formIndex - 1);
    }
  };

  const nextStr = (() => {
    if (formIndex === 2) return 'next';
    if (formIndex === 3) return 'review';
    if (formIndex === 4) return 'create';
    return 'next';
  })();

  if (isSending) {
    return (
      <BoxCentered fill>
        <Text>Creating your micro(r)evolution</Text>
        <Spinner></Spinner>
      </BoxCentered>
    );
  }

  return (
    <Box fill align="center">
      <Box justify="center" align="center" style={{ flexShrink: '0', height: '50px' }}>
        <Text size="22px" weight="bold">
          {appName}
        </Text>
      </Box>

      <ReactSimplyCarousel
        disableSwipeByMouse
        infinite={false}
        activeSlideIndex={formIndex}
        onRequestChange={setFormIndex}
        itemsToShow={1}
        itemsToScroll={1}
        forwardBtnProps={{
          style: btnStyle,
          children: (
            <Box align="center" justify="center" style={{ height: 36, width: 36 }}>
              <FormNext></FormNext>
            </Box>
          ),
        }}
        backwardBtnProps={{
          style: btnStyle,
          children: (
            <Box align="center" justify="center" style={{ height: 36, width: 36 }}>
              <FormPrevious></FormPrevious>
            </Box>
          ),
        }}
        containerProps={{
          style: {
            height: '100%',
            display: isSending ? 'none' : 'flex',
          },
        }}
        speed={400}
        easing="linear">
        <Box style={boxStyle} id="a">
          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300' }}>
              <Text>
                Write here <span style={{ fontWeight: '400' }}>what</span> you to want achieve
              </Text>
            </Box>
            <Box>
              <StatementEditable
                value={whatStatement}
                placeholder="What..."
                editable
                onChanged={(value) => {
                  if (value) setWhatStatement(value);
                }}></StatementEditable>
            </Box>
          </Box>

          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300' }}>
              <Text>Remember</Text>
            </Box>
            <Box style={{ marginTop: '0px' }}>
              <Text style={{ fontSize: '24px', lineHeight: '150%', fontWeight: '300' }}>
                Try to make it <span style={{ fontWeight: '400' }}>small</span>,{' '}
                <span style={{ fontWeight: '400' }}>achievable</span> and{' '}
                <span style={{ fontWeight: '400' }}>close to you</span>.
              </Text>
            </Box>
          </Box>
        </Box>
        <Box style={boxStyle}>
          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300', flexShrink: 0 }}>
              <Text>
                Can participate anyone <span style={{ fontWeight: '400' }}>who</span>:
              </Text>
            </Box>
            <Box>
              <StatementEditable
                value={whoStatement}
                onChanged={(value) => {
                  if (value) setWhoStatement(value);
                }}
                editable
                placeholder="Who..."></StatementEditable>
            </Box>
          </Box>

          <Box style={{ width: '100%', flexShrink: 0, overflowY: 'auto' }} pad="large">
            <DetailsSelector onChanged={(details) => setDetails(details)}></DetailsSelector>
          </Box>
        </Box>

        <Box style={boxStyle}>
          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box style={{ marginBottom: '24px' }}>
              <AppHeading>Your Details</AppHeading>
              <Box>
                <Text>All members of the commuity are expected to provide their details. Including you :)</Text>
              </Box>
            </Box>
            <DetailsForm selected={selectedDetails} onChange={(details) => setFounderDetails(details)}></DetailsForm>
          </Box>
        </Box>

        <Box style={boxStyle}>
          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box pad="large" style={{ flexShrink: 0 }}>
              <AppHeading level="2" style={{ marginBottom: '16px' }}>
                Your account
              </AppHeading>
              <AppConnect></AppConnect>
            </Box>
          </Box>
        </Box>

        <Box style={boxStyle}>
          <ProjectSummary
            selectedDetails={selectedDetails}
            whatStatement={whatStatement}
            whoStatement={whoStatement}
            founderPap={founderPap}></ProjectSummary>
        </Box>
      </ReactSimplyCarousel>

      <Box direction="row" style={{ flexShrink: 0, height: '60px' }}>
        <AppButton onClick={() => prevPage()} label="prev" style={{ margin: '0px 0px', width: '200px' }} />
        <AppButton primary onClick={() => nextPage()} label={nextStr} style={{ margin: '0px 0px', width: '200px' }} />
      </Box>
    </Box>
  );
};
