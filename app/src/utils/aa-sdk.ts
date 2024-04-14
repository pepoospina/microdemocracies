import { getDefaultLightAccountFactoryAddress } from '@alchemy/aa-accounts'
import { LightAccountFactoryAbi } from '@alchemy/aa-accounts/src/light-account/abis/LightAccountFactoryAbi'
import { getAccountAddress as getAccountAddressAACore } from '@alchemy/aa-core'
import { getVersion060EntryPoint } from '@alchemy/aa-core/src/entrypoint/0.6'

import { PublicClient, concatHex, encodeFunctionData } from 'viem'

import { HexStr } from '../types'
import { chain } from '../wallet/ConnectedWalletContext'

/**  */
export const getAccountAddress = async (signer: HexStr, client: PublicClient) => {
  const entryPoint = getVersion060EntryPoint(chain as any)
  const factoryAddress = getDefaultLightAccountFactoryAddress(chain as any, 'v1.1.0')

  const getAccountInitCode = async () => {
    const salt = BigInt(0)

    return concatHex([
      factoryAddress,
      encodeFunctionData({
        abi: LightAccountFactoryAbi,
        functionName: 'createAccount',
        args: [signer, salt],
      }),
    ])
  }

  const address = await getAccountAddressAACore({
    client: client as any,
    entryPointAddress: entryPoint.address,
    getAccountInitCode,
  })

  return address
}
