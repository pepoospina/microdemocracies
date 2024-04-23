import { Context } from 'mocha'

import { test } from './index.test'
import { LocalLogger, LogLevel } from './test.logger'
import { resetDB } from './utils/db'

export type InjectableContext = Readonly<{
  // properties injected using the Root Mocha Hooks
}>

export const logger = new LocalLogger(LogLevel.warn, LogLevel.warn, [
  'Testing authorization',
])

;(global as any).logger = logger

// TestContext will be used by all the test
export type TestContext = Mocha.Context & Context

export const mochaHooks = (): Mocha.RootHookObject => {
  return {
    async beforeAll(this: Mocha.Context) {
      const context: InjectableContext = {}

      await resetDB()

      Object.assign(this, context)
    },

    beforeEach(this: TestContext) {
      // the contents of the Before Each hook
    },

    async afterAll(this: TestContext) {
      await test.cleanup()
    },

    afterEach(this: TestContext) {
      // the contents of the After Each hook
    },
  }
}
