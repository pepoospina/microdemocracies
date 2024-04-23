import { Identity } from '@semaphore-protocol/identity'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getPublicIdentity } from '../firestore/getters'
import { AppPublicIdentity } from '../types'
import { getControlMessage } from '../utils/identity.utils'
import { postIdentity } from '../utils/statements'
import { useAccountContext } from '../wallet/AccountContext'
import { useAppSigner } from '../wallet/SignerContext'
import { useLoadingContext } from './LoadingContext'

export type SemaphoreContextType = {
  publicId?: string
  identity?: Identity
  isCreatingPublicId: boolean
  errorCreating?: Error
  disconnect: () => void
  isConnected: boolean
}

const SemaphoreContextValue = createContext<SemaphoreContextType | undefined>(undefined)

export const SemaphoreContext = (props: PropsWithChildren) => {
  const { t } = useTranslation()
  const { setLoading, setTitle, setSubtitle, setUserCanClose } = useLoadingContext()

  const { signMessage, disconnect: disconnectSigner, address } = useAppSigner()
  const { aaAddress, isConnected: isAccountConnected } = useAccountContext()

  const [isCreatingPublicId, setIsCreatingPublicId] = useState<boolean>(false)
  const [errorCreating, setErrorCreating] = useState<Error>()

  const [identity, setIdentity] = useState<Identity>()
  const [publicId, setPublicId] = useState<string>()
  const [isConnected, setIsConnected] = useState<boolean>(false)

  // keep publicId aligned with identity
  useEffect(() => {
    if (isAccountConnected && identity) {
      const _publicId = identity.getCommitment().toString()
      setPublicId(_publicId)
      setIsConnected(true)
      setLoading(false)
    }
  }, [identity, isAccountConnected])

  // keep identity inline with aaAddress
  useEffect(() => {
    checkStoredIdentity()
  }, [aaAddress, address])

  const checkStoredIdentity = async () => {
    try {
      const identityStr = localStorage.getItem('identity')
      let create: boolean = false

      if (identityStr != null) {
        const identity = JSON.parse(identityStr)

        const verify = await getPublicIdentity(identity.aaAddress)
        if (verify === undefined) {
          create = true
        }

        if (identity.aaAddress === aaAddress) {
          setIdentity(new Identity(identity.identity))
        } else {
          create = true
        }
      } else {
        create = true
      }

      if (create) {
        if (!address) return
        if (!aaAddress) return
        if (!signMessage) return

        setSubtitle(t('waitingIdentitySignature'))

        console.log('creating publiId', { address, aaAddress })

        setIsCreatingPublicId(true)

        const secret = await signMessage('Prepare anonymous identity')

        setSubtitle(t('preparingIdentity'))
        const _identity = new Identity(secret)
        const _publicId = _identity.getCommitment().toString()

        // check identity on DB
        const identity = await getPublicIdentity(aaAddress)

        // if not found, store the identity
        if (identity === undefined) {
          setSubtitle(t('waitingIdentityOwnership'))

          const signature = await signMessage(getControlMessage(_publicId))
          const details: AppPublicIdentity = {
            owner: address,
            publicId: _publicId,
            aaAddress,
            signature,
          }

          console.log('posting public identity', { details })
          await postIdentity(details)
        }

        // store the secret identity on this device (so we dont have to ask for a signature with metamask from now on)
        localStorage.setItem(
          'identity',
          JSON.stringify({ identity: _identity.toString(), aaAddress }),
        )
        setIdentity(_identity)
      }

      setIsCreatingPublicId(false)
    } catch (e: any) {
      console.error(e)
      setIsCreatingPublicId(false)
      setErrorCreating(e)
      setUserCanClose(true)
    }
    setIsCreatingPublicId(false)
  }

  const disconnect = () => {
    localStorage.removeItem('identity')
    setIdentity(undefined)
    setPublicId(undefined)
    setIsConnected(false)
    disconnectSigner()
  }

  return (
    <SemaphoreContextValue.Provider
      value={{
        publicId,
        identity,
        isCreatingPublicId,
        errorCreating,
        disconnect,
        isConnected,
      }}
    >
      {props.children}
    </SemaphoreContextValue.Provider>
  )
}

export const useSemaphoreContext = (): SemaphoreContextType => {
  const context = useContext(SemaphoreContextValue)
  if (!context) throw Error('context not found')
  return context
}
