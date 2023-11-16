import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

import { Identity } from '@semaphore-protocol/identity';
import { generateProof as _generateProof } from '@semaphore-protocol/proof';

import { useAccountContext } from '../wallet/AccountContext';

import { connectIdentity as _connectIdentity } from '../utils/identity';
import { AppGetMerklePass, AppPublicIdentity, HexStr } from '../types';
import { getPublicIdentity } from '../firestore/getters';
import { getControlMessage } from '../utils/identity.basic';
import { postIdentity } from '../utils/statements';
import { useAppSigner } from '../wallet/SignerContext';

export type SemaphoreContextType = {
  publicId?: string;
  generateProof?: (signal: string, nullifier: string, merklePass: AppGetMerklePass) => Promise<string>;
};

const SemaphoreContextValue = createContext<SemaphoreContextType | undefined>(undefined);

export const SemaphoreContext = (props: PropsWithChildren) => {
  const { owner, aaAddress } = useAccountContext();
  const { signMessage } = useAppSigner();

  // console.log({ walletClient, isError, isLoading });

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
  }, [aaAddress]);

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
      if (!signMessage) throw new Error('signMessage undefined');

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

        await postIdentity(details);
      }

      // store the secret identity on this device (so we dont have to ask for a signature with metamask from now on)
      localStorage.setItem('identity', JSON.stringify({ identity: _identity.toString(), aaAddress }));
      setIdentity(_identity);
    }
  };

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
