import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { Identity } from '@semaphore-protocol/identity';

import { useAccountContext } from '../wallet/AccountContext';

import { AppGetProof, AppPublicIdentity } from '../types';
import { getPublicIdentity } from '../firestore/getters';
import { getControlMessage } from '../utils/identity.utils';
import { ProofAndTree, generateProof as _generateProof } from '../utils/identity';

import { postIdentity } from '../utils/statements';
import { useAppSigner } from '../wallet/SignerContext';

export type SemaphoreContextType = {
  publicId?: string;
  generateProof?: (input: AppGetProof) => Promise<ProofAndTree>;
  isCreatingPublicId: boolean;
  errorCreating?: Error;
  disconnect: () => void;
};

const SemaphoreContextValue = createContext<SemaphoreContextType | undefined>(undefined);

export const SemaphoreContext = (props: PropsWithChildren) => {
  const { owner, aaAddress } = useAccountContext();
  const { signMessage, disconnect: disconnectSigner } = useAppSigner();

  // console.log({ walletClient, isError, isLoading });
  const [isCreatingPublicId, setIsCreatingPublicId] = useState<boolean>(false);
  const [errorCreating, setErrorCreating] = useState<Error>();

  const [identity, setIdentity] = useState<Identity>();
  const [publicId, setPublicId] = useState<string>();

  // keep publicId aligned with identity
  useEffect(() => {
    if (identity) {
      const _publicId = identity.getCommitment().toString();
      setPublicId(_publicId);
    }
  }, [identity]);

  // keep identity inline with aaAddress
  useEffect(() => {
    checkStoredIdentity();
  }, [aaAddress, owner, signMessage]);

  const checkStoredIdentity = async () => {
    try {
      const identityStr = localStorage.getItem('identity');
      let create: boolean = false;

      if (identityStr != null) {
        const identity = JSON.parse(identityStr);

        const verify = await getPublicIdentity(identity.aaAddress);
        if (verify === undefined) {
          create = true;
        }

        if (identity.aaAddress === aaAddress) {
          setIdentity(new Identity(identity.identity));
        } else {
          create = true;
        }
      } else {
        create = true;
      }

      if (create) {
        if (!owner) return;
        if (!aaAddress) return;
        if (!signMessage) return;

        console.log('creating publiId', { owner, aaAddress });

        setIsCreatingPublicId(true);

        const secret = await signMessage('Prepare anonymous identity');
        const _identity = new Identity(secret);
        const _publicId = _identity.getCommitment().toString();

        // check identity on DB
        const identity = await getPublicIdentity(aaAddress);

        // if not found, store the identity
        if (identity === undefined) {
          const signature = await signMessage(getControlMessage(_publicId));
          const details: AppPublicIdentity = {
            owner,
            publicId: _publicId,
            aaAddress,
            signature,
          };

          console.log('posting public identity', { details });
          await postIdentity(details);
        }

        // store the secret identity on this device (so we dont have to ask for a signature with metamask from now on)
        localStorage.setItem('identity', JSON.stringify({ identity: _identity.toString(), aaAddress }));
        setIdentity(_identity);
      }

      setIsCreatingPublicId(false);
    } catch (e: any) {
      console.error(e);
      setIsCreatingPublicId(false);
      setErrorCreating(e);
    }
    setIsCreatingPublicId(false);
  };

  // exposes a call to the generateProof function using the connected identity
  const generateProof = identity
    ? async (input: { signal: string; nullifier: string; projectId?: number; treeId?: string }) => {
        return _generateProof({ identity, ...input });
      }
    : undefined;

  const disconnect = () => {
    localStorage.removeItem('identity');
    setIdentity(undefined);
    setPublicId(undefined);
    disconnectSigner();
  };

  return (
    <SemaphoreContextValue.Provider
      value={{
        publicId,
        generateProof,
        isCreatingPublicId,
        errorCreating,
        disconnect,
      }}>
      {props.children}
    </SemaphoreContextValue.Provider>
  );
};

export const useSemaphoreContext = (): SemaphoreContextType => {
  const context = useContext(SemaphoreContextValue);
  if (!context) throw Error('context not found');
  return context;
};
