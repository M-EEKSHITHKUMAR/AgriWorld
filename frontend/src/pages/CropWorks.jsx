import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, Bell } from 'lucide-react';
import {
  getCropWorks, getReminders, createCropWork, markWorkCompleted, snoozeReminder, deleteCropWork,
} from '../services/cropWorkService';
import CropWorkForm from '../components/cropworks/CropWorkForm';
import ReminderTabs from '../components/cropworks/ReminderTabs';
import Timeline from '../components/cropworks/Timeline';

const CropWorks = () => {
  const [works, setWorks] = useState([]);
  const [activeTab, setActiveTab] = useState('today');
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadWorks = useCallback(async () => {
    const { works } = await getCropWorks();
    setWorks(works);
  }, []);

  const loadReminders = useCallback(async (tab) => {
    const { reminders } = await getReminders(tab);
    setReminders(reminders);
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([loadWorks(), loadReminders('today')]);
        const { reminders: todaysReminders } = await getReminders('today');
        if (todaysReminders.length) {
          toast(`🔔 You have ${todaysReminders.length} task(s) due today!`, { duration: 5000 });
        }
      } catch {
        toast.error('Failed to load crop works data');
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    try {
      await loadReminders(tab);
    } catch {
      toast.error('Failed to load reminders');
    }
  };

  const handleCreate = async (data) => {
    setSubmitting(true);
    try {
      await createCropWork(data);
      toast.success('Crop work added');
      setShowForm(false);
      await Promise.all([loadWorks(), loadReminders(activeTab)]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add crop work');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await markWorkCompleted(id);
      toast.success('Marked as completed');
      await Promise.all([loadWorks(), loadReminders(activeTab)]);
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleSnooze = async (id) => {
    try {
      await snoozeReminder(id, 1);
      toast.success('Reminder snoozed by 1 day');
      await loadReminders(activeTab);
    } catch {
      toast.error('Failed to snooze reminder');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCropWork(id);
      toast.success('Deleted');
      await Promise.all([loadWorks(), loadReminders(activeTab)]);
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Crop Works Diary</h1>
          <p className="text-gray-500 mt-1">Log your farming activities and manage reminders.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Crop Work
        </button>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-800">Reminder Center</h2>
        </div>
        <ReminderTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          reminders={reminders}
          onComplete={handleComplete}
          onSnooze={handleSnooze}
          onDelete={handleDelete}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Timeline</h2>
        {!loading && <Timeline works={works} onComplete={handleComplete} onDelete={handleDelete} />}
      </section>

      {showForm && (
        <CropWorkForm onSubmit={handleCreate} onClose={() => setShowForm(false)} submitting={submitting} />
      )}
    </div>
  );
};

export default CropWorks;
