import { completeMultipartUpload } from '@/lib/uploadUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { key, uploadId, parts } = req.body;

    if (!key || !uploadId || !parts) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { finalUrl } = await completeMultipartUpload(key, uploadId, parts);
    return res
      .status(200)
      .json({
        message: 'Multipart upload completed successfully',
        key,
        finalUrl,
      });
  } catch (error) {
    console.error('Error completing multipart upload:', error);
    return res
      .status(500)
      .json({ message: 'Failed to complete multipart upload' });
  }
}
