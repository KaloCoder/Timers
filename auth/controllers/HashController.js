const crypto = require("crypto");

class HashController {
  hash = (d) => {
    if (!d) {
      throw new Error("Data argument is missing");
    }
    return crypto.createHash("sha256").update(d).digest("hex");
  };
}

module.exports = new HashController();
