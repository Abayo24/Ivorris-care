'use client';

/**
 * Sanity Studio configuration, mounted at /studio.
 * Sign-in and permissions are handled by Sanity: only people invited to the
 * Sanity project (sanity.io/manage → Members) can open the Studio or edit content.
 */
import { defineConfig } from 'sanity';
import { defineLocations, presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
	name: 'ivorris-care',
	title: 'Ivorris Care',
	basePath: '/studio',
	projectId: projectId || 'missing-project-id',
	dataset,
	schema: { types: schemaTypes },
	plugins: [
		structureTool({ structure }),
		presentationTool({
			title: 'Preview',
			previewUrl: {
				initial: '/blog',
				previewMode: { enable: '/api/draft-mode/enable' },
			},
			resolve: {
				locations: {
					post: defineLocations({
						select: { title: 'title', slug: 'slug.current' },
						resolve: (doc) => ({
							locations: doc?.slug
								? [
										{ title: doc.title || 'Untitled', href: `/blog/${doc.slug}` },
										{ title: 'Blog', href: '/blog' },
									]
								: [],
						}),
					}),
				},
			},
		}),
	],
	apiVersion,
});
