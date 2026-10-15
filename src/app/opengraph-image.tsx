import { ImageResponse } from 'next/og';

import { LOGO_MARK_PATH } from '@/components/brand/logoPath';
import { site } from '@/content/site';

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default social sharing image for pages without their own. */
export default function OpengraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					background: '#EBE5DF',
					padding: 72,
					fontFamily: 'Georgia, serif',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
					<svg width='88' height='69' viewBox='0 0 435 341'>
						<path fillRule='evenodd' d={LOGO_MARK_PATH} fill='#596042' />
					</svg>
					<span style={{ fontSize: 44, color: '#23251F' }}>Ivorris Care</span>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ fontSize: 72, lineHeight: 1.08, color: '#23251F', maxWidth: 980 }}>
						Connecting you to the right care, people and resources.
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 36 }}>
						<div style={{ width: 48, height: 8, borderRadius: 8, background: '#FEBF00' }} />
						<span style={{ fontSize: 28, color: '#434832', fontFamily: 'sans-serif' }}>
							Nurse-led healthcare navigation · {site.contact.city}
						</span>
					</div>
				</div>
			</div>
		),
		size,
	);
}
