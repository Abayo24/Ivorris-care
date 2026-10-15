/**
 * Every photograph used on the site, in one place. Swap a file here and every
 * page that uses it updates. Keep `alt` accurate to what is in the picture.
 *
 * Photos in /public/photos are from Pexels (free for commercial use, no
 * attribution required — https://www.pexels.com/license/):
 *   hero-home-consultation.jpg       Vitaly Gariev       pexels.com/photo/39192354
 *   assessment-conversation.jpg      Cedric Fauntleroy   pexels.com/photo/4266946
 *   post-discharge-home.jpg          Alex Green          pexels.com/photo/5692699
 *   home-nursing-consultation.jpg    Chokniti Khongchum  pexels.com/photo/5593720
 *   family-grandmother-knitting.jpg  Alex Green          pexels.com/photo/5691920
 *   family-grandmother-kitchen.jpg   Alex Green          pexels.com/photo/5692281
 * They are stock images, not Ivorris staff or clients.
 */
export type Photo = { src: string; alt: string };

const consultation: Photo = {
	src: '/photos/hero-home-consultation.jpg',
	alt: 'A healthcare professional sitting on a sofa with an older man, listening as he talks',
};

const conversation: Photo = {
	src: '/photos/assessment-conversation.jpg',
	alt: 'A woman smiling as she talks with a nurse in a calm, comfortable room',
};

const listening: Photo = {
	src: '/photos/home-nursing-consultation.jpg',
	alt: 'A healthcare professional listening closely as a man explains his concerns',
};

export const photos = {
	hero: consultation,
	heroInset: listening,
	careNeedsAssessment: conversation,
	postDischarge: {
		src: '/photos/post-discharge-home.jpg',
		alt: 'An older woman resting in bed at home, sipping water, with her young granddaughter beside her',
	},
	homeNursing: listening,
	familyGuidance: {
		src: '/photos/family-grandmother-knitting.jpg',
		alt: 'A grandmother and her granddaughter laughing together as they knit in an armchair at home',
	},
	whyFamilies: {
		src: '/photos/family-grandmother-kitchen.jpg',
		alt: 'A smiling grandmother sitting in her kitchen with her arm around her young grandson',
	},
	connect: conversation,
	about: consultation,
} satisfies Record<string, Photo>;
