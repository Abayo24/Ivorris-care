import { defineField, defineType } from 'sanity';

export const author = defineType({
	name: 'author',
	title: 'Author / reviewer',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'name', maxLength: 64 },
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'role',
			title: 'Role',
			type: 'string',
			description: 'For example "Nurse, Ivorris Care". Use only accurate, verifiable titles.',
		}),
		defineField({
			name: 'credentials',
			title: 'Professional credentials',
			type: 'string',
			description:
				'Shown publicly and in search data. Only add qualifications or registrations that have been verified.',
		}),
		defineField({
			name: 'credentialsVerified',
			title: 'Credentials verified',
			type: 'boolean',
			initialValue: false,
			description: 'Credentials are only displayed on the website when this is switched on.',
		}),
		defineField({
			name: 'image',
			title: 'Photo',
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alternative text',
					type: 'string',
					validation: (rule) => rule.required(),
				}),
			],
		}),
		defineField({
			name: 'bio',
			title: 'Short bio',
			type: 'text',
			rows: 4,
			validation: (rule) => rule.max(400),
		}),
	],
	preview: { select: { title: 'name', subtitle: 'role', media: 'image' } },
});
