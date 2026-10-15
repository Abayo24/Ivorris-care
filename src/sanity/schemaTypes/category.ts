import { defineField, defineType } from 'sanity';

export const category = defineType({
	name: 'category',
	title: 'Category',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required().max(60),
		}),
		defineField({
			name: 'slug',
			title: 'URL slug',
			type: 'slug',
			options: { source: 'title', maxLength: 64 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
			description: 'One or two sentences shown on the blog when this category is selected.',
			validation: (rule) => rule.max(240),
		}),
	],
});
