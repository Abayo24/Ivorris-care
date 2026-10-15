import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Ivorris Care')
		.items([
			S.listItem()
				.title('Articles')
				.schemaType('post')
				.child(
					S.documentTypeList('post')
						.title('Articles')
						.defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
				),
			S.divider(),
			S.documentTypeListItem('category').title('Categories'),
			S.documentTypeListItem('author').title('Authors & reviewers'),
		]);
