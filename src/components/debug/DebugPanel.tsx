import { useState } from 'react';

interface DebugPanelProps {
  isLoading: boolean;
  resourceCount: number;
  tab: string;
  cacheStatus: string;
}

export const DebugPanel = ({ isLoading, resourceCount, tab, cacheStatus }: DebugPanelProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999 }}>
      <button
        onClick={() => {
          console.log('Debug button clicked');
          setIsVisible(!isVisible);
        }}
        style={{
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '8px 12px',
          border: 'none',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer'
        }}
      >
        DEBUG
      </button>
      {isVisible && (
        <div style={{
          backgroundColor: 'black',
          color: 'white',
          padding: '12px',
          borderRadius: '4px',
          marginTop: '8px',
          fontSize: '12px',
          maxWidth: '200px'
        }}>
          <div>Loading: {isLoading ? 'YES' : 'NO'}</div>
          <div>Resources: {resourceCount}</div>
          <div>Tab: {tab}</div>
          <div>Cache: {cacheStatus}</div>
        </div>
      )}
    </div>
  );
};