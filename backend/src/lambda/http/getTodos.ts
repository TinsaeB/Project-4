import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getTodosForUser } from '../../businessLayer/todos'
import { getUserId } from '../utils';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';

/**
 * **********Get all the TODOs for a logged in user
 */

const logger = createLogger('getTodos')

export const handler = middy(
async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Getting todos: ', event)
  
  const userId = getUserId(event)
  const items = await getTodosForUser(userId)

  return {
    statusCode: 200,
    //headers: {'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({items})
  }
})

handler
.use(
  cors({
    credentials: true
  })
)