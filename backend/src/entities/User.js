class User {
  constructor({ id, email, firstName, lastName, passwordHash, avatarUrl, isVerified, createdAt, updatedAt }) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.passwordHash = passwordHash;
    this.avatarUrl = avatarUrl;
    this.isVerified = isVerified || false;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  //  Get full name
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  //  Email validation
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Convert to safe object (without password)
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.getFullName(),
      avatarUrl: this.avatarUrl,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = User;