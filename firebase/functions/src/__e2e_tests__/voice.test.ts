/** initialize firebase admin in test mode */
import './index.test';
import { HttpConnector } from './http.connector';
import { sendStatement } from './utils/init';

describe('voice', () => {
  const httpAlice = new HttpConnector();

  it('post statement', async () => {
    const statement = { statement: 'hellow' };
    await sendStatement(statement, httpAlice);
  });
});
