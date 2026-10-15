/**
 * Contact form fields and validation, shared by the browser form and the
 * server route so both apply exactly the same rules.
 *
 * The form deliberately avoids asking for diagnoses or medical records.
 */

export const enquiryTopics = [
	{ value: 'not-sure', label: "I'm not sure what kind of help is needed" },
	{ value: 'hospital-discharge', label: 'Someone has recently come home from hospital' },
	{ value: 'home-nursing', label: 'Nursing support at home' },
	{ value: 'family-guidance', label: 'Guidance for caring for someone at home' },
	{ value: 'connect', label: 'Finding a specialist, service or equipment' },
	{ value: 'other', label: 'Something else' },
] as const;

export const contactMethods = [
	{ value: 'phone', label: 'Phone call' },
	{ value: 'whatsapp', label: 'WhatsApp' },
	{ value: 'email', label: 'Email' },
] as const;

export type ContactMethod = (typeof contactMethods)[number]['value'];
export type EnquiryTopic = (typeof enquiryTopics)[number]['value'];

export type ContactInput = {
	name: string;
	method: ContactMethod;
	email: string;
	phone: string;
	topic: EnquiryTopic;
	message: string;
	consent: boolean;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const MESSAGE_MAX = 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s()-]{7,20}$/;

export function normaliseContact(raw: Record<string, unknown>): ContactInput {
	const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
	return {
		name: str(raw.name, 100),
		method: str(raw.method, 20) as ContactMethod,
		email: str(raw.email, 200),
		phone: str(raw.phone, 30),
		topic: str(raw.topic, 40) as EnquiryTopic,
		message: str(raw.message, MESSAGE_MAX + 1),
		consent: raw.consent === true || raw.consent === 'on' || raw.consent === 'true',
	};
}

export function validateContact(input: ContactInput): ContactErrors {
	const errors: ContactErrors = {};

	if (input.name.length < 2) errors.name = 'Please tell us your name.';

	if (!contactMethods.some((m) => m.value === input.method)) {
		errors.method = 'Please choose how you would like us to contact you.';
	}

	const needsEmail = input.method === 'email';
	const needsPhone = input.method === 'phone' || input.method === 'whatsapp';

	if (needsEmail && !EMAIL_RE.test(input.email)) {
		errors.email = 'Please enter a valid email address, for example name@example.com.';
	} else if (input.email && !EMAIL_RE.test(input.email)) {
		errors.email = 'This email address does not look right.';
	}

	if (needsPhone && !PHONE_RE.test(input.phone)) {
		errors.phone = 'Please enter a phone number we can reach you on, for example +254 700 000 000.';
	} else if (input.phone && !PHONE_RE.test(input.phone)) {
		errors.phone = 'This phone number does not look right.';
	}

	if (!enquiryTopics.some((t) => t.value === input.topic)) {
		errors.topic = 'Please choose the option that fits best — "Something else" is fine.';
	}

	if (input.message.length > MESSAGE_MAX) {
		errors.message = `Please keep your message under ${MESSAGE_MAX} characters.`;
	}

	if (!input.consent) {
		errors.consent = 'Please confirm you are happy for us to use these details to contact you.';
	}

	return errors;
}

export function labelFor<T extends { value: string; label: string }>(list: readonly T[], value: string) {
	return list.find((i) => i.value === value)?.label ?? value;
}
