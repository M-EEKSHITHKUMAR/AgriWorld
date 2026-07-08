import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { CROP_WORK_TYPES } from '../../utils/statesData';

const CropWorkForm = ({ onSubmit, onClose, submitting }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { status: 'Planned' } });

  const workName = watch('workName');

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl2 shadow-card-hover w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Add Crop Work</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Crop Name</label>
              <input className="input-field" {...register('cropName', { required: 'Required' })} />
              {errors.cropName && <p className="text-red-500 text-xs mt-1">{errors.cropName.message}</p>}
            </div>
            <div>
              <label className="label-text">Work</label>
              <select className="input-field" {...register('workName', { required: 'Required' })}>
                <option value="">Select work</option>
                {CROP_WORK_TYPES.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.workName && <p className="text-red-500 text-xs mt-1">{errors.workName.message}</p>}
            </div>
          </div>

          {workName === 'Custom Work' && (
            <div>
              <label className="label-text">Custom Work Name</label>
              <input className="input-field" {...register('customWorkName', { required: 'Required' })} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Work Date</label>
              <input type="date" className="input-field" {...register('workDate', { required: 'Required' })} />
              {errors.workDate && <p className="text-red-500 text-xs mt-1">{errors.workDate.message}</p>}
            </div>
            <div>
              <label className="label-text">Status</label>
              <select className="input-field" {...register('status')}>
                <option value="Planned">Planned</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label-text">Notes</label>
            <textarea rows={2} className="input-field" {...register('notes')} />
          </div>

          <div className="p-4 rounded-xl bg-primary-50/60 space-y-3">
            <p className="text-sm font-semibold text-gray-700">Schedule Reminder (Optional)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Reminder Date</label>
                <input type="date" className="input-field" {...register('reminderDate')} />
              </div>
              <div>
                <label className="label-text">Reminder Time (Optional)</label>
                <input type="time" className="input-field" {...register('reminderTime')} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Crop Work'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CropWorkForm;
