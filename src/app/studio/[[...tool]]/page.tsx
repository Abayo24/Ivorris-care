/**
 * Sanity Studio — the content management interface, available at /studio.
 * Editors sign in with their Sanity account; only members invited to the
 * Sanity project can view or change content.
 */
import { NextStudio } from 'next-sanity/studio';

import config from '../../../../sanity.config';
import { isSanityConfigured } from '@/sanity/env';

export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
	if (!isSanityConfigured) {
		return (
			<main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '10vh auto', padding: 24 }}>
				<h1 style={{ fontSize: 28, marginBottom: 12 }}>Content studio not connected yet</h1>
				<p style={{ lineHeight: 1.6 }}>
					Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code> in the
					hosting environment, then redeploy. See <code>docs/OWNER-GUIDE.md</code> for step-by-step instructions.
				</p>
			</main>
		);
	}
	return <NextStudio config={config} />;
}
