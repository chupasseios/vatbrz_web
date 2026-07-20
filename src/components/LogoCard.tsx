'use client';
import React, { useState } from 'react';

interface LogoCardProps {
  src: string;
  bg: string;
  downloadName: string;
  dict: any;
}

export default function LogoCard({ src, bg, downloadName, dict }: LogoCardProps) {
  const [showModal, setShowModal] = useState(false);
  const baseName = downloadName.replace('.svg', '');
  
  const handleDownload = (format: 'svg' | 'png', e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = `/logos/${baseName}.${format}`;
    link.download = `${baseName}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowModal(false);
  };

  return (
    <>
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bg,
          width: '100%',
          height: '200px',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          position: 'relative'
        }}
        onClick={() => setShowModal(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
          if (tooltip) tooltip.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
          if (tooltip) tooltip.style.opacity = '0';
        }}
      >
        <img src={src} alt="VATBRZ Logo" style={{ width: '140px', height: 'auto', objectFit: 'contain' }} />
        
        <div 
          className="tooltip"
          style={{
            position: 'absolute',
            bottom: '16px',
            background: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none'
          }}
        >
          Clique para baixar
        </div>
      </div>

      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              background: '#15161E',
              border: '1px solid rgba(250, 250, 255, 0.06)',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: bg, padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', flexShrink: 0 }}>
                <img src={src} alt="VATBRZ Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff' }}>{dict.downloadLogo}</h3>
                <p style={{ color: '#ffffff', margin: 0, fontSize: '14px', lineHeight: 1.5 }}>{dict.chooseFormat}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a 
                href={src} 
                download={downloadName}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.background = 'rgba(13, 219, 110, 0.1)';
                  e.currentTarget.style.borderColor = '#0DDB6E';
                  const badge = e.currentTarget.querySelector('.format-badge') as HTMLElement;
                  if (badge) badge.style.color = '#0DDB6E';
                  const btn = e.currentTarget.querySelector('.download-btn') as HTMLElement;
                  if (btn) btn.style.background = '#0DDB6E';
                  if (btn) btn.style.color = '#050A2D';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  const badge = e.currentTarget.querySelector('.format-badge') as HTMLElement;
                  if (badge) badge.style.color = '#fff';
                  const btn = e.currentTarget.querySelector('.download-btn') as HTMLElement;
                  if (btn) btn.style.background = 'rgba(255, 255, 255, 0.1)';
                  if (btn) btn.style.color = '#fff';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div className="format-badge" style={{ fontSize: '20px', fontWeight: 800, color: '#fff', transition: 'color 0.2s ease' }}>SVG</div>
                  </div>
                  <p style={{ color: '#ffffff', margin: 0, fontSize: '13px', lineHeight: 1.5, paddingRight: '20px' }}>
                    {dict.svgDesc}
                  </p>
                </div>
                <div className="download-btn" style={{ 
                  padding: '10px 20px', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  color: '#fff', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}>
                  {dict.download}
                </div>
              </a>

              <a 
                href={`/logos/${baseName}.png`} 
                download={`${baseName}.png`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.background = 'rgba(13, 219, 110, 0.1)';
                  e.currentTarget.style.borderColor = '#0DDB6E';
                  const badge = e.currentTarget.querySelector('.format-badge') as HTMLElement;
                  if (badge) badge.style.color = '#0DDB6E';
                  const btn = e.currentTarget.querySelector('.download-btn') as HTMLElement;
                  if (btn) btn.style.background = '#0DDB6E';
                  if (btn) btn.style.color = '#050A2D';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  const badge = e.currentTarget.querySelector('.format-badge') as HTMLElement;
                  if (badge) badge.style.color = '#fff';
                  const btn = e.currentTarget.querySelector('.download-btn') as HTMLElement;
                  if (btn) btn.style.background = 'rgba(255, 255, 255, 0.1)';
                  if (btn) btn.style.color = '#fff';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div className="format-badge" style={{ fontSize: '20px', fontWeight: 800, color: '#fff', transition: 'color 0.2s ease' }}>PNG</div>
                  </div>
                  <p style={{ color: '#ffffff', margin: 0, fontSize: '13px', lineHeight: 1.5, paddingRight: '20px' }}>
                    {dict.pngDesc}
                  </p>
                </div>
                <div className="download-btn" style={{ 
                  padding: '10px 20px', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  color: '#fff', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}>
                  {dict.download}
                </div>
              </a>   
            </div>

            <button 
              onClick={() => setShowModal(false)}
              style={{ width: '100%', background: 'transparent', border: '1px solid rgba(250, 250, 255, 0.1)', color: '#ffffff', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s ease', marginTop: '24px' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
