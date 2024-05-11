import { Identity } from '@semaphore-protocol/identity'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getPublicIdentity } from '../firestore/getters'
import { I18Keys } from '../i18n/kyel.list'
import { AppPublicIdentity, HexStr } from '../shared/types'
import { getControlMessage } from '../shared/utils/identity.utils'
import { postIdentity } from '../utils/statements'
import { useAccountContext } from '../wallet/AccountContext'
import { useAppSigner } from '../wallet/SignerContext'
import { useLoadingContext } from './LoadingContext'

interface IdentityStored {
  privateKey: string
  aaAddress: HexStr
}

export type SemaphoreContextType = {
  publicId?: string
  identity?: Identity
  isCreatingPublicId: boolean
  errorCreating?: Error
  disconnect: () => void
  isConnected: boolean
}

const DEBUG = true

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
      const _publicId = identity.commitment.toString()
      if (DEBUG) console.log('setPublicId', { _publicId, identity })

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
        const identity = JSON.parse(identityStr) as IdentityStored

        if (!identity.privateKey) {
          console.error('Invalid identity stored- loggedout')
          disconnect()
        }

        const verify = await getPublicIdentity(identity.aaAddress)
        if (verify === undefined) {
          create = true
        }

        if (identity.aaAddress === aaAddress) {
          if (DEBUG)
            console.log('setIdentity - from localStorage', {
              privateKey: identity.privateKey,
            })
          setIdentity(new Identity(identity.privateKey))
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

        setSubtitle(t([I18Keys.waitingIdentitySignature]))

        if (DEBUG) console.log('creating publicId', { address, aaAddress })

        setIsCreatingPublicId(true)

        const secret = await signMessage('Prepare anonymous identity')

        setSubtitle(t([I18Keys.preparingIdentity]))
        if (DEBUG) console.log('setIdentity - secret', { secret })

        const _identity = new Identity(secret)
        const _publicId = _identity.commitment.toString()

        // check identity on DB
        const identity = await getPublicIdentity(aaAddress)

        if (identity && identity.publicId !== _publicId) {
          throw new Error(
            `Unexpected identity for ${aaAddress}. New derived one is ${_publicId}, but stored is ${identity.publicId}`,
          )
        }

        // if not found, store the identity
        if (identity === undefined) {
          setSubtitle(t([I18Keys.waitingIdentityOwnership]))

          const signature = await signMessage(getControlMessage(_publicId))
          const details: AppPublicIdentity = {
            owner: address,
            publicId: _publicId,
            aaAddress,
            signature,
          }

          if (DEBUG) console.log('posting public identity', { details })
          await postIdentity(details)
        }

        // store the secret identity on this device (so we dont have to ask for a signature with metamask from now on)
        console.log('setIdentity - store localStorage', {
          privatekey: _identity.privateKey,
          aaAddress,
        })

        const stored: IdentityStored = { privateKey: _identity.privateKey, aaAddress }
        localStorage.setItem('identity', JSON.stringify(stored))

        if (DEBUG) console.log('setIdentity - from create', stored)
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
