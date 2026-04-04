/// <reference types="node" />
/**
 * Daima — AI CFO for Remote Workers
 * OWS Hackathon 2026 Demo Script
 *
 * Run: npx ts-node --transpile-only scripts/demo.ts
 */

// ─── ANSI color helpers ──────────────────────────────────────────────────────

const C = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  blue:    '\x1b[34m',
  magenta: '\x1b[35m',
  cyan:    '\x1b[36m',
  white:   '\x1b[37m',
  bgBlue:  '\x1b[44m',
  bgGreen: '\x1b[42m',
  red:     '\x1b[31m',
};

const g = (s: string) => `${C.green}${s}${C.reset}`;
const y = (s: string) => `${C.yellow}${s}${C.reset}`;
const b = (s: string) => `${C.blue}${s}${C.reset}`;
const m = (s: string) => `${C.magenta}${s}${C.reset}`;
const c = (s: string) => `${C.cyan}${s}${C.reset}`;
const bold = (s: string) => `${C.bold}${s}${C.reset}`;
const dim  = (s: string) => `${C.dim}${s}${C.reset}`;
const red  = (s: string) => `${C.red}${s}${C.reset}`;

// ─── Utilities ───────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

function print(line = '') {
  process.stdout.write(line + '\n');
}

function printLine(char = '─', width = 72) {
  print(dim(char.repeat(width)));
}

function printSection(label: string) {
  print('');
  print(dim('═'.repeat(72)));
  print(`${C.bold}${C.cyan}  ${label}${C.reset}`);
  print(dim('═'.repeat(72)));
  print('');
}

function printBadge(text: string, color: string) {
  process.stdout.write(`${color}${C.bold} ${text} ${C.reset}  `);
}

async function spinner(message: string, durationMs: number, label = '') {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const interval = 80;
  const steps = Math.floor(durationMs / interval);
  for (let i = 0; i < steps; i++) {
    const frame = frames[i % frames.length];
    process.stdout.write(`\r  ${C.cyan}${frame}${C.reset}  ${message}`);
    await sleep(interval);
  }
  process.stdout.write(`\r  ${C.green}✓${C.reset}  ${message}${label ? `  ${dim(label)}` : ''}\n`);
}

async function progressBar(label: string, durationMs: number, width = 40) {
  const steps = width;
  const interval = durationMs / steps;
  for (let i = 0; i <= steps; i++) {
    const filled = '█'.repeat(i);
    const empty  = '░'.repeat(steps - i);
    const pct    = Math.floor((i / steps) * 100).toString().padStart(3, ' ');
    process.stdout.write(`\r  ${C.cyan}${label}${C.reset}  [${C.green}${filled}${C.dim}${empty}${C.reset}] ${C.bold}${pct}%${C.reset}`);
    await sleep(interval);
  }
  process.stdout.write('\n');
}

function fakeTxHash(): string {
  const chars = '0123456789abcdef';
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ─── Demo data ───────────────────────────────────────────────────────────────

const WORKER = {
  name:        'Daniela Reyes',
  role:        'UX Designer',
  experience:  4,
  location:    'Mexico City',
  hourlyRate:  28,
  marketLow:   42,
  marketHigh:  65,
  distribution: { expenses: 0.50, savings: 0.40, investment: 0.10 },
  savingsGoal: 200,
  wallet:      '7xKp...mN4Q',
};

const PAYMENT = {
  client:    'Acme Corp',
  amount:    500,
  currency:  'USD',
  fee:       0.007,   // $0.007 actual fee vs ~$19 PayPal
  paypalFee: 19.25,
  txHash:    fakeTxHash(),
  network:   'Solana',
  token:     'USDC',
  confirmMs: 28000,
};

const OFFER = {
  client:  'Startup XYZ',
  project: 'UX Redesign — Mobile App',
  amount:  300,
  counter: 500,
};

// ─── Header ──────────────────────────────────────────────────────────────────

async function printHeader() {
  print('');
  print(`${C.magenta}${C.bold}`);
  print('  ██████╗  █████╗ ██╗███╗   ███╗ █████╗ ');
  print('  ██╔══██╗██╔══██╗██║████╗ ████║██╔══██╗');
  print('  ██║  ██║███████║██║██╔████╔██║███████║');
  print('  ██║  ██║██╔══██║██║██║╚██╔╝██║██╔══██║');
  print('  ██████╔╝██║  ██║██║██║ ╚═╝ ██║██║  ██║');
  print('  ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚═╝  ╚═╝');
  print(`${C.reset}`);
  print(`  ${bold('AI CFO for Remote Workers')}  ${dim('|')}  ${c('OWS Hackathon 2026')}`);
  print(`  ${dim('Built by byTHELAB* · Mexico City')}`);
  print('');
  printLine('─');
  print('');
  print(`  ${bold('Worker Profile')}`);
  print('');
  print(`  ${dim('Name')}          ${bold(WORKER.name)}`);
  print(`  ${dim('Role')}          ${WORKER.role}  ${dim(`(${WORKER.experience} yrs exp)`)}`);
  print(`  ${dim('Location')}      ${WORKER.location}`);
  print(`  ${dim('Current Rate')}  ${red('$' + WORKER.hourlyRate + '/hr')}  ${dim('← below market')}`);
  print(`  ${dim('Market Rate')}   ${g('$' + WORKER.marketLow + '–$' + WORKER.marketHigh + '/hr')}`);
  print(`  ${dim('Distribution')}  ${g('50%')} expenses · ${c('40%')} savings · ${m('10%')} investment`);
  print(`  ${dim('Wallet')}        ${WORKER.wallet}  ${dim('(Solana)')}`);
  print('');
  printLine();
  print('');
  print(`  ${bold('3 Magic Moments')} the judges will see:`);
  print('');
  print(`  ${g('①')}  Company pays Daniela in USDC via Solana`);
  print(`  ${c('②')}  Daima Agent auto-distributes her money per her rules`);
  print(`  ${m('③')}  Agent detects a low-ball offer and fights back`);
  print('');
}

// ─── Moment 1 ────────────────────────────────────────────────────────────────

async function moment1() {
  printSection('MOMENT 1  ·  Company Pays Daniela');

  print(`  ${bold('Acme Corp')} initiates payment:`);
  print('');
  print(`  ${bold(y('$500 USD'))}  →  ${bold(WORKER.name)}`);
  print(`  ${dim('Role:')} ${WORKER.role}, ${WORKER.location}`);
  print('');
  await sleep(800);

  print(`  ${dim('Step 1 — Fiat → USDC conversion')}`);
  await spinner('MoonPay processing $500 USD...', 1800);
  await sleep(300);
  print(`  ${dim('      Conversion rate:')} ${g('1 USD = 1.0000 USDC')}  ${dim('(stablecoin)')}`);
  print(`  ${dim('      Network fee:')}  ${g('$0.007')}  ${dim('(vs $19.25 on PayPal — 99.96% cheaper)')}`);
  print('');

  await sleep(500);
  print(`  ${dim('Step 2 — Broadcasting to Solana')}`);
  await spinner('Signing & broadcasting transaction...', 1200);
  await sleep(200);
  print(`  ${dim('      Tx hash:')}  ${dim(PAYMENT.txHash.slice(0, 32) + '...')}`);
  print('');

  await sleep(400);
  print(`  ${dim('Step 3 — Confirmation')}`);
  await progressBar('Awaiting finality', 2600);
  print('');

  print(`  ${g('✅')} ${bold('Payment confirmed!')}  ${dim('<28 seconds · 1 block')}`);
  print('');
  printLine('─');
  print('');
  print(`  ${bold('Receipt')}`);
  print('');
  print(`  ${dim('From')}     ${PAYMENT.client}`);
  print(`  ${dim('Amount')}   ${bold(g('$500.00 USDC'))}`);
  print(`  ${dim('Network')}  ${PAYMENT.network}`);
  print(`  ${dim('Fee')}      ${g('$0.007')}   ${dim('PayPal would charge $19.25')}`);
  print(`  ${dim('Time')}     ${g('< 30 seconds')}  ${dim('Wire would take 3-5 business days')}`);
  print(`  ${dim('Tx')}       ${dim(PAYMENT.txHash.slice(0, 20) + '...' + PAYMENT.txHash.slice(-8))}`);
  print('');
}

// ─── Moment 2 ────────────────────────────────────────────────────────────────

async function moment2() {
  printSection('MOMENT 2  ·  Daima Agent Distributes');

  print(`  ${dim('Event detected:')} ${bold('Inbound USDC transfer · $500.00')}`);
  print('');
  await sleep(600);

  await spinner('Daima Agent waking up...', 900);
  await spinner('Loading Daniela\'s financial rules...', 700);
  await spinner('Running distribution logic...', 1100);
  print('');

  // BTC conversion math
  const btcPriceUSD  = 84200;
  const savingsUSD   = PAYMENT.amount * WORKER.distribution.savings;    // $200
  const investUSD    = PAYMENT.amount * WORKER.distribution.investment;  // $50
  const expensesUSD  = PAYMENT.amount * WORKER.distribution.expenses;   // $250
  const savingsSats  = Math.round((savingsUSD / btcPriceUSD) * 1e8);
  const investSats   = Math.round((investUSD / btcPriceUSD) * 1e8);

  print(`  ${bold('Notification sent to Daniela:')}`);
  print('');

  const notifLines = [
    `  ┌─────────────────────────────────────────────────────┐`,
    `  │                                                     │`,
    `  │  ${bold('Daima')} · Just now                                  │`,
    `  │                                                     │`,
    `  │  You received ${bold(g('$500'))} from ${bold('Acme Corp')}.             │`,
    `  │  Based on your plan:                                │`,
    `  │                                                     │`,
    `  │  ${g('✅')} Monthly expenses:  ${bold('$250 USDC')} → available now   │`,
    `  │  ${g('✅')} Savings:           ${bold('$200')} → BTC via Lightning     │`,
    `  │     ${dim(`(${savingsSats.toLocaleString()} sats @ $${btcPriceUSD.toLocaleString()}/BTC)`)}                    │`,
    `  │  ${g('✅')} Investment:        ${bold('$50')} → BTC allocation         │`,
    `  │     ${dim(`(${investSats.toLocaleString()} sats)`)}                          │`,
    `  │                                                     │`,
    `  │  Your savings goal: ${bold(g('$200/$200'))} ${g('✅')} ${bold('Complete!')}       │`,
    `  │                                                     │`,
    `  └─────────────────────────────────────────────────────┘`,
  ];

  for (const line of notifLines) {
    print(line);
    await sleep(60);
  }
  print('');
  await sleep(500);

  print(`  ${bold('Distribution breakdown:')}`);
  print('');

  const rows: [string, number, string][] = [
    ['Monthly expenses', expensesUSD, g('Available in USDC wallet')],
    ['Savings → BTC',   savingsUSD,  c(`${savingsSats.toLocaleString()} sats via Lightning`)],
    ['Investment → BTC', investUSD,  m(`${investSats.toLocaleString()} sats · long-term hold`)],
  ];

  for (const [label, amount, detail] of rows) {
    const bar = '█'.repeat(Math.round(amount / 12.5));
    print(`  ${g('●')} ${label.padEnd(20)} ${bold('$' + amount.toString().padStart(3))}  ${dim(bar)}  ${detail}`);
    await sleep(350);
  }

  print('');
  printLine('─');
  print('');
  print(`  ${g('✅')} ${bold('All done in < 3 seconds.')} No bank. No wire. No waiting.`);
  print('');
}

// ─── Moment 3 ────────────────────────────────────────────────────────────────

async function moment3() {
  printSection('MOMENT 3  ·  Agent Defends Daniela\'s Value');

  print(`  ${dim('New project offer incoming...')}`);
  print('');
  await sleep(700);

  const offerLines = [
    `  ┌─────────────────────────────────────────────────────┐`,
    `  │                                                     │`,
    `  │  ${bold('New Offer')} · Startup XYZ                            │`,
    `  │                                                     │`,
    `  │  Project:  ${bold(OFFER.project)}          │`,
    `  │  Offer:    ${bold(red('$300 USD'))}                               │`,
    `  │                                                     │`,
    `  └─────────────────────────────────────────────────────┘`,
  ];

  for (const line of offerLines) {
    print(line);
    await sleep(60);
  }
  print('');

  await sleep(600);
  await spinner('Daima Agent analyzing market rates...', 1400);
  await sleep(300);

  print('');
  print(`  ${bold('Market Intelligence Report')}`);
  print('');
  print(`  ${dim('Role')}         ${WORKER.role}  ${dim(`(${WORKER.experience} yrs exp)`)}`);
  print(`  ${dim('Market rate')}  ${g('$450 – $650')} per project`);
  print(`  ${dim('This offer')}   ${red('$300')}  ${dim('→')}  ${bold(red('33% BELOW market'))}`);
  print('');
  printLine('─');
  print('');

  print(`  ${bold(y('⚠  Alert:'))} ${bold('This offer undervalues your work.')}`);
  print('');
  print(`  ${dim('Daima recommends:')}`);
  print('');

  await sleep(500);

  const options = [
    { key: 'A', label: `Counter-offer ${bold(g('$500'))}`, sub: 'auto-draft ready to send', highlight: true },
    { key: 'B', label: 'Request more project details', sub: 'before committing to price', highlight: false },
    { key: 'C', label: 'Decline with polite note', sub: 'preserve relationship', highlight: false },
  ];

  for (const opt of options) {
    const prefix = opt.highlight ? `${C.bgGreen}${C.bold}` : `${C.dim}`;
    const reset  = C.reset;
    print(`  ${prefix} ${opt.key} ${reset}  ${opt.label}  ${dim('·')}  ${dim(opt.sub)}`);
    await sleep(250);
  }

  print('');
  await sleep(800);
  print(`  ${dim('Daniela selects:')}  ${g('A')}  — Counter-offer $500`);
  print('');

  await sleep(400);
  await spinner('Drafting counter-offer message...', 1000);
  await spinner('Sending via Daima Agent...', 800);
  print('');

  const counterLines = [
    `  ┌─────────────────────────────────────────────────────┐`,
    `  │                                                     │`,
    `  │  ${bold('Message sent to Startup XYZ')}                        │`,
    `  │                                                     │`,
    `  │  Hi! Thank you for reaching out about the UX        │`,
    `  │  redesign project — sounds like an exciting one.    │`,
    `  │                                                     │`,
    `  │  Based on the scope described and my experience     │`,
    `  │  in product UX, my rate for this project would      │`,
    `  │  be ${bold(g('$500 USD'))}.                                    │`,
    `  │                                                     │`,
    `  │  Happy to jump on a quick call to align on          │`,
    `  │  deliverables and timeline. Let me know!            │`,
    `  │                                                     │`,
    `  │  Best,                                              │`,
    `  │  ${bold('Daniela Reyes')}                                      │`,
    `  │                                                     │`,
    `  └─────────────────────────────────────────────────────┘`,
  ];

  for (const line of counterLines) {
    print(line);
    await sleep(55);
  }

  print('');
  print(`  ${g('✅')} ${bold('Counter-offer sent.')}  ${dim('Potential extra earnings: ')}${g('+$200 on this project alone.')}`);
  print('');
}

// ─── Real AIEngine Call ───────────────────────────────────────────────────────

async function runRealEngine() {
  printSection('REAL ENGINE  ·  AIEngine Running Live');

  print(`  ${dim('Instantiating AIEngine and calling generatePaymentNotification...')}`);
  print('');

  // Inline the types so we don't need a complex import path from scripts/
  const { AIEngine } = await import('../packages/worker-agent/src/ai-engine');

  const engine = new AIEngine();

  const payment = {
    id: 'demo-1',
    fromCompany: 'Acme Corp',
    toWorker: 'daniela',
    amountUSD: 500,
    status: 'distributed' as const,
    distributions: [],
    timestamp: new Date(),
  };

  const distributions = [
    { category: 'expenses'   as const, amount: 250, destination: 'usdc'         as const },
    { category: 'savings'    as const, amount: 200, destination: 'btc_lightning' as const },
    { category: 'investment' as const, amount:  50, destination: 'btc_onchain'  as const },
  ];

  await spinner('AIEngine.generatePaymentNotification()...', 1200);

  const result = await engine.generatePaymentNotification(payment, distributions);

  print('');
  print(`  ${bold('Output from real AIEngine:')}`);
  print('');
  print(`  ${g('→')} ${result.message.substring(0, 120)}${result.message.length > 120 ? '...' : ''}`);
  print('');
  print(`  ${dim('type:')} ${result.type}  ${dim('timestamp:')} ${result.timestamp.toISOString()}`);
  print('');
}

// ─── Summary ─────────────────────────────────────────────────────────────────

async function printSummary() {
  printSection('SUMMARY  ·  What Daima Did Today');

  await sleep(400);

  const rows = [
    { icon: g('💸'), label: 'Fees saved vs PayPal',         value: g('$19.24'),    note: 'per payment' },
    { icon: g('⚡'), label: 'Settlement time',              value: g('< 30 sec'),   note: 'vs 3-5 biz days' },
    { icon: c('🤖'), label: 'Auto-distribution actions',    value: c('3'),          note: 'zero manual steps' },
    { icon: m('📈'), label: 'Savings goal hit',             value: m('$200/mo'),    note: '100% complete' },
    { icon: y('🛡'), label: 'Low-ball offers defended',     value: y('1'),          note: '+$200 potential gain' },
    { icon: g('💰'), label: 'Extra earnings per project',   value: bold(g('+$200')), note: 'if counter accepted' },
  ];

  for (const row of rows) {
    print(`  ${row.icon}  ${row.label.padEnd(32)} ${bold(row.value.padEnd(14))} ${dim(row.note)}`);
    await sleep(200);
  }

  print('');
  printLine();
  print('');
  print(`  ${bold('The bottom line:')}`);
  print('');
  print(`  Daima saved Daniela ${bold(g('$19.24 in fees'))} vs PayPal on a single payment.`);
  print(`  It auto-managed her money in ${bold(c('< 3 seconds'))}, no bank required.`);
  print(`  And it helped her earn ${bold(g('+$200 more'))} by defending her market rate.`);
  print('');
  print(`  ${bold('For 10M remote workers in Latin America,')} this compounds fast.`);
  print('');
  printLine('═');
  print('');
  print(`  ${bold(m('DAIMA'))}  ${dim('—')}  ${bold('AI CFO. For workers who deserve better.')}`);
  print('');
  print(`  ${dim('byTHELAB* · Mexico City · OWS Hackathon 2026')}`);
  print('');
  printLine('═');
  print('');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  await printHeader();
  await sleep(1200);

  await moment1();
  await sleep(1000);

  await moment2();
  await sleep(1000);

  await moment3();
  await sleep(1000);

  await runRealEngine();
  await sleep(1000);

  await printSummary();
}

main().catch(err => {
  console.error(red('Demo error:'), err);
  process.exit(1);
});
