const pool = require('../db');
// get all restaurants
exports.getAllRestaurants = async (req, res) => {
  const { search } = req.query;

  try {
    const conn = await pool.getConnection();
    let query = "SELECT * FROM restaurants";
    let params = [];

    if (search) {
      query += " WHERE name LIKE ? OR location LIKE ?";
      params = [`%${search}%`, `%${search}%`];
    }

    const rows = await conn.query(query, params);
    conn.release();

    
    const safeRows = rows.map(row => ({
      ...row,
      restaurant_id: row.restaurant_id.toString()
    }));

    res.json(safeRows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// create new restaurant
exports.createRestaurant = async (req, res) => {
  const { name, location, description } = req.body;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO restaurants (name, location, description) VALUES (?, ?, ?)',
      [name, location, description]
    );
    conn.release();

    
    res.status(201).json({ id: result.insertId.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// update restaurant
exports.updateRestaurant = async (req, res) => {
  const { id } = req.params;
  const { name, location, description } = req.body;
  try {
    const conn = await pool.getConnection();
    await conn.query(
      'UPDATE restaurants SET name = ?, location = ?, description = ? WHERE restaurant_id = ?',
      [name, location, description, id]
    );
    conn.release();
    res.json({ message: 'Restaurant updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// delete restaurant
exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM restaurants WHERE restaurant_id = ?', [id]);
    conn.release();
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};