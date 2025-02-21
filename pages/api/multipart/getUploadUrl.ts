import { generatePartUploadUrl } from '@/lib/uploadUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { key, uploadId, partNumber } = req.body;

    if (!key || !uploadId || !partNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const uploadUrl = await generatePartUploadUrl(key, uploadId, partNumber);
    return res.status(200).json({ uploadUrl });
  } catch (error) {
    console.error('Error generating part upload URL:', error);
    return res
      .status(500)
      .json({ message: 'Failed to generate part upload URL' });
  }
}
