import { defineArrayMember, defineField, defineType } from 'sanity';

/** Rich-text body used for articles. */
export const blockContent = defineType({
	name: 'blockContent',
	title: 'Content',
	type: 'array',
	of: [
		defineArrayMember({
			type: 'block',
			styles: [
				{ title: 'Paragraph', value: 'normal' },
				{ title: 'Heading', value: 'h2' },
				{ title: 'Subheading', value: 'h3' },
				{ title: 'Small heading', value: 'h4' },
				{ title: 'Quote', value: 'blockquote' },
			],
			lists: [
				{ title: 'Bullet list', value: 'bullet' },
				{ title: 'Numbered list', value: 'number' },
			],
			marks: {
				decorators: [
					{ title: 'Bold', value: 'strong' },
					{ title: 'Italic', value: 'em' },
				],
				annotations: [
					defineArrayMember({
						name: 'link',
						title: 'Link',
						type: 'object',
						fields: [
							defineField({
								name: 'href',
								title: 'URL',
								type: 'url',
								description: 'Use a full address (https://…) or a page on this site starting with "/".',
								validation: (rule) =>
									rule
										.required()
										.uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true }),
							}),
						],
					}),
				],
			},
		}),
		defineArrayMember({
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					title: 'Alternative text',
					type: 'string',
					description: 'Describe the image for people who cannot see it.',
					validation: (rule) => rule.required(),
				}),
				defineField({ name: 'caption', title: 'Caption', type: 'string' }),
			],
		}),
	],
});
