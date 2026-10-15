/**
 * Medical equipment leasing — carried over from the previous website.
 * Confirm current stock, terms and pricing with the owner before changing.
 */
export const equipmentCategories = [
	{
		name: 'Hospital beds',
		items: [
			'Electric adjustable beds',
			'Manual fowler beds',
			'Paediatric cot beds',
			'Pressure-relief mattresses',
			'Bed rails & cot sides',
		],
	},
	{
		name: 'Mobility aids',
		items: [
			'Standard wheelchairs',
			'Transport & commode chairs',
			'Zimmer walking frames',
			'Elbow & axillary crutches',
			'Quad canes & walking sticks',
		],
	},
	{
		name: 'Oxygen equipment',
		items: [
			'Home oxygen concentrators',
			'Portable oxygen cylinders',
			'Nebulizer machines',
			'Suction machines',
			'CPAP/BiPAP devices',
		],
	},
	{
		name: 'Monitoring devices',
		items: [
			'Digital blood pressure monitors',
			'Glucometers & test strips',
			'Pulse oximeters',
			'Digital thermometers',
			'Weighing scales (adult & infant)',
		],
	},
	{
		name: 'Maternity & baby',
		items: [
			'Doppler foetal monitors',
			'Electric breast pumps',
			'Infant & neonatal weighing scales',
			'Baby phototherapy lamps',
			'Post-natal support cushions',
		],
	},
	{
		name: 'Rehab & physio',
		items: [
			'Parallel bars for gait training',
			'TENS machines',
			'Infrared heat lamps',
			'Arm & leg exercise bands',
			'Transfer belts & slide sheets',
		],
	},
];

export const leaseTerms = [
	{ label: 'Short-term', period: '1–4 weeks', desc: 'For post-surgical recovery or temporary care needs.' },
	{ label: 'Monthly', period: '1–11 months', desc: 'For ongoing care needs at home.' },
	{ label: 'Long-term', period: '12+ months', desc: 'For extended care needs, with locked-in rates.' },
];

export const leaseSteps = [
	{ title: 'Request a quote', body: 'Call or WhatsApp us with your equipment needs. We’ll advise on suitable options.' },
	{ title: 'Delivery & set-up', body: 'Equipment is delivered to your home and set up, with a briefing for the family.' },
	{ title: 'Maintenance', body: 'Routine servicing and technical support during your lease.' },
	{ title: 'Collection', body: 'When you no longer need it, we arrange collection at a convenient time.' },
];

export const rentToOwn = {
	items: ['Walking sticks', 'Walkers & rollators', 'Shower chairs', 'Commode chairs', 'Quad canes'],
	terms: [
		'3-month minimum commitment required',
		'Ownership transfers after full payment is complete',
		'Missed payments cancel the ownership option',
		'Equipment may not be resold before full payment',
		'A signed agreement is required before equipment is released',
	],
};
