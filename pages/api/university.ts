import { NextApiRequest, NextApiResponse } from 'next';

const universityMap: Record<string, string> = {
  nyu: '123e4567-e89b-12d3-a456-426614174000',
  stonybrook: '3884b0da-b578-4e74-b921-e2d52dee1f71',
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subdomain } = req.query;

  console.log('API - Received Subdomain:', subdomain);

  if (!subdomain || typeof subdomain !== 'string') {
    return res.status(400).json({ error: 'Subdomain missing or invalid' });
  }

  const universityId = universityMap[subdomain.toLowerCase()];

  if (!universityId) {
    return res.status(404).json({ error: 'University ID not found' });
  }

  return res.status(200).json({ universityId });
}
