import type { Category } from '@/lib/blog/types';

/**
 * Article categories. Four match the nurse-led services (see relatedCategory
 * in services.ts), so each service page can show its related articles.
 * Only categories that have published articles appear on the blog.
 */
export const categories: Category[] = [
	{
		title: 'Understanding Care Needs',
		slug: 'understanding-care-needs',
		description: 'Recognising when someone may need support, and what kind.',
	},
	{
		title: 'Home Nursing',
		slug: 'home-nursing',
		description: 'What nursing support at home involves and how to arrange it well.',
	},
	{
		title: 'Hospital Discharge and Recovery',
		slug: 'hospital-discharge-and-recovery',
		description: 'Preparing for the move home after a hospital stay, surgery or illness.',
	},
	{
		title: 'Family Caregiving',
		slug: 'family-caregiving',
		description: 'Practical guidance for families caring for someone at home.',
	},
	{
		title: 'Finding Healthcare Support',
		slug: 'finding-healthcare-support',
		description: 'Finding the right professionals, services and resources.',
	},
	{
		title: 'Care Planning and Resources',
		slug: 'care-planning-and-resources',
		description: 'Planning ahead and making sense of the options available.',
	},
];

export function categoryBySlug(slug: string | undefined) {
	return categories.find((c) => c.slug === slug);
}
