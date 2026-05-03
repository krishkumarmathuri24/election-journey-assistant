const express = require('express');
const cors = require('cors');
const data = require('./data.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get timeline milestones
app.get('/api/timeline', (req, res) => {
  res.json(data.timeline);
});

// Chatbot Q&A NLP mockup
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  const msgLower = message.toLowerCase();
  
  let response = "I'm your Indian Election AI assistant! Ask me about voter registration, EPIC cards, EVMs, or polling stations.";
  
  if (msgLower.includes('register') || msgLower.includes('how to vote') || msgLower.includes('voter id')) {
    response = "To register, visit the NVSP portal (voters.eci.gov.in) or use the Voter Helpline App. You can fill out Form 6 to register as a new voter. You'll need proof of address and age.";
  } else if (msgLower.includes('where') || msgLower.includes('polling') || msgLower.includes('booth')) {
    response = "You can find your polling booth on the 'Map' tab. Just look for your constituency in the area!";
  } else if (msgLower.includes('myth') || msgLower.includes('fake') || msgLower.includes('evm hack')) {
    response = "Fact Check: The Election Commission of India ensures EVMs are standalone machines not connected to the internet, making them secure. VVPAT slips provide a paper trail verification.";
  } else if (msgLower.includes('who') || msgLower.includes('candidate') || msgLower.includes('lok sabha')) {
    response = "In the Lok Sabha elections, you vote for a Member of Parliament (MP) from your constituency. The party with the majority of MPs forms the Central Government.";
  } else if (msgLower.includes('what is epic')) {
    response = "EPIC stands for Electors Photo Identity Card. It's the official Voter ID card issued by the Election Commission of India.";
  }

  // Simulate slight delay for AI processing
  setTimeout(() => res.json({ response }), 600);
});

const fs = require('fs');

// Gamification Quiz
app.get('/api/quiz', (req, res) => {
  const dynamicData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
  res.json(dynamicData.quiz);
});

// Map Polling Stations
app.get('/api/polling-stations', (req, res) => {
  const dynamicData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
  res.json(dynamicData.pollingStations);
});

const https = require('https');

// Proxy endpoint for Overpass API to avoid CORS and slowness
app.get('/api/polling-stations-proxy', (req, res) => {
  const { lat, lon } = req.query;
  const query = `
    [out:json][timeout:15];
    (
      nwr["amenity"="polling_station"](around:20000,${lat},${lon});
      nwr["amenity"="school"](around:20000,${lat},${lon});
      nwr["amenity"="college"](around:20000,${lat},${lon});
      nwr["amenity"="community_centre"](around:20000,${lat},${lon});
    );
    out center;
  `;

  const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  https.get(overpassUrl, (response) => {
    let data = '';
    response.on('data', (chunk) => { data += chunk; });
    response.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.elements && json.elements.length > 0) {
          res.json(json.elements);
        } else {
          // Fallback to static sample data if no real data found
          res.json(require('./data.json').pollingStations);
        }
      } catch (e) {
        res.json(require('./data.json').pollingStations);
      }
    });
  }).on('error', (err) => {
    // Fallback to static data on error
    res.json(require('./data.json').pollingStations);
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Election Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
