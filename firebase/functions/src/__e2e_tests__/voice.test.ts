/** initialize firebase admin in test mode */
import { HttpConnector } from './http.connector'
import './index.test'
import { sendStatement } from './utils/init'

describe('voice', () => {
  const httpAlice = new HttpConnector()

  it('post statement', async () => {
    const statement = { statement: 'hellow' }
    await sendStatement(statement, httpAlice)
  })
})
