import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudSun, faCloudRain, faSnowflake } from '@fortawesome/free-solid-svg-icons';

const Weather = () => {
  const [country, setCountry] = useState('');
  const [forecast, setForecast] = useState([]);

  const apiKey = '5560543e2c9b2c79c49e4b78292b5b60'; 

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${country}&appid=${apiKey}`
      );

      
      const nextFiveDays = response.data.list.filter((data, index) => index % 8 === 0);

      setForecast(nextFiveDays);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const getWeatherIcon = (weatherDescription) => {

    const iconMappings = {
      'Clear': faSun,
      'Clouds': faCloud,
      'Few clouds': faCloudSun,
      'Rain': faCloudRain,
      'Snow': faSnowflake,
    };

    return iconMappings[weatherDescription] || faSun; 
  };
  

  return (
    <div className='cont'>
      <h1>Ateyyat Weather </h1>
      <div>

      <input
          list="countries"
          name="country"
          placeholder="Enter country name"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <datalist id="countries">
  {[
    "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium",
    "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece",
    "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia",
    "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova",
    "Monaco", "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania",
    "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden",
    "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Vatican City","Algeria",
    "Bahrain", "Comoros", "Djibouti", "Egypt", "Iraq", "Jordan", "Kuwait",
   "Lebanon", "Libya", "Mauritania", "Morocco", "Oman", "Palestine", "Qatar", "Saudi Arabia",
   "Somalia", "Sudan", "Syria", "Tunisia", "United Arab Emirates", "Yemen"
  ].map((country) => (
    <option key={country} value={country} />
  ))}
</datalist>

        <button onClick={handleSearch}>Get Weather</button> 
      </div>
      {forecast.length > 0 && (
        <div className='weather'>
          {forecast.map((data, index) => (
            <div key={index} className='weather-card' >
              <div  >
              <h2>{new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</h2>
              <FontAwesomeIcon icon={getWeatherIcon(data.weather[0].main)} size="2x" />
              <h3 >Temperature: {<br></br>}{ Math.floor(data.main.temp - 273.15)}°C</h3>
              <h3 >Weather: {data.weather[0].description}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



export default Weather;

