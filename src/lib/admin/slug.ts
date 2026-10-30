/** "Caring for Mum at Home!" → "caring-for-mum-at-home" */
export function slugify(value: string) {
	return value
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 96)
		.replace(/-+$/, '');
}
