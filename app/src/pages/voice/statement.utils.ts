import { generateProof } from '../../utils/identity'
import { getReactionNullifier, getStatementId } from '../../utils/identity.utils'
import { StatementCreateProofs, StatementReactions } from '../../types'
import { Identity } from '@semaphore-protocol/identity'
import { hashMessage } from 'viem'

export const generateReactionProof = async (
  statementId: string,
  treeId: string,
  identity: Identity,
  reaction: StatementReactions,
) => {
  return generateProof({
    signal: hashMessage(reaction),
    nullifier: getReactionNullifier(statementId),
    treeId,
    identity,
  })
}

export const generateStatementProof = async (
  _statement: string,
  projectId: number,
  identity: Identity,
): Promise<StatementCreateProofs> => {
  const nullifier = Date.now().toString()
  const statementHash = hashMessage(_statement)

  const statementProof = await generateProof({
    signal: statementHash,
    nullifier,
    projectId,
    identity,
  })

  /** automatically like the statement (statementId is deterministic from proof) */
  const statementId = getStatementId(statementProof.proof)

  const reactionProof = await generateReactionProof(
    statementId,
    statementProof.treeId,
    identity,
    StatementReactions.Back,
  )

  return {
    statementProof,
    reactionProof,
  }
}
