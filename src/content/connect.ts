/**
 * Connect & Coordinate — support Ivorris helps people FIND and CONNECT WITH.
 * These are not services delivered by Ivorris, and no partnership,
 * endorsement or guaranteed availability is implied.
 */
export type ConnectCategory = {
	title: string;
	body: string;
	icon: 'stethoscope' | 'activity' | 'hand' | 'apple' | 'users' | 'wheelchair' | 'microscope' | 'pill' | 'compass';
	href?: string;
};

export const connectCategories: ConnectCategory[] = [
	{
		title: 'Doctors and specialists',
		body: 'When a medical review or specialist opinion may be needed.',
		icon: 'stethoscope',
	},
	{
		title: 'Physiotherapists',
		body: 'For mobility, strength and movement after illness, injury or surgery.',
		icon: 'activity',
	},
	{
		title: 'Occupational therapists',
		body: 'For managing everyday tasks and adapting the home environment.',
		icon: 'hand',
	},
	{
		title: 'Nutrition professionals',
		body: 'For questions about eating, drinking and nutritional needs.',
		icon: 'apple',
	},
	{
		title: 'Caregivers and home-care support',
		body: 'For help with day-to-day personal care and support at home.',
		icon: 'users',
	},
	{
		title: 'Medical equipment and supplies',
		body: 'For mobility aids, beds and other equipment that may make home safer.',
		icon: 'wheelchair',
		href: '/equipment',
	},
	{
		title: 'Diagnostic services',
		body: 'When tests or investigations have been recommended.',
		icon: 'microscope',
	},
	{
		title: 'Pharmacies and medication resources',
		body: 'For medication-related questions and access to supplies.',
		icon: 'pill',
	},
	{
		title: 'Other healthcare and support services',
		body: "If it isn't listed here, ask us. We'll help you think through where to look.",
		icon: 'compass',
	},
];
