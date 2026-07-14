'use client';
import React, { useState } from 'react';

interface ColorCardProps {
  hex: string;
  className: string;
  style?: React.CSSProperties;
}

export default function ColorCard({ hex, className, style }: ColorCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const tempInput = document.createElement("input");
      tempInput.value = hex;
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(hex).catch(() => {});
      }
    } catch (err) {
      console.error(err);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={className} 
      style={{ ...style, cursor: 'pointer', position: 'relative', zIndex: 10, transition: 'transform 0.2s ease', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', userSelect: 'none' }} 
      onClick={handleCopy}
      title="Clique para copiar"
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ flex: 1, width: '100%', pointerEvents: 'none' }}></div>
      <span style={{ fontSize: '12px', opacity: 0.7, fontWeight: 500, marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase', pointerEvents: 'none' }}>
        Clique para copiar
      </span>
      <span style={{ fontSize: '24px', pointerEvents: 'none' }}>{hex}</span>
      
      {copied && (
        <span style={{ 
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          fontSize: '14px', 
          background: '#11121A', 
          color: '#FFFFFF', 
          padding: '6px 12px', 
          borderRadius: '6px',
          fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          zIndex: 20
        }}>
          Copiado!
        </span>
      )}
    </div>
  );
}
