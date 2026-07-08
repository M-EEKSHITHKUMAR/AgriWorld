import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, FileText } from 'lucide-react';

const SchemeCard = ({ scheme }) => {
  const [open, setOpen] = useState(false);
  const { eligibility } = scheme;

  return (
    <motion.div layout className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-800">{scheme.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{scheme.shortDescription}</p>
        </div>
        {scheme.level === 'State' && (
          <span className="badge bg-earth-100 text-earth-700 whitespace-nowrap">{scheme.state}</span>
        )}
      </div>

      {scheme.benefits?.length > 0 && (
        <ul className="mt-3 space-y-1">
          {scheme.benefits.map((b, i) => (
            <li key={i} className="text-sm text-gray-600 flex gap-2">
              <span className="text-primary-500">•</span> {b}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3 mt-4">
        <a
          href={scheme.officialLink}
          target="_blank"
          rel="noreferrer"
          className="btn-primary !py-2 text-sm"
        >
          Apply <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 text-sm font-medium text-primary-700 hover:underline"
        >
          <FileText className="w-4 h-4" /> View Eligibility
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-primary-100 space-y-2 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-700">Eligible Farmers: </span>{eligibility?.eligibleFarmers || '—'}</p>
              <p><span className="font-semibold text-gray-700">Land Ownership: </span>{eligibility?.landOwnershipRequirement || '—'}</p>
              <p><span className="font-semibold text-gray-700">Income Criteria: </span>{eligibility?.incomeCriteria || '—'}</p>
              {eligibility?.requiredDocuments?.length > 0 && (
                <p><span className="font-semibold text-gray-700">Required Documents: </span>{eligibility.requiredDocuments.join(', ')}</p>
              )}
              {eligibility?.additionalNotes && (
                <p><span className="font-semibold text-gray-700">Additional Notes: </span>{eligibility.additionalNotes}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SchemeCard;
