export const universityMap: Record<string, string> = {
  nyu: '123e4567-e89b-12d3-a456-426614174000',
  stonybrook: '3884b0da-b578-4e74-b921-e2d52dee1f71',
  harvard: 'ebd6ad52-dedd-4381-be9f-f16fa0686fe0',
  newpaltz: '83705fa6-af38-4e4d-9a72-6115befd90a1',
  sccc: '937be84f-c8df-40ea-9fc2-e4493d627206'
};

export const subdomainToUniversityId = (subdomain: string): string => {
  return universityMap[subdomain.toLowerCase()] || 'default';
}; 