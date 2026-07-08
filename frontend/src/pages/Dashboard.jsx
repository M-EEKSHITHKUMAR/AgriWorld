import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ScanLine, NotebookPen, Landmark, Store, Bell, Loader2, ArrowRight, Plus,
} from 'lucide-react';
import { getDashboardSummary } from '../services/dashboardService';
import StatCard from '../components/common/StatCard';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { summary } = await getDashboardSummary();
        setSummary(summary);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening on your farm today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ScanLine} label="Recent Disease Scans" value={summary?.recentScans?.length ?? 0} accent="primary" />
        <StatCard icon={NotebookPen} label="Upcoming Crop Tasks" value={summary?.upcomingTasksCount ?? 0} accent="earth" />
        <StatCard icon={Landmark} label="Government Schemes" value={summary?.schemesCount ?? 0} accent="blue" />
        <StatCard icon={Store} label="Marketplace Listings" value={summary?.marketplaceCount ?? 0} accent="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-gray-800">Today&apos;s Farm Tasks</h2>
            </div>
            <Link to="/crop-works" className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {summary?.todaysTasks?.length ? (
            <ul className="space-y-3">
              {summary.todaysTasks.map((task) => (
                <li key={task._id} className="flex items-center justify-between p-3 rounded-xl bg-primary-50/60">
                  <div>
                    <p className="font-medium text-gray-800">{task.workName === 'Custom Work' ? task.customWorkName : task.workName}</p>
                    <p className="text-sm text-gray-500">{task.cropName}</p>
                  </div>
                  <span className="badge bg-amber-100 text-amber-700">Due Today</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Bell}
              title="No tasks due today"
              description="You're all caught up. New reminders will show up here."
            />
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/disease-scanner" className="btn-secondary w-full justify-start">
              <ScanLine className="w-4 h-4" /> Scan a Plant
            </Link>
            <Link to="/marketplace/new" className="btn-secondary w-full justify-start">
              <Plus className="w-4 h-4" /> List Equipment
            </Link>
            <Link to="/crop-works" className="btn-secondary w-full justify-start">
              <NotebookPen className="w-4 h-4" /> Add Crop Work
            </Link>
            <Link to="/government-schemes" className="btn-secondary w-full justify-start">
              <Landmark className="w-4 h-4" /> Explore Schemes
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
