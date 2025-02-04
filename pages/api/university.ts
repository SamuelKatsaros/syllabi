import { NextApiRequest, NextApiResponse } from 'next';

const universityMap: Record<string, string> = {
  nyu: '123e4567-e89b-12d3-a456-426614174000',
  stonybrook: '3884b0da-b578-4e74-b921-e2d52dee1f71',
  harvard: 'ebd6ad52-dedd-4381-be9f-f16fa0686fe0',
  newpaltz: '83705fa6-af38-4e4d-9a72-6115befd90a1'
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const subdomain = req.query.subdomain as string;
  
  console.log('API - Received Subdomain:', subdomain);

  if (!subdomain) {
    return res.status(400).json({ error: 'Subdomain missing' });
  }

  const universityId = universityMap[subdomain.toLowerCase()];

  if (!universityId) {
    return res.status(404).json({ error: 'University not found' });
  }

  return res.status(200).json({ universityId });
}
