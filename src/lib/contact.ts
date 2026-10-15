/**
 * Contact form fields and validation. The form doesn't send anything to a
 * server: it opens WhatsApp with the visitor's message ready to send to
 * Ivorris, so nothing is stored by the website.
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

export type EnquiryTopic = (typeof enquiryTopics)[number]['value'];

export type ContactInput = {
	name: string;
	topic: EnquiryTopic;
	message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const MESSAGE_MAX = 600;

export function normaliseContact(raw: Record<string, unknown>): ContactInput {
	const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
	return {
		name: str(raw.name, 100),
		topic: str(raw.topic, 40) as EnquiryTopic,
		message: str(raw.message, MESSAGE_MAX + 1),
	};
}

export function validateContact(input: ContactInput): ContactErrors {
	const errors: ContactErrors = {};
	if (input.name.length < 2) errors.name = 'Please tell us your name.';
	if (!enquiryTopics.some((t) => t.value === input.topic)) {
		errors.topic = 'Please choose the option that fits best — "Something else" is fine.';
	}
	if (input.message.length > MESSAGE_MAX) {
		errors.message = `Please keep your message under ${MESSAGE_MAX} characters.`;
	}
	return errors;
}

/** The WhatsApp message the visitor sends to Ivorris. */
export function buildWhatsAppMessage(input: ContactInput) {
	const topic = enquiryTopics.find((t) => t.value === input.topic)?.label ?? 'General enquiry';
	return [`Hello Ivorris, my name is ${input.name}.`, `I'm getting in touch about: ${topic}.`, input.message]
		.filter(Boolean)
		.join('\n\n');
}
