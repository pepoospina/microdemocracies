import { hashMessage } from 'viem'
import { AppBackingCreate, AppStatementCreate, SemaphoreProofStrings } from '../types'

export const getIdentityId = (publicId: string) => {
  return publicId.slice(0, 16)
}

export const getControlMessage = (publicId: string) => {
  return `Controlling publicId: ${getIdentityId(publicId)}`
}

export const serializeProof = (proof: any): SemaphoreProofStrings => {
  // to string all NumericString;
  const str = JSON.stringify(proof, (key, value) => {
    return value.toString()
  })
  return JSON.parse(str)
}

export const deserializeProof = (proof: SemaphoreProofStrings): any => {
  // to string all NumericString;
  return JSON.parse(
    JSON.stringify(proof, (key, value) => {
      return value.toString()
    }),
  )
}

export const getTreeId = (projectId: number, root: string) => {
  return `${projectId}-${root.slice(0, 16)}`
}

export const getStatementId = (statement: AppStatementCreate) => {
  const hash = hashMessage(JSON.stringify(statement.proof))
  return hash.slice(0, 18)
}

export const getBackingId = (backing: AppBackingCreate) => {
  const hash = hashMessage(JSON.stringify(backing.proof))
  return hash.slice(0, 18)
}

export const getSupportNullifier = (statementId: string) => {
  return `${statementId}`
}

export const getFlagNullifier = (statementId: string) => {
  return `${statementId}`
}
