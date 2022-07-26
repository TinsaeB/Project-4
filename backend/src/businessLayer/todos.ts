import { TodosAccess } from '../DataLayer/todosAcess'
import { AttachmentUtils } from '../DataLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
//import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate';
const logger = createLogger('Todos')
const uuid = require('uuid/v4')
// TODO: Implement businessLogic
const todosAcess = new TodosAccess();
const attachmentUtils  = new AttachmentUtils();

export async function getTodosForUser(userId: string): Promise<TodoItem[]>{
    return todosAcess.getAllToDo(userId);
}
export async function createTodDo(CreateTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem>{
    const todoId = uuid();
    logger.info(todoId);
    const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
    logger.info(s3BucketName);
    return todosAcess.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
        createdAt: new Date().getTime().toString(),
        done: false,
        name: CreateTodoRequest.name,
        dueDate: CreateTodoRequest.dueDate
    });
}
export async function updateToDo(UpdateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoUpdate>{
    return todosAcess.updateToDo(UpdateTodoRequest, todoId, userId);
}
export async function deleteToDo(todoId: string, userId: string): Promise<string>{
    return todosAcess.deleteToDo(todoId, userId);
}
export function createAttachementPresignedUrl(todoId: string): Promise<string>{
    return attachmentUtils.generateUploadURL(todoId);
}