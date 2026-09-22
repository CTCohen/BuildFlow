#!/usr/bin/env node

/**
 * Constrained Variety Test
 *
 * Generates 30 diverse test clients across 5+ verticals to verify
 * the mega-scale architecture produces unique, quality sites.
 *
 * Usage: node scripts/constrained-variety-test.mjs
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const VERTICALS = [
  'hvac',
  'plumbing',
  'electrical',
  'landscaping',
  'roofing',
];

const TEST_ROUNDS = 6; // 6 rounds × 5 verticals = 30 test sites

const TEST_DATA = {
  hvac: {
    name: 'HVAC',
    trades: ['hvac', 'hvac'],
    heroStyles: [null, 'full-bleed', 'minimal'],
    densities: ['comfortable', 'spacious', 'compact'],
  },
  plumbing: {
    name: 'Plumbing',
    trades: ['plumbing', 'plumbing'],
    heroStyles: [null, 'photo-left', 'accent-bar'],
    densities: ['comfortable', 'spacious'],
  },
  electrical: {
    name: 'Electrical',
    trades: ['electrical', 'electrical'],
    heroStyles: [null, 'full-bleed'],
    densities: ['comfortable', 'compact'],
  },
  landscaping: {
    name: 'Landscaping',
    trades: ['landscaping', 'landscaping'],
    heroStyles: [null, 'split'],
    densities: ['spacious', 'comfortable'],
  },
  roofing: {
    name: 'Roofing',
    trades: ['roofing', 'roofing'],
    heroStyles: ['minimal', 'photo-left'],
    densities: ['spacious', 'comfortable'],
  },
};

const RESULTS = {
  passed: 0,
  failed: 0,
  buildTimes: [],
  verticalCoverage: {},
  variants: new Set(),
};

/**
 * Generate a test client with diverse characteristics
 */
function generateTestClient(vertical, round) {
  const config = TEST_DATA[vertical];
  const idx = round % config.trades.length;
  const heroIdx = round % config.heroStyles.length;
  const densityIdx = round % config.densities.length;

  const trade = config.trades[idx];
  const heroStyle = config.heroStyles[heroIdx];
  const density = config.densities[densityIdx];

  const slug = `test-${vertical}-r${round}`;

  return {
    slug,
    vertical,
    trade,
    heroStyle,
    density,
    client: {
      slug,
      business: {
        name: `Test ${config.name} ${round}`,
        trade,
        phone: '+1-555-0100',
        email: `test@${vertical}.local`,
        cityState: 'Test City, TX',
        serviceAreas: ['Test Area 1', 'Test Area 2'],
        hours: 'Mon-Fri 9am-5pm',
        yearsInBusiness: 5 + round,
        teamSize: 1 + round,
      },
      brand: {
        primary: '#0369a1',
        accent: '#f59e0b',
        heroStyle: heroStyle || 'photo-left',
        typePairing: 'humanist',
        density: density,
      },
      content: {
        en: {
          tagline: `Test ${config.name} Service`,
          heroHeadline: `Test Headline ${round}`,
          heroSub: `Test subtitle for ${vertical} round ${round}`,
          primaryCta: 'Contact Us',
          about: `Test about for ${vertical}`,
          services: [
            { name: 'Service 1', blurb: 'Test service 1' },
            { name: 'Service 2', blurb: 'Test service 2' },
            { name: 'Service 3', blurb: 'Test service 3' },
          ],
          reviews: [
            { quote: 'Test review 1', author: 'Customer 1' },
            { quote: 'Test review 2', author: 'Customer 2' },
          ],
        },
        es: {
          tagline: `Prueba ${config.name}`,
          heroHeadline: `Prueba Titular ${round}`,
          heroSub: `Prueba subtítulo para ${vertical}`,
          primaryCta: 'Contáctenos',
          about: `Prueba acerca de ${vertical}`,
          services: [
            { name: 'Servicio 1', blurb: 'Prueba servicio 1' },
            { name: 'Servicio 2', blurb: 'Prueba servicio 2' },
            { name: 'Servicio 3', blurb: 'Prueba servicio 3' },
          ],
          reviews: [
            { quote: 'Prueba reseña 1', author: 'Cliente 1' },
            { quote: 'Prueba reseña 2', author: 'Cliente 2' },
          ],
        },
      },
      media: { heroImage: null, logo: null },
      vertical: vertical,
      conditionalFeatures: {},
    },
  };
}

/**
 * Run build test for a client
 */
function testClient(testConfig) {
  const startTime = Date.now();
  const clientFile = `src/data/clients/${testConfig.slug}.json`;

  try {
    // Write test client
    fs.writeFileSync(clientFile, JSON.stringify(testConfig.client, null, 2));

    // Build
    const buildCmd = `CLIENT=${testConfig.slug} npm run build 2>&1`;
    const output = execSync(buildCmd, { stdio: 'pipe', timeout: 30000 }).toString();

    const buildTime = Date.now() - startTime;

    // Check for success
    if (output.includes('[build] Complete!') || output.includes('pages built')) {
      RESULTS.passed++;
      RESULTS.buildTimes.push(buildTime);
      RESULTS.variants.add(`${testConfig.vertical}:${testConfig.heroStyle}:${testConfig.density}`);

      if (!RESULTS.verticalCoverage[testConfig.vertical]) {
        RESULTS.verticalCoverage[testConfig.vertical] = 0;
      }
      RESULTS.verticalCoverage[testConfig.vertical]++;

      console.log(`✓ ${testConfig.slug} (${buildTime}ms)`);
      return true;
    } else {
      RESULTS.failed++;
      console.log(`✗ ${testConfig.slug} (failed)`);
      return false;
    }
  } catch (err) {
    RESULTS.failed++;
    console.log(`✗ ${testConfig.slug} (error: ${err.message.split('\n')[0]})`);
    return false;
  } finally {
    // Cleanup
    try {
      fs.unlinkSync(clientFile);
    } catch {}
  }
}

/**
 * Run the test suite
 */
async function runTests() {
  console.log('🚀 Constrained Variety Test: Mega-Scale Fornax');
  console.log(`Generating ${VERTICALS.length * TEST_ROUNDS} test sites...`);
  console.log('');

  const startTime = Date.now();

  for (let round = 0; round < TEST_ROUNDS; round++) {
    console.log(`Round ${round + 1}/${TEST_ROUNDS}:`);
    for (const vertical of VERTICALS) {
      const testConfig = generateTestClient(vertical, round);
      testClient(testConfig);
    }
    console.log('');
  }

  const totalTime = Date.now() - startTime;

  // Report results
  console.log('─'.repeat(60));
  console.log('📊 TEST RESULTS');
  console.log('─'.repeat(60));
  console.log(`Total Sites: ${RESULTS.passed + RESULTS.failed}`);
  console.log(`✓ Passed: ${RESULTS.passed}`);
  console.log(`✗ Failed: ${RESULTS.failed}`);
  console.log(`Pass Rate: ${((RESULTS.passed / (RESULTS.passed + RESULTS.failed)) * 100).toFixed(1)}%`);
  console.log('');
  console.log('Build Performance:');
  console.log(`  Min: ${Math.min(...RESULTS.buildTimes)}ms`);
  console.log(`  Max: ${Math.max(...RESULTS.buildTimes)}ms`);
  console.log(`  Avg: ${(RESULTS.buildTimes.reduce((a,b)=>a+b,0)/RESULTS.buildTimes.length).toFixed(0)}ms`);
  console.log(`  Total: ${totalTime}ms (${(totalTime/1000).toFixed(1)}s)`);
  console.log('');
  console.log('Vertical Coverage:');
  for (const [vertical, count] of Object.entries(RESULTS.verticalCoverage)) {
    console.log(`  ${vertical}: ${count} sites`);
  }
  console.log('');
  console.log(`Unique Variants: ${RESULTS.variants.size}`);
  console.log('');

  // Diversity score (0-1, higher = more unique)
  const diversityScore = RESULTS.variants.size / (RESULTS.passed || 1);
  console.log(`Diversity Score: ${diversityScore.toFixed(2)} (target: ≥0.80)`);
  console.log(`${diversityScore >= 0.80 ? '✓' : '✗'} Diversity target ${diversityScore >= 0.80 ? 'MET' : 'MISSED'}`);
  console.log('');

  console.log('─'.repeat(60));
  console.log(`Status: ${RESULTS.passed >= 28 && diversityScore >= 0.80 ? '🎉 PASS' : '⚠️  REVIEW'}`);
  console.log('─'.repeat(60));
}

runTests().catch(console.error);
