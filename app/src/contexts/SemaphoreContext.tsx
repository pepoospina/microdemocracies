import { Identity } from '@semaphore-protocol/identity';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { useSignMessage } from 'wagmi';

import { getPublicIdentity } from '../firestore/getters';
import { useAccountContext } from '../wallet/AccountContext';
import { useAppSigner } from '../wallet/SignerContext';

import { postIdentity } from '../utils/statements';
import { useProjectContext } from './ProjectContext';

export type SemaphoreContextType = {
  connectIdentity?: () => Promise<void>;
};

const SemaphoreContextValue = createContext<SemaphoreContextType | undefined>(undefined);

export const SemaphoreContext = (props: PropsWithChildren) => {
  const { signMessageAsync } = useSignMessage();
  const { owner, aaAddress } = useAccountContext();
  const { address: signerAddress } = useAppSigner();
  const { address: projectAddress } = useProjectContext();

  const [identity, setIdentity] = useState<Identity>();

  // read identity from localstorage
  useEffect(() => {
    const identity = localStorage.getItem('identity');
    if (identity != null) {
      setIdentity(JSON.parse(identity) as Identity);
    }
  }, []);

  /** store the member publicId in the project associated to their address. publicId is
   * the identity commitment. Posts cannot be associated to one publicId */
  const checkStoreId = async (publicId: string) => {
    if (owner && projectAddress && aaAddress) {
      const identity = await getPublicIdentity(owner, projectAddress);

      // store the identity on the db
      if (identity === undefined) {
        await postIdentity({
          projectAddress,
          owner,
          publicId,
          aaAddress,
        });
      }
    }
  };

  /** Derive the sempaphore identity from signer */
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
          const publicId = identity.getCommitment().toString();

          // make sure the identity is stored in the DB
          await checkStoreId(publicId);

          // store the secret identity on this device (so we dont have to ask for a signature with metamask from now on)
          localStorage.setItem('identity', identity.toString());
          setIdentity(identity);
        }
      : undefined;

  return (
    <SemaphoreContextValue.Provider
      value={{
        connectIdentity,
      }}>
      {props.children}
    </SemaphoreContextValue.Provider>
  );
};
