const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require('./routes/commentRoutes');
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());
app.use('/api', userRoutes);
app.use("/api/posts", postRoutes);
app.use('/api/comments', commentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;
