"use strict";

module.exports = {
  name: 'ready',
  run: function run(client) {
    console.log("\u2705 | ".concat(client.user.username, " initialized"));
  }
};