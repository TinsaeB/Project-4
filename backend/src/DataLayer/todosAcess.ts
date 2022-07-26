import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess{
   
    constructor(
        private docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private todoTable = process.env.TODOS_TABLE){}
        private todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
        
    async getAllToDo(userId:string): Promise<TodoItem[]> {

        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todosCreatedAtIndex,
            KeyConditionExpression: '#userId = :userId',
            ExpressionAttributeNames: {
                '#userId': 'userId'
            },
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items


        return items as TodoItem[]
        
    }
    async createToDo(todoItem: TodoItem): Promise<TodoItem>{
            const params = {
                TableName: this.todoTable,
                Item: todoItem,
            };
            const result = await this.docClient.put(params).promise();
            logger.info("todo created", result)

            return todoItem as TodoItem;
        }

    async updateToDo(todoupdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate>{
          const result =  await this.docClient.update( {
                TableName: this.todoTable,
                Key: {
                    "userId": userId,
                    "todoId": todoId
                },
                UpdateExpression: "set #name = :name, #dueDate = :dueDate, #done = :done",
                ExpressionAttributeNames: {
                    "#name": "name",
                    "#dueDate": "dueDate",
                    "#done": "done"
                },
                ExpressionAttributeValues: {
                    ":name": todoupdate.name,
                    ":dueDate": todoupdate.dueDate,
                    ":done": todoupdate.done
                }
            }).promise()
            logger.info("todo updated");
            return result.Attributes as unknown as TodoItem
                        
        }
        async deleteToDo(todoID: string, userID: string): Promise<string> {
            const params = {
                TableName: this.todoTable,
                Key: {
                    "userId": userID,
                    "todoId": todoID,
                }
            };
            const result = await this.docClient.delete(params).promise();
            logger.info("todo deleted",result);

            return "" as string;
    
        }
       
}