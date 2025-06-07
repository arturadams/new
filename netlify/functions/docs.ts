import { createSwaggerSpec } from 'next-swagger-doc';

const getSwaggerSpec = () => createSwaggerSpec({
  apiFolder: 'pages/api',
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Data Library API',
      version: '1.0.0',
    },
  },
});

export const handler = async () => {
  const spec = getSwaggerSpec();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(spec),
  };
};
