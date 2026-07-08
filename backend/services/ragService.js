/**
 * RAG Pesticide Recommendation Service
 *
 * INTEGRATION POINT: replace the dummy branch below with a real call to your
 * RAG pipeline. It should take the predicted disease name and return the
 * top-3 recommended pesticides/treatments. Set RAG_PESTICIDE_API_URL in .env.
 *
 * Expected real API contract (POST { disease }):
 * { "pesticides": [{ "name": "...", "description": "...", "score": 0.92 }, ...],
 *   "treatment": ["..."], "preventiveMeasures": ["..."] }
 */

const DUMMY_TREATMENT = [
  'Remove and destroy infected leaves',
  'Apply recommended fungicide as per label instructions',
  'Avoid overhead irrigation to reduce leaf wetness',
];

const DUMMY_PREVENTIVE = [
  'Rotate crops each season',
  'Ensure proper plant spacing for airflow',
  'Use disease-resistant seed varieties',
];

const DUMMY_PESTICIDES = [
  { name: 'Mancozeb 75% WP', description: 'Broad-spectrum contact fungicide effective against blight diseases.', score: 0.94 },
  { name: 'Chlorothalonil', description: 'Preventive fungicide, best applied before symptoms spread.', score: 0.89 },
  { name: 'Copper Oxychloride', description: 'Organic-friendly option for early-stage fungal infections.', score: 0.82 },
];

const getRecommendations = async (diseaseName) => {
  if (process.env.RAG_PESTICIDE_API_URL && process.env.ML_API_ENABLED === 'true') {
    // TODO: replace with real axios call to RAG_PESTICIDE_API_URL passing { disease: diseaseName }
    // const { data } = await axios.post(process.env.RAG_PESTICIDE_API_URL, { disease: diseaseName });
    // return data;
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    treatment: DUMMY_TREATMENT,
    preventiveMeasures: DUMMY_PREVENTIVE,
    pesticides: DUMMY_PESTICIDES,
  };
};

module.exports = { getRecommendations };
