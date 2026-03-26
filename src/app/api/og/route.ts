import React from 'react';
import { ImageResponse } from 'next/og';
import { getArcBySlug, getScene, getStartScene } from '@/lib/queries';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const arcSlug = searchParams.get('arc') ?? '';
  const lang = searchParams.get('lang') ?? 'en';
  const sceneId = searchParams.get('scene') ?? '';
  const isSquare = searchParams.get('square') === '1';
  const width = isSquare ? 1080 : 1200;
  const height = isSquare ? 1080 : 630;

  const [scene, arc] = await Promise.all([
    sceneId ? getScene(sceneId, lang) : arcSlug ? getStartScene(arcSlug, lang) : Promise.resolve(null),
    arcSlug ? getArcBySlug(arcSlug) : Promise.resolve(null),
  ]);
  const quote = scene?.body?.slice(0, 120) ?? 'A story for you';
  const emotionalKey = arc?.emotional_key ?? 'searching';
  const assetUrl = scene?.slug ? new URL(`/scene-illustrations/${scene.slug}.svg`, request.url).toString() : null;
  const background =
    emotionalKey === 'grief'
      ? '#160A11'
      : emotionalKey === 'doubt'
        ? '#0D1219'
        : emotionalKey === 'curiosity'
          ? '#EDF7F3'
          : emotionalKey === 'anger'
            ? '#0C0A0C'
            : '#120E09';
  const textColor = scene?.light_world ? '#102822' : '#F5EDE0';
  const secondaryColor = scene?.light_world ? 'rgba(16,40,34,0.72)' : 'rgba(245,237,224,0.72)';
  const quoteSurface = scene?.light_world ? 'rgba(255,248,240,0.76)' : 'rgba(7,6,6,0.28)';
  const quoteBorder = scene?.light_world ? 'rgba(16,40,34,0.08)' : 'rgba(255,255,255,0.08)';

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background,
          color: textColor,
          fontFamily: 'Lora, Georgia, serif',
        },
      },
      assetUrl
        ? React.createElement('img', {
            src: assetUrl,
            alt: '',
            style: {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            },
          })
        : null,
      React.createElement('div', {
        style: {
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.58) 100%)',
        },
      }),
      React.createElement(
        'div',
        {
          style: {
            position: 'absolute',
            left: isSquare ? '76px' : '82px',
            right: isSquare ? '76px' : '82px',
            bottom: isSquare ? '86px' : '72px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            alignItems: 'center',
          },
        },
        React.createElement(
          'div',
          {
            style: {
              maxWidth: isSquare ? '860px' : '820px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              padding: isSquare ? '34px 36px' : '30px 34px',
              borderRadius: '34px',
              border: `1px solid ${quoteBorder}`,
              background: quoteSurface,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
            },
          },
          React.createElement(
            'div',
            {
              style: {
                fontSize: isSquare ? 46 : 48,
                lineHeight: 1.34,
                textAlign: 'center',
                fontStyle: 'italic',
              },
            },
            quote,
          ),
        ),
        React.createElement(
          'div',
          {
            style: {
              fontSize: 18,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: secondaryColor,
            },
          },
          'A story for you',
        ),
      ),
    ),
    { width, height },
  );
}
