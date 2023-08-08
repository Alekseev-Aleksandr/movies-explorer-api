class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.srarusCode = 401;
  }
}

module.exports = Unauthorized;
