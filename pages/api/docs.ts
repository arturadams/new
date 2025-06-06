import type { NextApiRequest, NextApiResponse } from 'next';
import { createSwaggerSpec } from 'next-swagger-doc';

export const getSwaggerSpec = () => createSwaggerSpec({
  apiFolder: 'pages/api',
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Data Library API',
      version: '1.0.0',
    },
  },
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const spec = getSwaggerSpec();
  res.status(200).json(spec);
}
