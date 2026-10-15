import { createImageUrlBuilder } from '@sanity/image-url';

import { dataset, projectId } from './env';
import type { SanityImage } from './types';

const builder = createImageUrlBuilder({ projectId: projectId || 'missing', dataset });

/** Returns a CDN URL for a Sanity image, or null when the image has no asset. */
export function urlForImage(image: SanityImage | null | undefined, width = 1200, height?: number) {
	if (!image?.asset?._ref) return null;
	let img = builder.image(image).width(width).auto('format').fit('crop');
	if (height) img = img.height(height);
	return img.url();
}
