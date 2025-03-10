import { getToken } from 'next-auth/jwt';
import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Package from '@/models/Package';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Verify the token
  const token = await getToken({ req, secret });
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Validate the request body
  const { name, description, quantity, isInstantlyBookable, media, pricing } =
    req.body;
  if (
    !name ||
    !description ||
    quantity === undefined ||
    isInstantlyBookable === undefined
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Save the package to MongoDB
    const result = await Package.create({
      venueId: token.venueId, // Get venueId from the token
      name,
      description,
      quantity,
      isInstantlyBookable,
      media,
      pricing, // Include pricing data
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Return the package ID to the client
    res.status(201).json({ packageId: result._id });
  } catch (error) {
    console.error('Error saving package:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
