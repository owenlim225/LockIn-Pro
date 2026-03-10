import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LockIn Pro',
    short_name: 'LockIn Pro',
    description: 'LockIn Pro helps you track daily habits with gamification, streaks, leagues, and achievements.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#ffd700',
    background_color: '#f8f6f0',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
