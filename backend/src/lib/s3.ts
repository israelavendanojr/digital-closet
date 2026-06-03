import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucket = process.env.S3_BUCKET_NAME!;
const region = process.env.AWS_REGION!;

export async function uploadToS3(buffer: Buffer, mimetype: string, originalname: string): Promise<string> {
  const ext = path.extname(originalname);
  const key = `uploads/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  }));

  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export async function deleteFromS3(imageUrl: string): Promise<void> {
  try {
    const url = new URL(imageUrl);
    const key = url.pathname.slice(1); // remove leading /
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch (err) {
    console.error('Failed to delete S3 object:', err);
  }
}
