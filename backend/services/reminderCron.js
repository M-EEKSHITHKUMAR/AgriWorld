const cron = require('node-cron');
const CropWork = require('../models/CropWork');

/**
 * Runs once a day at midnight: any reminder whose date has passed and is
 * still marked Pending/Snoozed simply stays visible under "today/upcoming"
 * logic in cropWorkController (date comparison based, no state to flip here).
 * This job exists as the extension point for push/email notifications later.
 */
const startReminderCron = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const count = await CropWork.countDocuments({ reminderStatus: 'Pending' });
      console.log(`[reminder-cron] Daily check complete. ${count} pending reminders.`);
    } catch (err) {
      console.error('[reminder-cron] Error:', err.message);
    }
  });
};

module.exports = startReminderCron;
