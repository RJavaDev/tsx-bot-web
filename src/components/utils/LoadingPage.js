import React from 'react';
import { Spin } from 'antd';

const LoadingPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default LoadingPage;