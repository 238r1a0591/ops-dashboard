const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    name: "Founder",
    email: "founder@ops.com",
    password: bcrypt.hashSync("founder123", 10),
    role: "founder",
  },
  {
    id: 2,
    name: "Analyst",
    email: "analyst@ops.com",
    password: bcrypt.hashSync("analyst123", 10),
    role: "analyst",
  },
];

module.exports = users;