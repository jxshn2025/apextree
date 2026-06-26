#!/usr/bin/env node
/**
 * ApexTree License Key Generator
 *
 * Usage:
 *   node generate-license.js
 *   node generate-license.js --expiry 2028-12-31 --plan pro --domains example.com,example.org
 *   node generate-license.js --help
 */

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
ApexTree License Key Generator

Options:
  --expiry, -e    Expiry date (YYYY-MM-DD)        [default: 2099-12-31]
  --issue, -i     Issue date  (YYYY-MM-DD)        [default: today]
  --plan, -p      Plan name                       [default: standard]
  --domains, -d   Comma-separated domain list     [default: example.com]
  --help, -h      Show this help

Examples:
  node generate-license.js
  node generate-license.js -e 2030-01-01 -p pro -d example.com,example.org
  node generate-license.js --expiry 2026-06-01   # expired key for testing
`);
  process.exit(0);
}

function parseArgs(args) {
  const opts = {
    expiry: '2099-12-31',
    issue: new Date().toISOString().slice(0, 10),
    plan: 'standard',
    domains: ['example.com'],
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--help':
      case '-h':
        printHelp();
        break;
      case '--expiry':
      case '-e':
        opts.expiry = args[++i];
        break;
      case '--issue':
      case '-i':
        opts.issue = args[++i];
        break;
      case '--plan':
      case '-p':
        opts.plan = args[++i];
        break;
      case '--domains':
      case '-d':
        opts.domains = args[++i].split(',').map(s => s.trim()).filter(Boolean);
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        process.exit(1);
    }
  }
  return opts;
}

function generateLicenseKey(issueDate, expiryDate, plan, domains) {
  const data = { expiryDate, issueDate, plan };
  if (domains && domains.length > 0) {
    data.domains = domains;
  }
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
  return `APEX-${encoded}`;
}

function decodeLicenseKey(key) {
  if (!key.startsWith('APEX-')) return null;
  const encoded = key.slice(5);
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// --- Main ---
const opts = parseArgs(args);
const key = generateLicenseKey(opts.issue, opts.expiry, opts.plan, opts.domains);

console.log('\n=== ApexTree License Key ===\n');
console.log(key);
console.log('\n--- Details ---');
console.log(`  Issue Date : ${opts.issue}`);
console.log(`  Expiry Date: ${opts.expiry}`);
console.log(`  Plan       : ${opts.plan}`);
console.log(`  Domains    : ${opts.domains.join(', ')}`);

// Verify roundtrip
const decoded = decodeLicenseKey(key);
console.log('\n--- Verification ---');
console.log(`  Decoded OK : ${JSON.stringify(decoded)}`);
console.log('');
