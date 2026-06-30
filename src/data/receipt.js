export const receipt = {
  runId: 'PF369-HIGGS-PLAYGROUND-0001',
  title: 'Higgs-like receipt playground',
  mode: 'educational simulation',
  claim: 'A Higgs-like signal can appear as a candidate bump near 125 GeV after background noise is modeled.',
  boundary: 'Educational reproduction only. Not a new discovery and not evidence without real-world experimental data.',
  status: 'EDUCATIONAL_REPRODUCTION',
  realms: ['Simulate', 'Witness', 'Validate'],
  modules: [
    'Theory Cards',
    'Event Generator',
    'Detector Sketch',
    'Analysis Lab',
    'Receipt Ledger',
    'Visual Field'
  ],
  validator: {
    rule: 'Simulation creates possibility. Real data creates evidence. Repeated validated evidence creates discovery.',
    result: 'PASS_WITH_BOUNDARY'
  }
};

export const claimStatuses = [
  'OBSERVED_IN_SIMULATION',
  'MATCHES_KNOWN_RESULT',
  'MATCHES_PUBLIC_DATA',
  'EDUCATIONAL_REPRODUCTION',
  'TOY_MODEL_ONLY',
  'INTERESTING_RESIDUAL',
  'NEEDS_REVIEW',
  'REJECTED',
  'QUARANTINED'
];

export const channels = [
  {
    id: 'diphoton',
    label: 'Diphoton channel',
    bro: 'Two clean light flashes. Tiny signal, beautiful bump.',
    energy: '125 GeV focus',
    confidence: 0.82
  },
  {
    id: 'four-lepton',
    label: 'Four-lepton channel',
    bro: 'Rare, clean, and receipt-friendly.',
    energy: 'golden channel',
    confidence: 0.76
  },
  {
    id: 'field-map',
    label: 'Field map mode',
    bro: 'Watch the invisible field as a visible pattern.',
    energy: 'visual intuition',
    confidence: 0.69
  }
];
