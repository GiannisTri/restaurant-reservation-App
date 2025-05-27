const pool = require('../db');

// new reservation
exports.createReservation = async (req, res) => {
  const { restaurant_id, date, time, people_count } = req.body;
  const user_id = req.user.user_id;

  try {
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO reservations (user_id, restaurant_id, date, time, people_count) VALUES (?, ?, ?, ?, ?)",
      [user_id, restaurant_id, date, time, people_count]
    );
    conn.release();

    res.status(201).json({ message: "Reservation created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get reservations
exports.getUserReservations = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const conn = await pool.getConnection();
    const reservations = await conn.query(
      `SELECT r.*, res.name AS restaurant_name
       FROM reservations r
       JOIN restaurants res ON r.restaurant_id = res.restaurant_id
       WHERE r.user_id = ?`,
      [user_id]
    );
    conn.release();

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update reservation
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const { date, time, people_count } = req.body;
  const user_id = req.user.user_id;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "UPDATE reservations SET date = ?, time = ?, people_count = ? WHERE reservation_id = ? AND user_id = ?",
      [date, time, people_count, id, user_id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found or unauthorized" });
    }

    res.json({ message: "Reservation updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delte reservation
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.user_id;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?",
      [id, user_id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reservation not found or unauthorized" });
    }

    res.json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};