// Tracking IDs. Leave a value empty ('') to switch that tracker off completely.
// Nothing here loads until the visitor accepts in the consent banner (UK GDPR / PECR).
export const TRACKERS = {
  // Google Analytics 4 – Admin → Data streams → your web stream → "Measurement ID" (looks like G-ABC123XYZ)
  ga4: '',
  // Meta (Facebook/Instagram) Pixel – Events Manager → Data sources → your pixel → "Dataset ID" (a long number)
  metaPixel: '',
  // Microsoft Clarity (free heatmaps & session recordings) – Settings → Overview → "Project ID" (e.g. abcd1234ef)
  clarity: '',
};
export const TRACKING_ENABLED = Object.values(TRACKERS).some(Boolean);
