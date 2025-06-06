import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import swagger-ui-react to avoid server-side build issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const ApiDocs = () => {
  return (
    <SwaggerUI url="/api/docs" />
  );
};

export default ApiDocs;
