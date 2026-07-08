import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, accent = 'primary' }) => {
  const accents = {
    primary: 'bg-primary-100 text-primary-700',
    earth: 'bg-earth-100 text-earth-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accents[accent]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
