import { NextApiRequest, NextApiResponse } from 'next';
import { subdomainToUniversityId } from '@/utils/universityMappings';
import themes from '../../themes.json';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Favicon API called with:', { query: req.query, url: req.url });
  
  try {
    const subdomain = req.query.subdomain as string;
    console.log('Processing favicon for subdomain:', subdomain);

    const universityId = subdomainToUniversityId(subdomain);
    console.log('Mapped to universityId:', universityId);

    const theme = themes[universityId as keyof typeof themes] || themes.default;
    const faviconPath = path.join(process.cwd(), 'public', theme.favicon);
    
    console.log('Attempting to serve favicon from:', faviconPath);

    if (!fs.existsSync(faviconPath)) {
      throw new Error(`Favicon not found at path: ${faviconPath}`);
    }

    const favicon = fs.readFileSync(faviconPath);
    res.setHeader('Content-Type', 'image/x-icon');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.status(200).send(favicon);
  } catch (error) {
    console.error('Favicon error:', error);
    
    try {
      const defaultFaviconPath = path.join(process.cwd(), 'public', themes.default.favicon);
      console.log('Serving default favicon from:', defaultFaviconPath);
      
      const defaultFavicon = fs.readFileSync(defaultFaviconPath);
      res.setHeader('Content-Type', 'image/x-icon');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.status(200).send(defaultFavicon);
    } catch (fallbackError) {
      console.error('Failed to serve default favicon:', fallbackError);
      res.status(500).json({ error: 'Failed to serve favicon' });
    }
  }
} 