import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const css = [
  ':root{color-scheme:dark;font-family:Inter,system-ui,sans-serif;background:#030712;color:#ecfeff;--line:rgba(142,234,255,.22);--mint:#76ffe4;--gold:#ffd166;--soft:rgba(236,254,255,.76)}',
  '*{box-sizing:border-box}',
  'body{margin:0;min-width:320px;min-height:100vh;overflow-x:hidden;background:radial-gradient(circle at 20% 10%,rgba(118,255,228,.2),transparent 30%),radial-gradient(circle at 75% 0%,rgba(255,122,217,.16),transparent 28%),linear-gradient(140deg,#020617,#08111f 45%,#030712)}',
  'a{color:inherit}button,input{font:inherit}',
  '.app-shell{width:min(1220px,calc(100% - 32px));margin:0 auto;padding:38px 0 64px}',
  '.hero-grid,.lab-grid,.analysis-grid{display:grid;gap:22px;margin-bottom:22px}',
  '.hero-grid{grid-template-columns:minmax(0,1.25fr) minmax(330px,.75fr)}',
  '.lab-grid{grid-template-columns:minmax(0,1fr) 380px}',
  '.analysis-grid{grid-template-columns:.85fr 1.15fr}',
  '.hero-copy,.receipt-panel,.visual-card,.control-stack,.histogram-card,.module-map,.status-rail{position:relative;overflow:hidden;border:1px solid var(--line);background:linear-gradient(140deg,rgba(10,25,54,.82),rgba(4,12,28,.68));border-radius:30px;box-shadow:0 24px 90px rgba(0,0,0,.34)}',
  '.hero-copy{min-height:410px;padding:42px}.receipt-panel,.control-stack,.histogram-card,.module-map,.status-rail{padding:26px}',
  '.brand-mark{display:inline-grid;width:74px;height:74px;margin-bottom:28px;place-items:center;border:1px solid rgba(255,209,102,.5);border-radius:24px;color:var(--gold);background:rgba(255,209,102,.08);font-weight:900}',
  '.eyebrow,.section-kicker{margin:0 0 10px;color:var(--mint);font-size:.75rem;font-weight:800;letter-spacing:.16em;text-transform:uppercase}',
  'h1,h2,h3,p{position:relative;margin-top:0}h1{max-width:760px;margin-bottom:18px;font-size:clamp(3rem,8vw,6.6rem);line-height:.88;letter-spacing:-.08em}h2{margin-bottom:12px;font-size:clamp(1.55rem,3vw,2.2rem)}h3{margin-bottom:14px;font-size:1.45rem}',
  '.lede,.receipt-claim,.control-stack p,.histogram-card p,.boundary-box,blockquote,.mini-ledger p{color:var(--soft);line-height:1.62}.lede{max-width:680px;font-size:clamp(1.02rem,2vw,1.24rem)}',
  '.hero-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.hero-actions a,.realm-pill,.status-chip{display:inline-flex;align-items:center;min-height:38px;padding:0 14px;border:1px solid rgba(142,234,255,.22);border-radius:999px;background:rgba(142,234,255,.08);color:inherit;text-decoration:none}',
  '.receipt-grid{display:grid;grid-template-columns:auto 1fr;gap:10px 16px;margin:22px 0;padding:18px;border-radius:22px;background:rgba(0,0,0,.16)}.receipt-grid strong{justify-self:end}.boundary-box{padding:16px;border-radius:18px;background:rgba(255,209,102,.08)}blockquote{margin:18px 0 0;padding-left:18px;border-left:3px solid var(--mint);font-weight:700}',
  '.visual-card{min-height:620px;padding:0;background:radial-gradient(circle at center,rgba(142,234,255,.12),rgba(3,7,18,.95) 68%)}.field-stage,.field-stage canvas{min-height:620px}.field-stage{position:relative}.field-stage canvas{display:block;width:100%;height:100%}',
  '.engine-pill,.field-caption{position:absolute;z-index:2;border:1px solid rgba(142,234,255,.18);background:rgba(3,7,18,.65);border-radius:999px;padding:10px;color:var(--mint)}.engine-pill{top:18px;left:18px}.field-caption{right:18px;bottom:18px;display:flex;gap:8px;flex-wrap:wrap}',
  '.channel-list{display:grid;gap:10px;margin:22px 0}.channel-button{display:flex;justify-content:space-between;gap:12px;width:100%;padding:14px;border:1px solid rgba(142,234,255,.16);border-radius:18px;background:rgba(255,255,255,.04);color:inherit;cursor:pointer;text-align:left}.channel-button.active{border-color:rgba(118,255,228,.42);background:rgba(118,255,228,.1)}',
  '.slider-label{display:grid;gap:12px;color:rgba(236,254,255,.7);font-size:.86rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.slider-label input{width:100%;accent-color:var(--mint)}.mini-ledger{margin-top:22px;padding:18px;border-radius:22px;background:rgba(0,0,0,.18)}',
  '.histogram-card svg{width:100%;min-height:170px;margin:6px 0 12px;overflow:visible}.axis{stroke:rgba(236,254,255,.24);stroke-width:1}.target-line{stroke:rgba(255,209,102,.68);stroke-dasharray:4 6}.target-label{fill:var(--gold);font-size:12px;font-weight:800}.data-bar{fill:rgba(142,234,255,.44)}.bump-bar{fill:rgba(255,209,102,.86)}',
  '.module-map{display:grid;gap:24px}.pill-row,.status-grid{display:flex;flex-wrap:wrap;gap:10px}.module-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:12px}.module-card{min-height:112px;padding:16px;border-radius:20px;background:rgba(255,255,255,.04)}.module-card span{display:block;margin-bottom:16px;color:#ff7ad9;font-size:.78rem;font-weight:900}.status-chip.active{border-color:rgba(255,209,102,.5);background:rgba(255,209,102,.13);color:#fff7dc}',
  '@media (max-width:980px){.hero-grid,.lab-grid,.analysis-grid{grid-template-columns:1fr}}',
  '@media (max-width:620px){.app-shell{width:min(100% - 20px,1220px);padding-top:14px}.hero-copy,.receipt-panel,.control-stack,.histogram-card,.module-map,.status-rail{padding:20px;border-radius:22px}.visual-card,.field-stage,.field-stage canvas{min-height:480px}h1{font-size:3rem}}'
].join('\n');

writeFileSync(resolve(root, 'src', ['styles', 'css'].join('.')), css);
console.log('Wrote ParticleForge369 theme.');
