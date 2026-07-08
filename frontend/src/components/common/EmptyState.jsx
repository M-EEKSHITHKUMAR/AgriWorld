import { motion } from 'framer-motion';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center py-16 px-6"
  >
    <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
      {Icon && <Icon className="w-10 h-10 text-primary-400" />}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
    {description && <p className="text-gray-500 max-w-sm mb-4">{description}</p>}
    {action}
  </motion.div>
);

export default EmptyState;
