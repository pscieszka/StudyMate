import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerDocumentation: React.FC = () => {
    return (
        <div style={{ height: '100vh' }}>
            <SwaggerUI url="http://127.0.0.1:8000/swagger/" />
        </div>
    );
};

export default SwaggerDocumentation;
