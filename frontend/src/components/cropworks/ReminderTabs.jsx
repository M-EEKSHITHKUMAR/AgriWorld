import { Bell, CheckCircle2, Clock, AlarmClockOff } from 'lucide-react';
import EmptyState from '../common/EmptyState';

const TABS = [
  { key: 'today', label: "Today's Tasks" },
  { key: 'upcoming', label: 'Upcoming Tasks' },
  { key: 'completed', label: 'Completed Tasks' },
];

const workLabel = (r) => (r.workName === 'Custom Work' ? r.customWorkName : r.workName);

const ReminderTabs = ({ activeTab, onTabChange, reminders, onComplete, onSnooze, onDelete }) => {
  return (
    <div className="card p-5">
      <div className="flex gap-2 border-b border-primary-100 mb-4 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.key ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-primary-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {reminders.length === 0 ? (
        <EmptyState
          icon={activeTab === 'completed' ? CheckCircle2 : Bell}
          title={`No ${activeTab === 'today' ? "tasks due today" : activeTab + ' tasks'}`}
          description="Reminders you schedule from a crop work entry will show up here."
        />
      ) : (
        <ul className="space-y-3">
          {reminders.map((r) => (
            <li key={r._id} className="flex items-center justify-between p-4 rounded-xl bg-primary-50/60 gap-3">
              <div className="min-w-0">
                <p className="font-medium text-gray-800 flex items-center gap-1.5">
                  {activeTab === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  ) : (
                    <Bell className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                  {workLabel(r)}
                </p>
                <p className="text-sm text-gray-500">Crop: {r.cropName}</p>
                <p className="text-xs text-gray-400">
                  {activeTab === 'completed'
                    ? `Completed on ${new Date(r.updatedAt).toLocaleDateString()}`
                    : `Scheduled: ${new Date(r.reminderDate).toLocaleDateString()}${r.reminderTime ? ' • ' + r.reminderTime : ''}`}
                </p>
              </div>
              {activeTab !== 'completed' && (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => onComplete(r._id)} className="btn-primary !py-1.5 !px-3 text-xs">
                    Mark Completed
                  </button>
                  <button onClick={() => onSnooze(r._id)} className="btn-secondary !py-1.5 !px-3 text-xs" title="Snooze 1 day">
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onDelete(r._id)} className="btn-secondary !py-1.5 !px-3 text-xs !text-red-500 !border-red-200">
                    <AlarmClockOff className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReminderTabs;
