/**
 * Agent Decision Engine v2
 *
 * Analyzes business data using vertical pools and conditional features
 * to make informed design decisions before rendering.
 */

import { client, type Client } from './client';
import { getConditionalFeatures, getOptimalHeroVariant, getOptimalServicesLayout, getOptimalTestimonialStyle } from './conditional-features';
import { getVerticalPool, getRandomPalette, type VerticalPool } from '../data/vertical-pools';

export interface AgentDecision {
  verticalId: string;
  verticalName: string;
  palette: {
    primary: string;
    accent: string;
    primaryDark?: string;
    primaryLight?: string;
  };
  heroVariant: string;
  servicesLayout: string;
  testimonialStyle: string;
  urgencyLevel: 'high' | 'normal' | 'low';
  reasoning: string;
}

/**
 * Analyze business data for decision-making
 */
function analyzeBusinessData(c: Client) {
  const trade = c.business.trade.toLowerCase();
  const yearsInBusiness = c.business.yearsInBusiness || 0;
  const teamSize = c.business.teamSize || 1;
  const serviceAreas = c.business.serviceAreas?.length || 1;

  return {
    trade,
    yearsInBusiness,
    teamSize,
    serviceAreas,
    maturity: yearsInBusiness > 10 ? 'established' : yearsInBusiness > 5 ? 'growing' : 'startup',
    scale: teamSize > 20 ? 'large' : teamSize > 5 ? 'medium' : 'small',
  };
}

/**
 * Build reasoning explanation for design decisions
 */
function buildReasoning(
  analysis: ReturnType<typeof analyzeBusinessData>,
  features: ReturnType<typeof getConditionalFeatures>,
  pool: VerticalPool
): string {
  const parts: string[] = [];

  parts.push(`Using ${pool.category} design system (${pool.verticalName})`);

  if (analysis.maturity === 'established') {
    parts.push('Established business (premium aesthetic)');
  } else if (analysis.maturity === 'growing') {
    parts.push('Growing business (professional messaging)');
  } else {
    parts.push('Startup (trust-building)');
  }

  if (features.soloOperator) {
    parts.push('Solo operator (personal messaging)');
  } else if (features.multiLocation) {
    parts.push('Multi-location service (regional emphasis)');
  }

  if (features.emergencyFocused) parts.push('Emergency-focused (24/7 CTA)');
  if (features.portfolioHeavy) parts.push('Portfolio-heavy (galleries)');
  if (features.projectBased) parts.push('Project-based (timeline)');
  if (features.premiumPositioning) parts.push('Premium positioning (luxury)');

  return parts.join('. ');
}

/**
 * Make design decisions for a client
 */
export function makeDesignDecisions(c: Client = client): AgentDecision {
  const analysis = analyzeBusinessData(c);
  const features = getConditionalFeatures();

  // Get vertical pool for this trade
  const verticalPool = getVerticalPool(analysis.trade);

  // Select color palette from vertical pool
  const palette = getRandomPalette(verticalPool);

  // Get optimal component variants based on conditional features
  const heroVariant = getOptimalHeroVariant();
  const servicesLayout = getOptimalServicesLayout();
  const testimonialStyle = getOptimalTestimonialStyle();

  // Determine urgency level
  const urgencyLevel = features.emergencyFocused ? 'high' : features.projectBased ? 'normal' : 'low';

  // Build reasoning explanation
  const reasoning = buildReasoning(analysis, features, verticalPool);

  return {
    verticalId: verticalPool.verticalId,
    verticalName: verticalPool.verticalName,
    palette,
    heroVariant,
    servicesLayout,
    testimonialStyle,
    urgencyLevel,
    reasoning,
  };
}
