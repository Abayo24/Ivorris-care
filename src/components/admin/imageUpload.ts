import { uploadImage } from '@/app/admin/actions';

const MAX_SIDE = 2000;

/**
 * Shrinks a photo to at most 2000px on its longest side and re-encodes it
 * before upload. This keeps pages fast and also drops hidden photo data such
 * as the GPS location a phone camera records.
 */
async function prepare(file: File): Promise<Blob> {
	if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new Error('Please choose a JPG, PNG or WebP image.');
	const bitmap = await createImageBitmap(file);
	const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
	const canvas = document.createElement('canvas');
	canvas.width = Math.round(bitmap.width * scale);
	canvas.height = Math.round(bitmap.height * scale);
	canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
	bitmap.close();
	const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
	// Browsers without WebP encoding fall back to PNG; JPEG is smaller for photos.
	if (blob && blob.type === 'image/webp') return blob;
	const jpeg = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
	if (!jpeg) throw new Error('That image could not be read.');
	return jpeg;
}

/** Resize, upload and return the image's address. Throws a readable message on failure. */
export async function uploadPhoto(file: File) {
	const blob = await prepare(file);
	const form = new FormData();
	form.append('file', blob, blob.type === 'image/webp' ? 'image.webp' : 'image.jpg');
	const result = await uploadImage(form);
	if (!result.ok) throw new Error(result.error);
	return result.url;
}
