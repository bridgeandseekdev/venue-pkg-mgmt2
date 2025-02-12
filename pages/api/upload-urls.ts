import { NextApiRequest, NextApiResponse } from "next";
import { generateUploadUrl } from "@/lib/uploadUtils";
import { nanoid } from "nanoid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {contentType, fileType} = req.body;

    const fileExtension = contentType.split('/')[1];
    const key = `${fileType}/${nanoid()}.${fileExtension}`;

    const uploadUrl = await generateUploadUrl(key, contentType);

    res.status(200).json({ key, uploadUrl, finalUrl:`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ message: 'Error generating upload URL' });
  }
}