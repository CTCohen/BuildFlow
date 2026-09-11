/**
 * Conditional Features System
 *
 * Components import and use these utilities to render features based on
 * conditional flags (emergency, portfolio, seasonal, etc.)
 */

import { client } from './client';

export interface ConditionalFeatures {
  emergencyFocused?: boolean;      // Floating CTA, 24/7 messaging
  portfolioHeavy?: boolean;        // Before/after carousel, galleries
  seasonal?: boolean;              // Availability calendar, seasonal CTA
  projectBased?: boolean;          // Timeline, scope explainer
  premiumPositioning?: boolean;    // Luxury aesthetic, craftsmanship story
  multiLocation?: boolean;         // Location switcher
  soloOperator?: boolean;          // Owner story, personal tone
  healthSafety?: boolean;          // Certifications, education focus
}

/**
 * Get conditional features for the current client
 */
export function getConditionalFeatures(): ConditionalFeatures {
  if (client.conditionalFeatures) {
    return client.conditionalFeatures;
  }

  // Auto-detect from business data (fallback)
  const trade = client.business.trade.toLowerCase();
  const yearsInBusiness = client.business.yearsInBusiness || 0;
  const teamSize = client.business.teamSize || 1;
  const serviceAreaCount = client.business.serviceAreas?.length || 1;

  return {
    emergencyFocused: ['hvac', 'plumbing', 'electrical', 'restoration', 'fire', 'mold'].some(t => trade.includes(t)),
    portfolioHeavy: ['roofing', 'landscaping', 'carpentry', 'restoration', 'pressure-washing'].some(t => trade.includes(t)),
    seasonal: ['landscaping', 'snow-removal', 'pool', 'tree-care'].some(t => trade.includes(t)),
    projectBased: ['fence', 'deck', 'renovation', 'construction'].some(t => trade.includes(t)),
    premiumPositioning: yearsInBusiness > 10 || teamSize > 20,
    multiLocation: serviceAreaCount > 3 || teamSize > 10,
    soloOperator: teamSize <= 1,
    healthSafety: ['septic', 'mold', 'radon', 'well', 'electrical'].some(t => trade.includes(t)),
  };
}

/**
 * Check if a specific feature is enabled
 */
export function hasFeature(feature: keyof ConditionalFeatures): boolean {
  const features = getConditionalFeatures();
  return features[feature] === true;
}

/**
 * CTA text variants based on urgency
 */
export function getCTAText(lang: 'en' | 'es'): string {
  const features = getConditionalFeatures();

  if (features.emergencyFocused) {
    return lang === 'en' ? 'Call for Emergency Service' : 'Llamar para servicio de emergencia';
  }

  if (features.projectBased) {
    return lang === 'en' ? 'Schedule Your Project' : 'Programar tu proyecto';
  }

  if (features.seasonal) {
    return lang === 'en' ? 'Book Your Appointment' : 'Reserva tu cita';
  }

  return lang === 'en' ? 'Get Your Free Quote' : 'Obtén tu presupuesto gratuito';
}

/**
 * Hero variant based on business characteristics
 */
export function getOptimalHeroVariant(): string {
  const features = getConditionalFeatures();
  const current = client.brand.heroStyle;

  // Emergency services: maximize urgency visibility
  if (features.emergencyFocused) {
    return 'full-bleed';  // Bold, high contrast
  }

  // Portfolio-heavy: showcase work
  if (features.portfolioHeavy) {
    return 'photo-left';  // Image emphasis
  }

  // Premium: refined aesthetic
  if (features.premiumPositioning) {
    return 'minimal';     // Elegant, subtle
  }

  // Return current or fallback
  return current || 'photo-left';
}

/**
 * Services layout based on business characteristics
 */
export function getOptimalServicesLayout(): string {
  const current = client.brand.servicesLayout;
  if (current) return current;

  const features = getConditionalFeatures();
  const serviceCount = client.content.en.services?.length || 3;

  // Portfolio-heavy: show galleries
  if (features.portfolioHeavy) {
    return 'grid-2col-feature';  // Feature first service, showcase
  }

  // Few services: spacious
  if (serviceCount <= 2) {
    return 'card-stack';  // Single column, breathable
  }

  // Many services: compact
  if (serviceCount >= 6) {
    return 'list-sidebar';  // Scalable, sidebar nav
  }

  // Standard: 3-column grid
  return 'grid-3col';
}

/**
 * Testimonial style based on business characteristics
 */
export function getOptimalTestimonialStyle(): string {
  const current = client.brand.testimonialStyle;
  if (current) return current;

  const features = getConditionalFeatures();
  const reviewCount = client.content.en.reviews?.length || 3;

  // Solo operator: featured testimonial with personal connection
  if (features.soloOperator) {
    return 'sidebar';
  }

  // Many reviews: carousel for variety
  if (reviewCount > 5) {
    return 'carousel';
  }

  // Standard: grid
  return 'grid';
}

/**
 * Whether to show emergency CTA
 */
export function shouldShowEmergencyCTA(): boolean {
  return hasFeature('emergencyFocused');
}

/**
 * Whether to show before/after carousel
 */
export function shouldShowPortfolio(): boolean {
  return hasFeature('portfolioHeavy');
}

/**
 * Whether to show seasonal availability widget
 */
export function shouldShowSeasonalWidget(): boolean {
  return hasFeature('seasonal');
}

/**
 * Whether to show project timeline explainer
 */
export function shouldShowProjectTimeline(): boolean {
  return hasFeature('projectBased');
}

/**
 * Whether to show owner/artisan story
 */
export function shouldShowOwnerStory(): boolean {
  return hasFeature('soloOperator') || hasFeature('premiumPositioning');
}

/**
 * Whether to show location switcher
 */
export function shouldShowLocationSwitcher(): boolean {
  return hasFeature('multiLocation');
}

/**
 * Whether to emphasize certifications/health messaging
 */
export function shouldShowHealthSafetyFocus(): boolean {
  return hasFeature('healthSafety');
}

/**
 * Get the primary CTA urgency level for styling
 */
export function getCTAUrgency(): 'high' | 'normal' | 'low' {
  const features = getConditionalFeatures();

  if (features.emergencyFocused) return 'high';
  if (features.projectBased) return 'normal';
  if (features.seasonal) return 'normal';

  return 'low';
}
