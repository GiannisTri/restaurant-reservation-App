const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// new user register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );
    conn.release();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
    conn.release();

    if (result.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // tokens for auth
    const token = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};