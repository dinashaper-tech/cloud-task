class Task {
  constructor({ id, projectId, userId, title, description, status, priority, dueDate, completedAt, createdAt, updatedAt }) {
    this.id = id;
    this.projectId = projectId;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.status = status || 'todo';
    this.priority = priority || 'medium';
    this.dueDate = dueDate;
    this.completedAt = completedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  //  Check if task is overdue
  isOverdue() {
    if (!this.dueDate || this.status === 'completed') return false;
    return new Date(this.dueDate) < new Date();
  }

  //  Valid status transitions
  static VALID_STATUSES = ['todo', 'in_progress', 'completed', 'archived'];
  static VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

  static isValidStatus(status) {
    return this.VALID_STATUSES.includes(status);
  }

  static isValidPriority(priority) {
    return this.VALID_PRIORITIES.includes(priority);
  }

  // Mark task as completed
  complete() {
    this.status = 'completed';
    this.completedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      userId: this.userId,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate,
      completedAt: this.completedAt,
      isOverdue: this.isOverdue(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Task;