const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/weatherapp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const client = redis.createClient();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const handleSearch = async (userEmail) => {
  const cacheKey = `weather:${country}`;

  client.get(cacheKey, async (err, cachedData) => {
    if (cachedData) {
      const cachedResult = JSON.parse(cachedData);
      setForecast(cachedResult);
    } else {
      try {

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${country}&appid=${apiKey}`
        );

        const nextFiveDays = response.data.list.filter((data, index) => index % 8 === 0);

        client.setex(cacheKey, 3600, JSON.stringify(nextFiveDays));

        setForecast(nextFiveDays);

        await saveUserPreferences(userEmail, country, nextFiveDays);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
  });
};

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  preferences: [{ country: String, weatherResults: [Object] }],
});

const User = mongoose.model('User', userSchema);

const saveUserPreferences = async (email, country, weatherResults) => {
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $push: { preferences: { country, weatherResults } } },
      { upsert: true, new: true }
    );
    console.log('User preferences saved:', user);
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
};

app.get('/search-history/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json(user.preferences);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
