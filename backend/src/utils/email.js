const AWS = require('aws-sdk');
const config = require('../config');

const ses = new AWS.SES({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

async function sendEmail({ to, subject, html }) {
  const params = {
    Source: 'noreply@cloudtask.com', // Must be verified in AWS SES
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: html } }
    }
  };

  try {
    await ses.sendEmail(params).promise();
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email send failed:', error);
    throw error;
  }
}

// Email templates
const emailTemplates = {
  welcome: (userName) => ({
    subject: 'Welcome to CloudTask!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Welcome to CloudTask, ${userName}!</h1>
        <p>Thanks for signing up. Start organizing your tasks efficiently.</p>
        <a href="https://cloudtask.com/dashboard" 
           style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">
          Get Started
        </a>
      </div>
    `
  }),

  taskDueReminder: (task) => ({
    subject: `Reminder: ${task.title} is due soon`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F59E0B;">Task Due Soon</h2>
        <p><strong>${task.title}</strong></p>
        <p>Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
        <a href="https://cloudtask.com/tasks/${task.id}" 
           style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">
          View Task
        </a>
      </div>
    `
  }),

  taskCompleted: (task, userName) => ({
    subject: 'Task Completed! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Great job, ${userName}!</h2>
        <p>You completed: <strong>${task.title}</strong></p>
      </div>
    `
  })
};

module.exports = { sendEmail, emailTemplates };