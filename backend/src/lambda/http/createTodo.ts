import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createLogger } from "../../utils/logger";
import { createTodDo } from '../../businessLayer/todos'
const logger = createLogger('TodosAccess')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const userId =getUserId(event);
    logger.info(userId);
    const toDoItem = await createTodDo(newTodo, userId);
    logger.info(JSON.stringify({"item": toDoItem}));
    return{
      statusCode: 201,
      headers:{
        "Access-Control-Allow-Origin": "*",},
      body: JSON.stringify({"item": toDoItem}),
      }
    }
)

handler.use(
  cors({
    credentials: true
  })
)
