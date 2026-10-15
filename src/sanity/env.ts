export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2025-10-01';

/** True when the CMS has been connected. The public site still works without it. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
