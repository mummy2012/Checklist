import { Injectable } from '@nestjs/common';
import { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand, CopyObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
    static S3listFile(arg0: string) {
      throw new Error('Method not implemented.');
    }
    static S3uploadFile(val: Express.Multer.File, arg1: string): void {
      throw new Error('Method not implemented.');
    }
    private AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    private s3Client = new S3Client({
        endpoint: "https://sgp1.digitaloceanspaces.com",
        region: "ap-southeast-1",
        credentials: {
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_KEY_SECRET,
        }
    });

    async S3deleteFile(file: string) {
        try {
            const params = {
                Bucket: this.AWS_S3_BUCKET,
                Key: file,
            };
            const command = await this.s3Client.send(new DeleteObjectCommand(params));
            return command
        }
        catch (err) {
            throw err;
        }
    }
    async S3downloadFile(file: string) {
        try {
            const params = {
                Bucket: this.AWS_S3_BUCKET,
                Key: file,
            };
            return await this.s3Client.send(new GetObjectCommand(params));
        }
        catch (err) {
            throw err;
        }
    }
    //"checklist/private/example/${id}/${filename}"
    //"checklist/private/${id_shop}/2023_05_28/${mongouid}_${filename}"  เฉพาะข้อสอบที่มีถ่ายรูปหน้าร้าน
    async S3uploadFile(file: Express.Multer.File, locationFile: string) {
        try {
            const stream = Readable.from(file.buffer);
            const params = {
                Bucket: this.AWS_S3_BUCKET,
                Key: locationFile,
                Body: stream,
                ACL: "private",
                ContentType: file.mimetype,
                ContentLength: file.size
            };
            return await this.s3Client.send(new PutObjectCommand(params));
        }
        catch (err) {
            throw err;
        }
    }
    async S3Rename(locationOld: string, locationNew: string) {
        try {
            const params = {
                Bucket: this.AWS_S3_BUCKET,
                CopySource: this.AWS_S3_BUCKET + '/' + locationOld,
                Key: locationNew,
            };
            await this.s3Client.send(new CopyObjectCommand(params));
            await this.S3deleteFile(locationOld);
            return;
        }
        catch (err) {
            throw err
        }
    }
    async S3getUrlFile(file: string, time: number) {
        try {
            const params = {
                Bucket: this.AWS_S3_BUCKET,
                Key: file,
            };
            const command = new GetObjectCommand(params)
            return await getSignedUrl(this.s3Client, command, { expiresIn: time * 60 })
        }
        catch (err) {
            throw err;
        }
    }
    async S3listFile(path: string) {
        try {
            const params = {
                Bucket: this.AWS_S3_BUCKET,
                Prefix: path,
            };
            const command = await this.s3Client.send(new ListObjectsCommand(params));
            return command.Contents
        }
        catch (err) {
            throw err
        }
    }
}