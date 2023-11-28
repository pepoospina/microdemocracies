import { utils } from 'ethers';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { encodeFunctionData } from 'viem';
import { RouteNames } from '../../App';
import { registryFactoryABI } from '../../contracts/abis';
import { DetailsAndPlatforms, SelectedDetails, PAP, HexStr } from '../../types';
import { getFactoryAddress } from '../../utils/contracts.json';
import { postProject, postMember } from '../../utils/project';
import { putObject } from '../../utils/store';
import { RegistryCreatedEvent } from '../../utils/viem.types';
import { useAccountContext } from '../../wallet/AccountContext';

export interface CreateProjectStatus {
  founderPap?: PAP;
  whoStatement: string;
  selectedDetails?: SelectedDetails;
  isCreating: boolean;
  setFounderDetails: React.Dispatch<React.SetStateAction<DetailsAndPlatforms | undefined>>;
  setWhoStatement: React.Dispatch<React.SetStateAction<string>>;
  setDetails: React.Dispatch<React.SetStateAction<SelectedDetails | undefined>>;
  createProject: () => void;
  isSuccess: boolean;
  projectId?: number;
}

export const useCreateProject = (): CreateProjectStatus => {
  const { addUserOp, aaAddress, isSuccess: isSuccessUserOp, events, owner, reset } = useAccountContext();

  const [founderDetails, setFounderDetails] = useState<DetailsAndPlatforms>();
  const [whoStatement, setWhoStatement] = useState<string>('');
  // const [whatStatement, setWhatStatement] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [selectedDetails, setDetails] = useState<SelectedDetails>();

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<number>();

  const founderPap: PAP | undefined = useMemo(() => {
    return aaAddress && founderDetails
      ? {
          account: aaAddress,
          person: founderDetails,
        }
      : undefined;
  }, [aaAddress, founderDetails]);

  const createProject = useCallback(async () => {
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
  }, [aaAddress, addUserOp, founderPap, whoStatement]);

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

      setProjectId((event.args as any).number);
      setIsCreating(false);
    },
    [owner, aaAddress, selectedDetails, whoStatement]
  );

  useEffect(() => {
    if (isSuccessUserOp && events) {
      const event = events.find((e) => e.eventName === 'RegistryCreated') as RegistryCreatedEvent | undefined;
      if (event) {
        reset();
        registerProject(event);
        setIsSuccess(true);
      }
    }
  }, [isSuccessUserOp, events, registerProject]);

  return {
    founderPap,
    whoStatement,
    selectedDetails,
    isCreating,
    setFounderDetails,
    setWhoStatement,
    setDetails,
    createProject,
    isSuccess,
    projectId,
  };
};
