import React from 'react';
import { ImageResponse } from 'next/og';
import { getStartScene } from '@/lib/queries';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const arcSlug = searchParams.get('arc') ?? '';
  const lang = searchParams.get('lang') ?? 'en';
  const isSquare = searchParams.get('square') === '1';
  const isCarrier = searchParams.get('carrier') === '1';
  const note = searchParams.get('note')?.trim() ?? '';
  const width = isSquare ? 1080 : 1200;
  const height = isSquare ? 1080 : 630;

  const scene = arcSlug ? await getStartScene(arcSlug, lang) : null;
  const quote = scene?.body?.slice(0, 120) ?? 'A story for you';

  if (isCarrier) {
    return new ImageResponse(
      React.createElement(
        'div',
        {
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            background: '#1a1508',
            color: '#ffffff',
            padding: '80px',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontFamily: 'Lora, Georgia, serif',
          },
        },
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '920px',
            },
          },
          React.createElement(
            'div',
            {
              style: {
                fontSize: isSquare ? 52 : 56,
                lineHeight: 1.25,
              },
            },
            quote,
          ),
          note
            ? React.createElement(
                'div',
                {
                  style: {
                    fontSize: 26,
                    lineHeight: 1.4,
                    fontStyle: 'italic',
                    opacity: 0.86,
                  },
                },
                `Note from them: ${note.slice(0, 200)}`,
              )
            : null,
          React.createElement(
            'div',
            {
              style: {
                fontSize: 22,
                lineHeight: 1.3,
                opacity: 0.74,
              },
            },
            'shared by a friend',
          ),
        ),
      ),
      { width, height },
    );
  }

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0d0a05',
          color: '#ffffff',
          padding: '80px',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'Lora, Georgia, serif',
          fontSize: 56,
          lineHeight: 1.25,
        },
      },
      quote,
    ),
    { width, height },
  );
}
