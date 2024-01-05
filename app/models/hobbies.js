// hobbies.js
const db = require('../services/db');

class Hobby {
  // Id of the hobby
  id;

  // Hobby details
  hobbies;

  // Location of the hobby
  location;

  // Created by
  created_by;

  constructor(hobbies, location, created_by) {
    this.hobbies = hobbies;
    this.location = location;
    this.created_by = created_by;
  }

  // Create a new hobby
  async createHobby() {
    let sql = "INSERT INTO hobbies (hobbies, location, created_by) VALUES (?, ?, ?)";
    const result = await db.query(sql, [this.hobbies, this.location, this.created_by]);
    this.id = result.insertId;
    return true;
  }

  // Read hobbies for a user
  static async getHobbiesByUser(userId) {
    let sql = "SELECT * FROM hobbies WHERE created_by = ?";
    const results = await db.query(sql, [userId]);
    return results;
  }

  // Read a hobby by ID
  static async getHobbyById(hobbyId) {
    let sql = "SELECT hobbies.*,Users.email as user FROM hobbies,Users WHERE hobbies.id = ? and hobbies.created_by = Users.id";
    const results = await db.query(sql, [hobbyId]);
    return results;
  }

  // Update a hobby
  async updateHobby() {
    let sql = "UPDATE hobbies SET hobbies = ?, location = ? WHERE id = ?";
    await db.query(sql, [this.hobbies, this.location, this.id]);
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
