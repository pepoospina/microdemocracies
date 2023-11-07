import { createContext, useContext } from 'react';

import { useMutation } from 'react-query';
import { useSignMessage } from 'wagmi';
import stringify from 'canonical-json';

import { ConnectedMemberContext, useConnectedMember } from './ConnectedAccountContext';
import { FUNCTIONS_BASE } from '../config/appConfig';
import { AppStatementCreate, SignedObject } from '../types';

export type VoiceSendContextType = {
  proposeStatement?: (statement: string) => Promise<boolean>;
};

interface IVoiceSendContext {
  children: React.ReactNode;
}

const VoiceSendContextValue = createContext<VoiceSendContextType | undefined>(undefined);

export const VoiceSendContext = (props: IVoiceSendContext) => {
  const { tokenId } = useConnectedMember();
  const { signMessageAsync } = useSignMessage();

  const { mutateAsync: sendStatement } = useMutation(async (statement: SignedObject<AppStatementCreate>) => {
    return fetch(FUNCTIONS_BASE + '/voice/statement', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statement),
    });
  });

  const proposeStatement =
    signMessageAsync !== undefined && tokenId !== undefined
      ? async (statement: string) => {
          if (signMessageAsync && tokenId) {
            const object: AppStatementCreate = { author: tokenId, statement };
            const message = stringify(object);
            console.log({ message });
            const signature = await signMessageAsync({
              message,
            });
            const res = await sendStatement({ object, signature });
            const body = await res.json();
            return body.success;
          }
        }
      : undefined;

  return (
    <VoiceSendContextValue.Provider
      value={{
        proposeStatement,
      }}>
      <ConnectedMemberContext>{props.children}</ConnectedMemberContext>
    </VoiceSendContextValue.Provider>
  );
};

export const useVoiceSend = (): VoiceSendContextType => {
  const context = useContext(VoiceSendContextValue);
  if (!context) throw Error('context not found');
  return context;
};
