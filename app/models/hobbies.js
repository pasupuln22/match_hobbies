// hobbies.js
const db = require('../services/db');

class Hobby {
  // Id of the hobby
  id;

  // User associated with the hobby
  user;

  // Hobby details
  hobbies;

  // Location of the hobby
  location;

  // Datetime of the hobby
  datetime;

  constructor(user, hobbies, location, datetime) {
    this.user = user;
    this.hobbies = hobbies;
    this.location = location;
    this.datetime = datetime;
  }

  // Create a new hobby
  async createHobby() {
    let sql = "INSERT INTO hobbies (user, hobbies, location, datetime) VALUES (?, ?, ?, ?)";
    const result = await db.query(sql, [this.user, this.hobbies, this.location, this.datetime]);
    this.id = result.insertId;
    return true;
  }

  // Read hobbies for a user
  static async getHobbiesByUser(userId) {
    let sql = "SELECT * FROM hobbies WHERE user = ?";
    const results = await db.query(sql, [userId]);
    return results;
  }
   // Read hobbies for a user
   static async getHobbyById(hobbyId) {
    let sql = "SELECT * FROM hobbies WHERE id = ?";
    const results = await db.query(sql, [hobbyId]);
    return results;
  }

  // Update a hobby
  async updateHobby() {
    let sql = "UPDATE hobbies SET hobbies = ?, location = ?, datetime = ? WHERE id = ?";
    await db.query(sql, [this.hobbies, this.location, this.datetime, this.id]);
    return true;
  }

  // Delete a hobby
  static async deleteHobby(hobbyId) {
    let sql = "DELETE FROM hobbies WHERE id = ?";
    await db.query(sql, [hobbyId]);
    return true;
  }
}

module.exports = {
  Hobby
};
