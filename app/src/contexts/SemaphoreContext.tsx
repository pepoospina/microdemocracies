import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { useSignMessage } from 'wagmi';

import { Identity } from '@semaphore-protocol/identity';
import { generateProof as _generateProof } from '@semaphore-protocol/proof';

import { useAccountContext } from '../wallet/AccountContext';
import { useAppSigner } from '../wallet/SignerContext';

import { connectIdentity as _connectIdentity } from '../utils/identity';
import { AppGetMerklePass } from '../types';

export type SemaphoreContextType = {
  publicId?: string;
  generateProof?: (signal: string, nullifier: string, merklePass: AppGetMerklePass) => Promise<string>;
};

const SemaphoreContextValue = createContext<SemaphoreContextType | undefined>(undefined);

export const SemaphoreContext = (props: PropsWithChildren) => {
  const { signMessageAsync } = useSignMessage();
  const { owner, aaAddress } = useAccountContext();
  const { address: signerAddress } = useAppSigner();

  const [identity, setIdentity] = useState<Identity>();
  const [publicId, setPublicId] = useState<string>();

  // keep publicId aligned with identity
  useEffect(() => {
    if (identity) {
      const _publicId = identity.getCommitment().toString();
      setPublicId(_publicId);
    }
  }, [identity]);

  const checkStoredIdentity = async () => {
    const identityStr = localStorage.getItem('identity');
    let create: boolean = false;

    if (identityStr != null) {
      const identity = JSON.parse(identityStr);

      if (identity.aaAddress === aaAddress) {
        setIdentity(new Identity(identity.identity));
      } else {
        create = true;
      }
    } else {
      create = true;
    }

    if (create) {
      if (!owner) throw new Error('owner undefined');
      if (!aaAddress) throw new Error('owner undefined');

      const _identity = await _connectIdentity(owner, aaAddress, signMessageAsync);

      // store the secret identity on this device (so we dont have to ask for a signature with metamask from now on)
      localStorage.setItem('identity', _identity.toString());
      setIdentity(identity);
    }
  };

  // keep identity inline with aaAddress
  useEffect(() => {
    checkStoredIdentity();
  }, [aaAddress]);

  const generateProof =
    identity && publicId
      ? async (signal: string, nullifier: string, merklePass: AppGetMerklePass) => {
          const generated = await _generateProof(identity, merklePass, nullifier, signal);
          return generated.proof.toString();
        }
      : undefined;

  return (
    <SemaphoreContextValue.Provider
      value={{
        publicId,
        generateProof,
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
