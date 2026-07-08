import { motion } from 'framer-motion';
import { CheckCircle2, ShieldAlert, Sparkles, Calendar } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../services/api';

const confidenceLabel = (confidence) => {
  if (confidence >= 90) return { label: 'High Confidence', color: 'text-primary-600', bar: 'bg-primary-500' };
  if (confidence >= 70) return { label: 'Moderate Confidence', color: 'text-amber-600', bar: 'bg-amber-500' };
  return { label: 'Low Confidence', color: 'text-red-600', bar: 'bg-red-500' };
};

const PredictionCard = ({ scan }) => {
  const { label, color, bar } = confidenceLabel(scan.confidence);
  const image = scan.image?.startsWith('http') ? scan.image : `${IMAGE_BASE_URL}${scan.image}`;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-64 md:h-full bg-primary-50">
          <img src={image} alt={scan.disease} className="w-full h-full object-cover" />
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wide ${color}`}>{label}</p>
            <h2 className="text-xl font-bold text-gray-800 mt-1">{scan.disease}</h2>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Confidence Score</span>
              <span className="font-semibold text-gray-800">{scan.confidence.toFixed(2)}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scan.confidence}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${bar}`}
              />
            </div>
          </div>

          {scan.treatment?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-primary-600" /> Treatment Recommendations
              </p>
              <ul className="space-y-1.5">
                {scan.treatment.map((t, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-primary-500">•</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {scan.preventiveMeasures?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-4 h-4 text-earth-600" /> Preventive Measures
              </p>
              <ul className="space-y-1.5">
                {scan.preventiveMeasures.map((t, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-earth-500">•</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {scan.pesticideRecommendations?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Top Recommended Pesticides
              </p>
              <div className="space-y-2">
                {scan.pesticideRecommendations.map((p, i) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                    {p.description && <p className="text-xs text-gray-600 mt-0.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-400 flex items-center gap-1 pt-2">
            <Calendar className="w-3.5 h-3.5" /> Scanned on {new Date(scan.scanDate || scan.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionCard;
