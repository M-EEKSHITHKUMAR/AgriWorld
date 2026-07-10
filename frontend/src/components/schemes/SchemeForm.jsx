import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { INDIAN_STATES } from '../../utils/statesData';

const toLines = (value) =>
  (value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const SchemeForm = ({ onSubmit, onClose, submitting }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { level: 'Central' } });

  const level = watch('level');

  const submit = (data) => {
    onSubmit({
      name: data.name,
      level: data.level,
      state: data.level === 'State' ? data.state : '',
      shortDescription: data.shortDescription,
      officialLink: data.officialLink,
      benefits: toLines(data.benefits),
      eligibility: {
        eligibleFarmers: data.eligibleFarmers || '',
        landOwnershipRequirement: data.landOwnershipRequirement || '',
        incomeCriteria: data.incomeCriteria || '',
        requiredDocuments: toLines(data.requiredDocuments),
        additionalNotes: data.additionalNotes || '',
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl2 shadow-card-hover w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Government Scheme</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label className="label-text">Scheme Name</label>
            <input className="input-field" {...register('name', { required: 'Required' })} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Level</label>
              <select className="input-field" {...register('level')}>
                <option value="Central">Central</option>
                <option value="State">State</option>
              </select>
            </div>
            {level === 'State' && (
              <div>
                <label className="label-text">State</label>
                <select className="input-field" {...register('state', { required: level === 'State' && 'Required' })}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
            )}
          </div>

          <div>
            <label className="label-text">Short Description</label>
            <textarea rows={2} className="input-field" {...register('shortDescription', { required: 'Required' })} />
            {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription.message}</p>}
          </div>

          <div>
            <label className="label-text">Benefits (one per line)</label>
            <textarea rows={3} className="input-field" {...register('benefits')} />
          </div>

          <div>
            <label className="label-text">Official Website Link</label>
            <input className="input-field" placeholder="https://..." {...register('officialLink', { required: 'Required' })} />
            {errors.officialLink && <p className="text-red-500 text-xs mt-1">{errors.officialLink.message}</p>}
          </div>

          <div className="p-4 rounded-xl bg-primary-50/60 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Eligibility</p>
            <div>
              <label className="label-text">Eligible Farmers</label>
              <input className="input-field" {...register('eligibleFarmers')} />
            </div>
            <div>
              <label className="label-text">Land Ownership Requirement</label>
              <input className="input-field" {...register('landOwnershipRequirement')} />
            </div>
            <div>
              <label className="label-text">Income Criteria</label>
              <input className="input-field" {...register('incomeCriteria')} />
            </div>
            <div>
              <label className="label-text">Required Documents (one per line)</label>
              <textarea rows={2} className="input-field" {...register('requiredDocuments')} />
            </div>
            <div>
              <label className="label-text">Additional Notes</label>
              <textarea rows={2} className="input-field" {...register('additionalNotes')} />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Scheme'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default SchemeForm;
