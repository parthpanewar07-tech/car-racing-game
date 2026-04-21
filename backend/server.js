const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, 'leaderboard.json');

// Helper to load/save leaderboard
const loadLeaderboard = () => {
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  }
  return [];
};

const saveLeaderboard = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

// GET /api/leaderboard - Fetch top scores
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = loadLeaderboard();
    // Sort descending by score
    const sorted = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 50);
    res.status(200).json({ success: true, data: sorted });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// POST /api/score - Save a new score
app.post('/api/score', (req, res) => {
  try {
    const { name, score, uid, photoURL } = req.body;
    
    if (!name || score === undefined) {
      return res.status(400).json({ success: false, message: 'Name and score are required' });
    }

    // Basic anti-cheat validation
    if (typeof score !== 'number' || score < 0) {
      return res.status(400).json({ success: false, message: 'Invalid score' });
    }

    let leaderboard = loadLeaderboard();
    
    // Check if user already exists
    const existingIndex = leaderboard.findIndex(entry => entry.uid === uid || entry.name === name);
    
    if (existingIndex !== -1) {
      // Update only if score is higher
      if (score > leaderboard[existingIndex].score) {
        leaderboard[existingIndex].score = score;
        leaderboard[existingIndex].date = new Date().toISOString();
        if (photoURL) leaderboard[existingIndex].photoURL = photoURL;
      }
    } else {
      leaderboard.push({
        id: Date.now().toString(),
        uid: uid || Date.now().toString(),
        name,
        photoURL,
        score,
        date: new Date().toISOString()
      });
    }

    saveLeaderboard(leaderboard);
    
    res.status(201).json({ success: true, message: 'Score saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET /api/health - Check if server is running
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Leaderboard API: http://localhost:${PORT}/api/leaderboard`);
});
