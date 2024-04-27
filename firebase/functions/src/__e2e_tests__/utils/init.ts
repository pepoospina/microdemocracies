import { AppStatement } from '../../@shared/types'
import { HttpConnector } from '../http.connector'

export interface SendResult {}

export const sendStatement = async (
  statement: Partial<AppStatement>,
  http: HttpConnector,
): Promise<SendResult> => {
  return http.post('/voice/statement', statement)
}
