import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import { NotebookPen } from 'lucide-react';

const workLabel = (w) => (w.workName === 'Custom Work' ? w.customWorkName : w.workName);

const Timeline = ({ works, onComplete, onDelete }) => {
  if (!works.length) {
    return (
      <EmptyState
        icon={NotebookPen}
        title="No crop work entries yet"
        description="Start logging your farming activities to build your digital diary."
      />
    );
  }

  return (
    <div className="space-y-4">
      {works.map((work, i) => (
        <motion.div
          key={work._id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="card p-4 flex gap-4"
        >
          <div className="flex flex-col items-center pt-1">
            <button onClick={() => work.status !== 'Completed' && onComplete(work._id)}>
              {work.status === 'Completed' ? (
                <CheckCircle2 className="w-5 h-5 text-primary-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 hover:text-primary-400" />
              )}
            </button>
            {i < works.length - 1 && <div className="w-px flex-1 bg-primary-100 mt-2" />}
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-400">{new Date(work.workDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <h3 className="font-semibold text-gray-800">{workLabel(work)}</h3>
                <p className="text-sm text-gray-500">{work.cropName}</p>
              </div>
              <button onClick={() => onDelete(work._id)} className="text-gray-400 hover:text-red-500 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {work.notes && <p className="text-sm text-gray-600 mt-2">{work.notes}</p>}
            <span
              className={`badge mt-2 ${
                work.status === 'Completed' ? 'bg-primary-100 text-primary-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {work.status}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
