/**
 * GoldenHour — Request Validation Middleware
 * Enforces input sanitization, validates required fields,
 * and guards against malformed payloads.
 */

function validateIncidentCreation(req, res, next) {
  const { language, location_lat, location_lng } = req.body || {};
  
  // Language must be one of the supported 3 languages
  if (language && !['en', 'hi', 'kn'].includes(language)) {
    return res.status(400).json({
      error: 'Invalid language specified. Supported: en, hi, kn',
      demoOnly: true
    });
  }

  // Validate coordinates if provided
  if (location_lat !== undefined && (typeof location_lat !== 'number' || location_lat < -90 || location_lat > 90)) {
    return res.status(400).json({ error: 'Invalid latitude value', demoOnly: true });
  }

  if (location_lng !== undefined && (typeof location_lng !== 'number' || location_lng < -180 || location_lng > 180)) {
    return res.status(400).json({ error: 'Invalid longitude value', demoOnly: true });
  }

  next();
}

function validateEventCreation(req, res, next) {
  const { event_type } = req.body || {};
  if (!event_type || typeof event_type !== 'string' || event_type.trim().length === 0) {
    return res.status(400).json({
      error: 'event_type is required and must be a non-empty string',
      demoOnly: true
    });
  }
  next();
}

module.exports = {
  validateIncidentCreation,
  validateEventCreation
};
