import React, { useEffect, useRef, useState } from 'react';

const FRAME_SERVER_URL = 'http://127.0.0.1:8766';
const POLL_MS = 700;

export default function StreetFighterEmbed({ onInfo }) {
  const [imgSrc, setImgSrc] = useState(null);
  const [serverOnline, setServerOnline] = useState(true);
  const onInfoRef = useRef(onInfo);
  const inFlightRef = useRef(false);
  const timerRef = useRef(null);
  const mountedRef = useRef(false);
  const objectUrlRef = useRef(null);

  useEffect(() => {
    onInfoRef.current = onInfo;
  }, [onInfo]);

  useEffect(() => {
    mountedRef.current = true;

    const loadFrame = async () => {
      if (!mountedRef.current || inFlightRef.current) return;
      inFlightRef.current = true;

      try {
        const res = await fetch(`${FRAME_SERVER_URL}/frame-data`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (data?.image) {
          const base64 = data.image.includes(',') ? data.image.split(',')[1] : data.image;
          const binary = atob(base64);
          const bytes = new Uint8Array(binary.length);
          for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
          }

          const mimeType = data?.mime || 'image/svg+xml';
          const nextUrl = URL.createObjectURL(new Blob([bytes], { type: mimeType }));
          if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = nextUrl;
          if (mountedRef.current) setImgSrc(nextUrl);
        }

        if (mountedRef.current) setServerOnline(true);
        if (data?.info && onInfoRef.current) onInfoRef.current(data.info);
      } catch (error) {
        if (mountedRef.current) setServerOnline(false);
      } finally {
        inFlightRef.current = false;
      }

      if (mountedRef.current) {
        timerRef.current = window.setTimeout(loadFrame, POLL_MS);
      }
    };

    const start = async () => {
      try {
        await fetch(`${FRAME_SERVER_URL}/start`, { method: 'POST' });
      } catch (error) {
        // server may not be ready yet
      }
      await loadFrame();
    };

    start();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '460px',
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(20,20,28,0.98), rgba(8,8,12,0.98))',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 20%, rgba(139,92,246,0.22), transparent 35%), radial-gradient(circle at 80% 24%, rgba(236,72,153,0.18), transparent 34%), radial-gradient(circle at 50% 88%, rgba(34,197,94,0.10), transparent 28%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 24,
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          backdropFilter: 'blur(10px)',
        }}
      />

      {imgSrc ? (
        <img
          src={imgSrc}
          alt="Street Fighter frame"
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            minHeight: '460px',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            minHeight: '460px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'var(--text-dim)', marginBottom: '8px' }}>
                BATTLE STAGE
              </div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: 'white' }}>
                LearnCraft Arena
              </div>
            </div>
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                background: serverOnline ? 'rgba(34,197,94,0.14)' : 'rgba(239,68,68,0.14)',
                color: serverOnline ? '#86efac' : '#fca5a5',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              {serverOnline ? 'FRAME SERVER CONNECTING' : 'OFFLINE FALLBACK'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '18px', alignItems: 'center' }}>
            <div
              style={{
                minHeight: '210px',
                borderRadius: '18px',
                padding: '18px',
                background: 'linear-gradient(180deg, rgba(96,165,250,0.14), rgba(17,24,39,0.36))',
                border: '1px solid rgba(96,165,250,0.18)',
              }}
            >
              <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#93c5fd', marginBottom: '10px' }}>PLAYER</div>
              <div style={{ fontSize: '72px', lineHeight: 1 }}>🧑‍🎓</div>
              <div style={{ marginTop: '12px', color: 'white', fontWeight: 800 }}>Ready for battle</div>
              <div style={{ marginTop: '8px', color: 'var(--text-dim)', fontSize: '13px' }}>Solve the question to attack the enemy.</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '54px', filter: 'drop-shadow(0 0 16px rgba(251,191,36,0.45))' }}>⚔️</div>
              <div style={{ marginTop: '10px', fontSize: '12px', letterSpacing: '3px', color: 'var(--text-dim)' }}>VS</div>
            </div>

            <div
              style={{
                minHeight: '210px',
                borderRadius: '18px',
                padding: '18px',
                background: 'linear-gradient(180deg, rgba(248,113,113,0.16), rgba(17,24,39,0.36))',
                border: '1px solid rgba(248,113,113,0.18)',
              }}
            >
              <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#fca5a5', marginBottom: '10px', textAlign: 'right' }}>ENEMY</div>
              <div style={{ fontSize: '72px', lineHeight: 1, textAlign: 'right' }}>👹</div>
              <div style={{ marginTop: '12px', color: 'white', fontWeight: 800, textAlign: 'right' }}>Syntax Phantom</div>
              <div style={{ marginTop: '8px', color: 'var(--text-dim)', fontSize: '13px', textAlign: 'right' }}>Defeat it by answering correctly.</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ color: 'var(--text-dim)', fontSize: '13px' }}>
              {serverOnline ? 'Loading live frames from the local battle process.' : 'Local frame server unavailable, showing a built-in battle stage instead.'}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(139,92,246,0.16)', color: '#ddd6fe', fontSize: '12px', fontWeight: 700 }}>XP Burst Ready</span>
              <span style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(251,191,36,0.16)', color: '#fde68a', fontSize: '12px', fontWeight: 700 }}>Combo Meter</span>
              <span style={{ padding: '8px 12px', borderRadius: '999px', background: 'rgba(34,197,94,0.16)', color: '#bbf7d0', fontSize: '12px', fontWeight: 700 }}>Question Loop</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
