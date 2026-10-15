import { defineQuery } from 'next-sanity';

/*
 * Every public query only reads documents with a slug. Drafts are excluded by
 * the client's "published" perspective, so unpublished articles never reach
 * public visitors.
 */

const authorFields = /* groq */ `
	name,
	"slug": slug.current,
	role,
	"credentials": select(credentialsVerified == true => credentials),
	bio,
	image
`;

const cardFields = /* groq */ `
	_id,
	title,
	"slug": slug.current,
	excerpt,
	publishedAt,
	updatedAt,
	featured,
	isPlaceholder,
	mainImage{..., "lqip": asset->metadata.lqip},
	"category": category->{title, "slug": slug.current},
	"author": author->{${authorFields}},
	"readingMinutes": round(length(pt::text(body)) / 5 / 200)
`;

const listFilter = /* groq */ `
	_type == "post" && defined(slug.current) && _id != $exclude
	&& ($category == "" || category->slug.current == $category)
	&& ($q == "" || title match $q || excerpt match $q || pt::text(body) match $q)
`;

export const postListQuery = defineQuery(`
	*[${listFilter}] | order(publishedAt desc) [$start...$end] {${cardFields}}
`);

export const postCountQuery = defineQuery(`count(*[${listFilter}])`);

export const featuredPostQuery = defineQuery(`
	coalesce(
		*[_type == "post" && defined(slug.current) && featured == true] | order(publishedAt desc)[0],
		*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0]
	){${cardFields}}
`);

export const latestPostsQuery = defineQuery(`
	*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...$limit]{${cardFields}}
`);

export const postsByCategoryQuery = defineQuery(`
	*[_type == "post" && defined(slug.current) && category->slug.current == $category]
		| order(publishedAt desc)[0...$limit]{${cardFields}}
`);

export const categoriesQuery = defineQuery(`
	*[_type == "category" && defined(slug.current) && count(*[_type == "post" && defined(slug.current) && references(^._id)]) > 0]
		| order(title asc){title, "slug": slug.current, description}
`);

export const postBySlugQuery = defineQuery(`
	*[_type == "post" && slug.current == $slug][0]{
		${cardFields},
		_updatedAt,
		body[]{..., _type == "image" => {..., "lqip": asset->metadata.lqip}},
		tags,
		faqs,
		"reviewedBy": reviewedBy->{${authorFields}},
		reviewedAt,
		sources,
		seo,
		"related": coalesce(
			relatedPosts[defined(@->slug.current)]->{${cardFields}},
			[]
		) + *[_type == "post" && defined(slug.current) && _id != ^._id
			&& !(_id in coalesce(^.relatedPosts[]._ref, []))
			&& category._ref == ^.category._ref] | order(publishedAt desc)[0...3]{${cardFields}}
	}
`);

export const postSlugsQuery = defineQuery(`
	*[_type == "post" && defined(slug.current) && seo.noIndex != true && isPlaceholder != true]{
		"slug": slug.current,
		publishedAt,
		updatedAt,
		_updatedAt
	}
`);
