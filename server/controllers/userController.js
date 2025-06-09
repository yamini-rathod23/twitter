const { User , Post} = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', details: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      USER_NAME: name,
      USER_EMAIL: email,
      USER_PASSWORD: hashedPassword
    });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error('Signup Error:', err); // ✅ Add this
    res.status(500).json({ message: 'Database error', details: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ where: { IS_DELETED: 0 } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};



exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { USER_EMAIL: email, IS_DELETED: 0 } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.USER_PASSWORD);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Add JWT here if needed (see earlier message)
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Database error', details: err.message });
  }
};




