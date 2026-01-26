const TaskRepository = require('../repositories/TaskRepository');
const UserRepository = require('../repositories/UserRepository');
const { sendEmail, emailTemplates } = require('../utils/email');

// Check for tasks due in the next 24 hours
async function sendTaskReminders() {
  console.log(' Checking for due tasks...');
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const query = `
    SELECT t.*, u.email, u.first_name 
    FROM tasks t
    JOIN users u ON t.user_id = u.id
    WHERE t.due_date <= $1 
      AND t.status != 'completed'
      AND t.reminder_sent = false
  `;

  const result = await pool.query(query, [tomorrow]);
  
  for (const task of result.rows) {
    try {
      const emailContent = emailTemplates.taskDueReminder(task);
      await sendEmail({
        to: task.email,
        subject: emailContent.subject,
        html: emailContent.html
      });

      // Mark reminder as sent
      await pool.query('UPDATE tasks SET reminder_sent = true WHERE id = $1', [task.id]);
      
    } catch (error) {
      console.error(`Failed to send reminder for task ${task.id}:`, error);
    }
  }
}

module.exports = { sendTaskReminders };