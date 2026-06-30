import { useMemo, useState } from 'react';
import HiggsFieldCanvas from './particles/HiggsFieldCanvas.jsx';
import { channels, claimStatuses, receipt } from './data/receipt.js';

function makeHistogram(channelId) {
  const bins = [];
  const channelBoost = channelId === 'four-lepton' ? 0.78 : channelId === 'field-map' ? 0.44 : 1;

  for (let i = 0; i < 39; i += 1) {
    const energy = 100 + i * 1.5;
    const background = 24 + Math.sin(i * 0.91) * 5 + Math.cos(i * 0.27) * 3;
    const higgsLikeBump = 42 * channelBoost * Math.exp(-Math.pow((energy - 125) / 3.2, 2));
    bins.push({ energy, value: Math.max(3, background + higgsLikeBump) });
  }

  return bins;
}

function Histogram({ channelId }) {
  const bins = useMemo(() => makeHistogram(channelId), [channelId]);
  const max = Math.max(...bins.map((bin) => bin.value));
  const width = 420;
  const height = 170;
  const barWidth = width / bins.length;

  return (
    <div className="histogram-card">
      <div className="section-kicker">Analysis Lab</div>
      <h3>Invariant mass sketch</h3>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Invariant mass histogram with Higgs-like bump">
        <line x1="0" y1="146" x2={width} y2="146" className="axis" />
        <line x1="258" y1="12" x2="258" y2="146" className="target-line" />
        <text x="264" y="24" className="target-label">125 GeV</text>
        {bins.map((bin, index) => {
          const barHeight = (bin.value / max) * 124;
          return (
            <rect
              key={bin.energy}
              x={index * barWidth + 1}
              y={146 - barHeight}
              width={Math.max(2, barWidth - 2)}
              height={barHeight}
              rx="3"
              className={bin.energy > 121 && bin.energy < 129 ? 'bump-bar' : 'data-bar'}
            />
          );
        })}
      </svg>
      <p>
        This chart is intentionally educational: it shows how a small signal can become visible only after many noisy events are stacked.
      </p>
    </div>
  );
}

function ReceiptPanel({ telemetry }) {
  return (
    <aside className="receipt-panel">
      <div className="section-kicker">Ledger Receipt</div>
      <h2>{receipt.title}</h2>
      <p className="receipt-claim">{receipt.claim}</p>
      <div className="receipt-grid">
        <span>Run ID</span>
        <strong>{receipt.runId}</strong>
        <span>Status</span>
        <strong>{receipt.status}</strong>
        <span>Mode</span>
        <strong>{receipt.mode}</strong>
        <span>Engine</span>
        <strong>{telemetry.engine || 'pending'}</strong>
        <span>Particles</span>
        <strong>{telemetry.particles || 1728}</strong>
        <span>Phi</span>
        <strong>{telemetry.phi || '1.618034'}</strong>
      </div>
      <div className="boundary-box">
        <strong>Boundary:</strong> {receipt.boundary}
      </div>
      <blockquote>{receipt.validator.rule}</blockquote>
    </aside>
  );
}

function ModuleMap() {
  return (
    <section className="module-map" aria-label="Three realms and six modules">
      <div>
        <div className="section-kicker">3 Realms</div>
        <div className="pill-row">
          {receipt.realms.map((realm) => (
            <span className="realm-pill" key={realm}>{realm}</span>
          ))}
        </div>
      </div>
      <div>
        <div className="section-kicker">6 Modules</div>
        <div className="module-grid">
          {receipt.modules.map((module, index) => (
            <article className="module-card" key={module}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{module}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusRail() {
  return (
    <section className="status-rail">
      <div className="section-kicker">9 Claim Statuses</div>
      <div className="status-grid">
        {claimStatuses.map((status) => (
          <span className={status === receipt.status ? 'status-chip active' : 'status-chip'} key={status}>
            {status.replaceAll('_', ' ')}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [channel, setChannel] = useState(channels[0].id);
  const [intensity, setIntensity] = useState(0.74);
  const [telemetry, setTelemetry] = useState({});
  const activeChannel = channels.find((item) => item.id === channel) ?? channels[0];

  return (
    <main className="app-shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="brand-mark">PF369</div>
          <p className="eyebrow">ParticleForge369 v0.1</p>
          <h1>Particles become patterns. Patterns get receipts.</h1>
          <p className="lede">
            A public, MIT-licensed particle simulation lab for learning high-energy physics ideas through visuals, toy events, and claim-safe Ledger boundaries.
          </p>
          <div className="hero-actions">
            <a href="https://github.com/MichaelWave369/particleforge369" target="_blank" rel="noreferrer">Open repo</a>
            <a href="./docs/claim-boundaries.md">Read boundaries</a>
          </div>
        </div>
        <ReceiptPanel telemetry={telemetry} />
      </section>

      <section className="lab-grid">
        <div className="visual-card">
          <HiggsFieldCanvas channel={channel} intensity={intensity} onTelemetry={setTelemetry} />
        </div>
        <div className="control-stack">
          <div className="section-kicker">Witness Controls</div>
          <h2>{activeChannel.label}</h2>
          <p>{activeChannel.bro}</p>
          <div className="channel-list" role="tablist" aria-label="Simulation channels">
            {channels.map((item) => (
              <button
                type="button"
                className={item.id === channel ? 'channel-button active' : 'channel-button'}
                onClick={() => setChannel(item.id)}
                key={item.id}
              >
                <span>{item.label}</span>
                <small>{item.energy}</small>
              </button>
            ))}
          </div>
          <label className="slider-label">
            Collision pulse intensity
            <input
              type="range"
              min="0.2"
              max="1.4"
              step="0.01"
              value={intensity}
              onChange={(event) => setIntensity(Number(event.target.value))}
            />
          </label>
          <div className="mini-ledger">
            <span>Validator</span>
            <strong>{receipt.validator.result}</strong>
            <p>No mystical claims. No fake discovery language. Model first, receipt second, reality always above ego.</p>
          </div>
        </div>
      </section>

      <section className="analysis-grid">
        <Histogram channelId={channel} />
        <ModuleMap />
      </section>

      <StatusRail />
    </main>
  );
}
