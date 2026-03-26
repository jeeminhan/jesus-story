'use client';

import { useEffect, useState } from 'react';

interface ArcBackgroundProps {
  emotionalKey: string | null;
}

export function ArcBackground({ emotionalKey }: ArcBackgroundProps) {
  const [extension, setExtension] = useState<'jpg' | 'png'>('jpg');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setExtension('jpg');
    setFailed(false);
  }, [emotionalKey]);

  if (!emotionalKey || failed) {
    return null;
  }

  return (
    <img
      src={`/images/${emotionalKey}.${extension}`}
      alt=""
      aria-hidden="true"
      onError={() => {
        if (extension === 'jpg') {
          setExtension('png');
          return;
        }
        setFailed(true);
      }}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
        zIndex: 1,
        display: 'block',
      }}
    />
  );
}
