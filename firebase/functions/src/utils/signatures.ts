import { binary_to_base58 } from 'base58-js'
import stringify from 'canonical-json'
import { sha256 } from 'js-sha256'

import { HexStr, SignedObject } from '../@app/types'
import { getRegistry, publicClient } from './contracts'

export const verifySignedObject = async <T>(
  signed: SignedObject<T>,
  expectedSigner: HexStr,
) => {
  const message = stringify(signed.object)
  const valid = await publicClient.verifyMessage({
    address: expectedSigner,
    message,
    signature: signed.signature,
  })

  if (!valid) {
    throw new Error(`Invalid signer expected ${expectedSigner}`)
  }
}

export const verifySignedStatement = async <T>(
  signed: SignedObject<T>,
  tokenId: number,
  projectAddress: HexStr,
) => {
  const registry = getRegistry(projectAddress)
  const addressOfToken = await registry.read.ownerOf([BigInt(tokenId)])

  await verifySignedObject(signed, addressOfToken)

  /** encode signature to use as statement id */
  const bytes = Uint8Array.from(Buffer.from(signed.signature.slice(2), 'hex'))

  const hash = await sha256(bytes)
  const encoded = binary_to_base58(hash)
  const id = encoded.slice(0, 24)

  return id
}
