/**
 * Builds seed/starter-content.ndjson — starter categories and three SAMPLE
 * articles for the Sanity dataset.
 *
 *   node seed/build-starter-content.mjs
 *   npx sanity dataset import seed/starter-content.ndjson production
 *
 * Articles are imported as unpublished drafts, flagged "Demonstration content".
 * They contain general, plain-language guidance only and must be reviewed by
 * a qualified professional (and given a featured image) before publishing.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

let k = 0;
const key = () => `k${(k++).toString(36)}`;
const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks });
const p = (text) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [span(text)] });
const h2 = (text) => ({ _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [span(text)] });
const li = (text) => ({ _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span(text)] });
const linkP = (before, label, href, after) => {
	const mk = key();
	return {
		_type: 'block',
		_key: key(),
		style: 'normal',
		markDefs: [{ _type: 'link', _key: mk, href }],
		children: [span(before), span(label, [mk]), span(after)],
	};
};
const ref = (id) => ({ _type: 'reference', _ref: id });

const categories = [
	['understanding-care-needs', 'Understanding Care Needs', 'Recognising when someone may need support, and what kind.'],
	['home-nursing', 'Home Nursing', 'What nursing support at home involves and how to arrange it well.'],
	['hospital-discharge-and-recovery', 'Hospital Discharge and Recovery', 'Preparing for the move home after a hospital stay, surgery or illness.'],
	['family-caregiving', 'Family Caregiving', 'Practical guidance for families caring for someone at home.'],
	['finding-healthcare-support', 'Finding Healthcare Support', 'Finding the right professionals, services and resources.'],
	['care-planning-and-resources', 'Care Planning and Resources', 'Planning ahead and making sense of the options available.'],
].map(([slug, title, description]) => ({
	_id: `category-${slug}`,
	_type: 'category',
	title,
	slug: { _type: 'slug', current: slug },
	description,
}));

const now = new Date().toISOString();

const posts = [
	{
		id: 'sample-extra-support-at-home',
		title: 'How to Know When a Loved One Needs Extra Support at Home',
		category: 'understanding-care-needs',
		excerpt:
			'Small changes in everyday life can be the first sign that someone needs more support. Here are some common signs families notice, and what a sensible next step can look like.',
		tags: ['care needs', 'older adults', 'family'],
		body: [
			p("It isn't always obvious when someone needs more help. Changes often happen gradually, and the person themselves may not mention them. Families usually notice something first — a feeling that things aren't quite as they were."),
			h2('Signs families often notice'),
			p('Every person is different, but some changes are worth paying attention to:'),
			li('Everyday tasks such as cooking, washing or getting dressed seem harder than before.'),
			li('Moving around the home has become slower, or there have been trips or falls.'),
			li('Meals are being skipped, or food in the house is going unused.'),
			li('Medicines seem to be missed, doubled up or confused.'),
			li('The person seems more withdrawn, worried or forgetful than usual.'),
			li('The family member doing most of the caring is becoming exhausted.'),
			h2("What to do if you're unsure"),
			p("Noticing a change doesn't mean you need to have the answer. A useful first step is simply to write down what you have noticed and when — it makes a later conversation with a professional much easier."),
			p("If someone's health has changed suddenly, or you are worried they are unwell, contact a doctor or healthcare professional promptly. In an emergency, contact emergency services."),
			h2('How an assessment can help'),
			linkP(
				'A nurse-led ',
				'care needs assessment',
				'/services/care-needs-assessment',
				" looks at the person's whole situation — daily living, mobility, safety and the support around them — and helps the family understand what kind of support may be appropriate and what the next step could be.",
			),
		],
		faqs: [
			{
				question: "My parent says they're fine. Should I still be concerned?",
				answer:
					"Many people don't want to worry their families. Gently share what you've noticed, listen to how they feel, and consider getting a professional perspective together.",
			},
		],
	},
	{
		id: 'sample-before-coming-home-from-hospital',
		title: 'What Families Should Consider Before Bringing a Loved One Home From Hospital',
		category: 'hospital-discharge-and-recovery',
		excerpt:
			'Leaving hospital is a big step. A few practical questions, asked early, can make the move home feel calmer and safer for everyone.',
		tags: ['hospital discharge', 'recovery', 'planning'],
		body: [
			p('The move from hospital to home can feel like a relief and a worry at the same time. Planning ahead — even a little — helps families feel more prepared.'),
			h2('Questions worth asking before discharge'),
			li('What should we expect over the first few days and weeks at home?'),
			li('Are there any follow-up appointments, and who arranges them?'),
			li('What medicines are being prescribed, and have any changed?'),
			li('Are there warning signs that mean we should seek medical help?'),
			li('Will any equipment or adjustments at home be needed?'),
			p('Write the answers down. It is easy to forget details on a busy discharge day.'),
			h2('Preparing the home'),
			p('Think about how the person will move around: the route from bed to bathroom, steps and stairs, lighting at night, and whether loose rugs or clutter could cause trips.'),
			h2('Who will help, and when?'),
			p("Be realistic about what family members can manage. It's okay to ask for help — from relatives, friends or professionals — before everyone becomes exhausted."),
			linkP(
				'If you are unsure what support is needed, a ',
				'post-discharge nursing assessment',
				'/services/post-discharge-nursing-assessment',
				' can help you understand the transition home and whether additional support may be appropriate. Always follow the advice of the hospital team and the person’s doctor.',
			),
		],
		faqs: [],
	},
	{
		id: 'sample-questions-home-nursing',
		title: 'Questions to Ask When Arranging Home Nursing',
		category: 'home-nursing',
		excerpt:
			'Arranging nursing care at home is an important decision. These questions can help you understand what is being offered and whether it fits your situation.',
		tags: ['home nursing', 'questions to ask'],
		body: [
			p("When someone needs nursing support at home, families often aren't sure what to ask. Good questions help you understand exactly what will be provided — and what won't."),
			h2('About the care'),
			li('What nursing support will be provided, and what is outside the scope of the service?'),
			li('Who will provide the care, and what are their professional qualifications?'),
			li('How often will visits happen, and how long will they last?'),
			li('How will changes in the person’s condition be noticed and communicated?'),
			h2('About working together'),
			li('How will the nurse work with the person’s doctor and any other professionals?'),
			li('Who should the family contact with questions between visits?'),
			li('How will the care be reviewed as needs change?'),
			h2('About practicalities'),
			li('What will it cost, and how is billing handled?'),
			li('What happens if a visit needs to be rescheduled?'),
			p("A good provider will welcome these questions and answer them clearly. If something isn't clear, ask again."),
			linkP(
				'If you would like to talk through your situation first, ',
				'get in touch with Ivorris',
				'/contact',
				'. We can help you understand what kind of support may be appropriate.',
			),
		],
		faqs: [],
	},
];

const docs = [
	...categories,
	...posts.map((post) => ({
		_id: `drafts.${post.id}`,
		_type: 'post',
		title: post.title,
		slug: { _type: 'slug', current: post.id.replace(/^sample-/, '') },
		excerpt: post.excerpt,
		category: ref(`category-${post.category}`),
		tags: post.tags,
		publishedAt: now,
		isPlaceholder: true,
		featured: false,
		body: post.body,
		...(post.faqs.length ? { faqs: post.faqs.map((f) => ({ _type: 'faq', _key: key(), ...f })) } : {}),
	})),
];

const out = fileURLToPath(new URL('./starter-content.ndjson', import.meta.url));
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join('\n') + '\n');
console.log(`Wrote ${docs.length} documents to ${out}`);
