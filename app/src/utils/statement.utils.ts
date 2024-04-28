import { Identity } from '@semaphore-protocol/identity'
import { hashMessage } from 'viem'

import { StatementCreateProofs, StatementReactions } from '../shared/types'
import { getReactionNullifier, getStatementId } from '../shared/utils/identity.utils'
import { getWeek } from '../shared/utils/statements.shared.utils'
import { generateProof } from './identity'

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
  /** one statement per person per week. */
  const period = getWeek(Date.now()).toString()
  const nullifier = period
  const statementHash = hashMessage(_statement)

  const statementProof = await generateProof({
    signal: statementHash,
    nullifier,
    projectId,
    identity,
  })

  if (!statementProof) {
    throw new Error('Could not generate statement proof')
  }

  /** automatically like the statement (statementId is deterministic from proof) */
  const statementId = getStatementId(statementProof.proof)

  const reactionProof = await generateReactionProof(
    statementId,
    statementProof.treeId,
    identity,
    StatementReactions.Back,
  )

  if (!reactionProof) {
    /** statement is brand new, it should not have a reaction already */
    throw new Error('Could not generate reaction proof')
  }

  return {
    statementProof,
    reactionProof,
  }
}
