/**
 * ML Disease Prediction Service
 *
 * INTEGRATION POINT: replace the dummy branch below with a real call to your
 * plant-disease model API. Set ML_API_ENABLED=true and ML_DISEASE_API_URL in .env.
 *
 * Expected real API contract (POST multipart/form-data with the image):
 * { "disease": "Tomato Early Blight", "confidence": 96.42 }
 */

const DUMMY_DISEASES = [
  { disease: 'Tomato Early Blight', confidence: 96.42 },
  { disease: 'Potato Late Blight', confidence: 91.15 },
  { disease: 'Apple Cedar Rust', confidence: 88.73 },
  { disease: 'Maize Common Rust', confidence: 93.28 },
  { disease: 'Healthy Leaf', confidence: 98.05 },
];

const predictDisease = async (imagePath) => {
  if (process.env.ML_API_ENABLED === 'true' && process.env.ML_DISEASE_API_URL) {
    // TODO: replace with real axios/form-data call to ML_DISEASE_API_URL
    // const form = new FormData();
    // form.append('image', fs.createReadStream(imagePath));
    // const { data } = await axios.post(process.env.ML_DISEASE_API_URL, form, { headers: form.getHeaders() });
    // return data;
  }

  // Dummy fallback so the frontend flow is fully testable end-to-end.
  const pick = DUMMY_DISEASES[Math.floor(Math.random() * DUMMY_DISEASES.length)];
  await new Promise((resolve) => setTimeout(resolve, 800));
  return pick;
};

module.exports = { predictDisease };
