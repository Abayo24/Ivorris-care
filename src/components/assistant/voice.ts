/**
 * Voice for the "Ask Ivorris" assistant, using the browser's built-in speech
 * features (free — no API or account). Voices come from the visitor's device,
 * so the exact voice varies; we prefer a warm female English voice with an
 * Asian accent (India, the Philippines, Singapore, Hong Kong, Malaysia) and
 * fall back to another female English voice.
 */

// Female voices with Asian English accents, in order of preference. Names are
// matched loosely ("Microsoft Neerja Online (Natural) - English (India)").
const PREFERRED_NAMES = [
	'neerja', // Microsoft, English (India), natural
	'rosa', // Microsoft, English (Philippines), natural
	'luna', // Microsoft, English (Singapore), natural
	'yan', // Microsoft, English (Hong Kong), natural
	'heera', // Microsoft, English (India)
	'veena', // Apple, English (India)
	'isha', // Apple, English (India)
	'lekha', // Apple, Hindi/English
	'kajal', // Amazon-style naming on some devices
];
const ASIAN_ENGLISH = ['en-in', 'en-ph', 'en-sg', 'en-hk', 'en-my'];
// Known male voices to skip when guessing by language.
const MALE_NAMES = ['prabhat', 'ravi', 'rishi', 'james', 'wayne', 'sam', 'guy', 'david', 'mark', 'ryan', 'george', 'daniel', 'thomas', 'kunal', 'aarav', 'prakash', 'arjun'];
const FEMALE_HINTS = ['female', 'woman', 'samantha', 'zira', 'hazel', 'susan', 'libby', 'sonia', 'aria', 'jenny', 'emma', 'serena', 'karen', 'moira', 'tessa', 'fiona'];

const has = (voice: SpeechSynthesisVoice, words: string[]) => words.some((w) => voice.name.toLowerCase().includes(w));

export function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
	const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
	for (const name of PREFERRED_NAMES) {
		const match = english.find((v) => v.name.toLowerCase().includes(name));
		if (match) return match;
	}
	const asian = english.filter((v) => ASIAN_ENGLISH.includes(v.lang.toLowerCase().replace('_', '-')) && !has(v, MALE_NAMES));
	if (asian.length) return asian.find((v) => has(v, FEMALE_HINTS)) ?? asian[0];
	// Otherwise a natural-sounding female English voice, then any female, then any English voice.
	return (
		english.find((v) => has(v, ['google']) && has(v, ['female'])) ??
		english.find((v) => has(v, FEMALE_HINTS)) ??
		english.find((v) => !has(v, MALE_NAMES)) ??
		english[0] ??
		null
	);
}

/** Turns a written answer into something that sounds natural when read aloud. */
export function toSpeech(text: string) {
	return text
		.replace(/\n+/g, '. ')
		.replace(/\s*(More at|See|see)\s+\/[a-z/-]+\.?/g, (_m, lead: string) => (lead.toLowerCase() === 'see' ? ' See our website.' : ''))
		.replace(/\s*[—-]\s*\/[a-z/-]+/g, '')
		.replace(/\/[a-z][a-z/-]*/g, 'our website')
		.replace(/•/g, '')
		.replace(/\+254/g, 'plus 2 5 4')
		.replace(/:\s*\./g, ':')
		.replace(/\.\s*\./g, '.')
		// "1. Assess" reads as "Step 1: Assess" (and isn't split into its own sentence).
		.replace(/\b(\d)\.\s/g, 'Step $1: ')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Speaks text as a short queue of sentences (some browsers cut off long
 * utterances). Calls onEnd when finished or cancelled.
 */
export function speak(text: string, voice: SpeechSynthesisVoice | null, onStart: () => void, onEnd: () => void) {
	const synth = window.speechSynthesis;
	synth.cancel();
	const sentences = toSpeech(text).match(/[^.!?]+[.!?]*/g) ?? [text];
	sentences.forEach((sentence, i) => {
		const u = new SpeechSynthesisUtterance(sentence.trim());
		if (voice) {
			u.voice = voice;
			u.lang = voice.lang;
		}
		// Slightly slower and softer reads as warmer and easier to follow.
		u.rate = 0.94;
		u.pitch = 1.06;
		if (i === 0) u.onstart = onStart;
		if (i === sentences.length - 1) {
			u.onend = onEnd;
			u.onerror = onEnd;
		}
		synth.speak(u);
	});
}

/* ── Voice input (speech recognition) ─────────────────────────────────────── */

type RecognitionResultEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
export type Recognition = {
	lang: string;
	interimResults: boolean;
	maxAlternatives: number;
	onresult: ((e: RecognitionResultEvent) => void) | null;
	onend: (() => void) | null;
	onerror: ((e: { error: string }) => void) | null;
	start: () => void;
	stop: () => void;
	abort: () => void;
};

export function createRecognition(): Recognition | null {
	if (typeof window === 'undefined') return null;
	const w = window as unknown as Record<string, (new () => Recognition) | undefined>;
	const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
	return Ctor ? new Ctor() : null;
}
