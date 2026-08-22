/**
 * ML Disease Prediction Service
 *
 * Adapts the uploaded image to the Flask prediction API contract.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const normalizePrediction = (prediction = {}) => {
  const confidence = Number(prediction.confidence);
  const confidencePercent = Number.isFinite(confidence)
    ? Math.max(0, Math.min(100, confidence > 0 && confidence <= 1 ? confidence * 100 : confidence))
    : 0;
  const pesticides = prediction.pesticides ?? prediction.pesticideRecommendations;

  return {
    disease: prediction.disease || 'Unknown disease',
    confidence: confidencePercent,
    treatment: Array.isArray(prediction.treatment)
      ? prediction.treatment
      : [prediction.treatment].filter(Boolean),
    preventiveMeasures: Array.isArray(prediction.preventiveMeasures)
      ? prediction.preventiveMeasures
      : [prediction.preventiveMeasures].filter(Boolean),
    pesticides: Array.isArray(pesticides)
      ? pesticides
      : String(pesticides || '')
          .split(',')
          .map((name) => name.trim())
          .filter((name) => name && name !== 'N/A')
          .map((name) => ({ name })),
  };
};

const predictDisease = async (imagePath) => {
  const apiUrl = process.env.ML_DISEASE_API_URL || 'http://localhost:6000/predict';
  const timeout = Number(process.env.ML_DISEASE_API_TIMEOUT_MS) || 20000;

  if (!imagePath) throw new Error('Image path is required for disease prediction');

  const form = new FormData();
  form.append('file', fs.createReadStream(path.resolve(imagePath)));

  try {
    const res = await axios.post(apiUrl, form, {
      headers: form.getHeaders(),
      timeout,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (!res.data || typeof res.data !== 'object') {
      throw new Error('ML API returned an invalid response');
    }

    return normalizePrediction(res.data);
  } catch (err) {
    const status = err.response?.status ? ` (${err.response.status})` : '';
    const message = err.response?.data?.message || err.message || 'Unknown ML API error';
    throw new Error(`ML disease prediction failed${status}: ${message}`);
  }
};

module.exports = { predictDisease };
