/**
 * Every photograph used on the site, in one place. Swap a file here and every
 * page that uses it updates. Keep `alt` accurate to what is in the picture.
 *
 * Photos in /public/photos were supplied by Ivorris, named for where they go.
 * About and Connect & Coordinate had no photo of their own, so they reuse the
 * closest match.
 */
export type Photo = { src: string; alt: string };

const intro: Photo = {
	src: '/photos/intro.jpg',
	alt: 'A yellow stethoscope curled around a red paper heart on a pale green background',
};

const nurseLedHome: Photo = {
	src: '/photos/nurse-led-home-service.jpg',
	alt: 'Seen from above, a healthcare professional holds a medicine bottle and writes on a clipboard across a table from an older person',
};

const whyChoose: Photo = {
	src: '/photos/why-choose-ivorris.jpg',
	alt: "A nurse in green scrubs with a stethoscope holding a person's hands reassuringly",
};

export const photos = {
	hero: intro,
	// intro.jpg on a wider canvas, its plain background continued to the left.
	heroWide: { ...intro, src: '/photos/intro-wide.jpg' },
	heroInset: intro,
	careNeedsAssessment: {
		src: '/photos/care-needs-assessment.jpg',
		alt: 'Wooden letter tiles spelling the word CARE on a table, with plants blurred behind them',
	},
	postDischarge: {
		src: '/photos/post-discharge-nursing.jpg',
		alt: 'A person taking notes on a clipboard while someone rests on a sofa nearby',
	},
	homeNursing: nurseLedHome,
	familyGuidance: {
		src: '/photos/family-care-guidance.jpg',
		alt: 'An older man in glasses writing on a clipboard at a table while a younger woman sits beside him, looking on',
	},
	whyFamilies: whyChoose,
	connect: nurseLedHome,
	about: whyChoose,
} satisfies Record<string, Photo>;
