// components/StructuredData.tsx
import React from 'react';

export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    'name': 'Health & Travels',
    'url': 'https://healthandtravels.com',
    'sameAs': ['https://sage.healthandtravels.com'],
    'description': 'Family adventure planning, heat-safe hiking guides, and kid-friendly itineraries for Arizona.',
    'areaServed': {
      '@type': 'State',
      'name': 'Arizona',
    },
    'knowsAbout': [
      'Arizona Family Travel',
      'Kid Friendly Hikes Phoenix and Sedona',
      'Desert Heat Safety for Children',
      'Sage AI Trip Planner',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
