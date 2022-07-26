import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { Types } from 'aws-sdk/clients/s3';
import { createLogger } from '../utils/logger';

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic
const logger = createLogger('TodosAccess')

export class AttachmentUtils {
    constructor(
        private readonly s3Client: Types = new XAWS.S3({ signatureVersion: 'v4' }),
        private readonly s3BucketName = process.env.ATTACHMENT_S3_BUCKET) {
    }

    async generateUploadURL(todoId: string): Promise<string> {

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 3000,
        });
        
        logger.info('GeneratedURL: ', url);

        return url as string 
    }
}