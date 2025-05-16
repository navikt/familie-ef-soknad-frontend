import styles from './TestComponent.module.css';
import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CSS Modules are working! 🎉</h1>
      <p>This component is styled using scoped CSS Modules.</p>
    </div>
  );
};

export default TestComponent;
