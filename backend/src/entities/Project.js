class Project {
  constructor({ id, userId, name, description, color, createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.description = description;
    this.color = color || '#3B82F6';
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  //  Validate hex color
  static isValidColor(color) {
    return /^#[0-9A-F]{6}$/i.test(color);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      color: this.color,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Project;