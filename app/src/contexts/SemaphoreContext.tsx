import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { useSignMessage } from 'wagmi';

import { Identity } from '@semaphore-protocol/identity';
import { generateProof as _generateProof } from '@semaphore-protocol/proof';

import { getPublicIdentity } from '../firestore/getters';
import { useAccountContext } from '../wallet/AccountContext';
import { useAppSigner } from '../wallet/SignerContext';

import { getMerklePass, postIdentity, signObject } from '../utils/statements';
import { useProjectContext } from './ProjectContext';
import { AppPublicIdentity } from '../types';

export type SemaphoreContextType = {
  connectIdentity?: () => Promise<void>;
  publicId?: string;
  generateProof?: (signal: string, nullifier: string) => Promise<string>;
};

const SemaphoreContextValue = createContext<SemaphoreContextType | undefined>(undefined);

export const SemaphoreContext = (props: PropsWithChildren) => {
  const { signMessageAsync } = useSignMessage();
  const { owner, aaAddress } = useAccountContext();
  const { address: signerAddress } = useAppSigner();
  const { address: projectAddress, projectId } = useProjectContext();

  const [identity, setIdentity] = useState<Identity>();
  const [publicId, setPublicId] = useState<string>();

  // keep publicId aligned with identity
  useEffect(() => {
    if (identity) {
      const _publicId = identity.getCommitment().toString();
      setPublicId(_publicId);
    }
  }, [identity]);

  // read identity from localstorage
  useEffect(() => {
    const identity = localStorage.getItem('identity');
    if (identity != null) {
      setIdentity(new Identity(identity));
    }
  }, []);

  /** store the member publicId in the project associated to their address. publicId is
   * the identity commitment. Posts cannot be associated to one publicId */
  const checkStoreId = async (publicId: string) => {
    if (owner && projectId && aaAddress && signMessageAsync) {
      const identity = await getPublicIdentity(owner, projectId);

      // store the identity on the db
      if (identity === undefined) {
        const details: AppPublicIdentity = {
          projectId,
          owner,
          publicId,
          aaAddress,
        };

        const signed = await signObject(details, signMessageAsync);
        await postIdentity(signed);
      }
    }
  };

  /** Derive the sempaphore identity from signer */
  console.log({ signMessageAsync, signerAddress, owner });

  const connectIdentity =
    signMessageAsync !== undefined && signerAddress !== undefined && owner !== undefined
      ? async () => {
          setIdentity(undefined);
          localStorage.removeItem('identity');

          if (signerAddress !== owner) {
            throw new Error('Signer not the owner of the connected account');
          }

          const secret = await signMessageAsync({ message: 'Prepare anonymous identity' });
          const identity = new Identity(secret);
          const _publicId = identity.getCommitment().toString();

          // make sure the identity is stored in the DB
          await checkStoreId(_publicId);

          // store the secret identity on this device (so we dont have to ask for a signature with metamask from now on)
          localStorage.setItem('identity', identity.toString());
          setIdentity(identity);
        }
      : undefined;

  const generateProof =
    identity && projectId && publicId
      ? async (signal: string, nullifier: string) => {
          const merklePass = await getMerklePass({
            projectId,
            publicId,
          });
          const generated = await _generateProof(identity, merklePass, nullifier, signal);
          return generated.proof.toString();
        }
      : undefined;

  return (
    <SemaphoreContextValue.Provider
      value={{
        connectIdentity,
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
