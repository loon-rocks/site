import path from 'node:path';

export const origin = 'https://loon.rocks';
export const docsPath = '/docs';
export const docsDir = path.resolve(process.env.DIVE_DOCS ?? 'dive/docs');
