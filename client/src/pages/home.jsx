import { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { LocationOn, Search, ErrorOutline, Refresh } from '@mui/icons-material';
import WeatherCard from '../components/WeatherCard';
import ForecastSection from '../components/ForecastSection';

const Home = () => {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const API_KEY = typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_WEATHER_API_KEY 
    : process.env.REACT_APP_WEATHER_API_KEY;
  
  useEffect(() => {
    if (!API_KEY) {
      setError("Weather API key is missing. Please check your environment configuration.");
      setLoading(false);
      return;
    }
    
    getUserLocation();
  }, [API_KEY]);

  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lon: longitude });
          fetchLocationName(latitude, longitude);
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          setError("Failed to get your location. Please allow location access or use search instead.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please use the search feature.");
      setLoading(false);
    }
  };

  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
      );
      
      if (response.data && response.data.length > 0) {
        const { name, country } = response.data[0];
        setLocation({ name, country });
      }
    } catch (err) {
      console.error("Error fetching location name:", err);
    }
  };

  // Fetch weather data by coordinates
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      
      setWeather(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      
      if (err.response && err.response.status === 401) {
        setError("API authentication failed. Your OpenWeatherMap API key may be invalid or inactive.");
      } else {
        setError("Failed to fetch weather data. Please try again later.");
      }
      setLoading(false);
    }
  };

  // Search for a location and get its weather
  const searchLocation = async (event) => {
    if (event) event.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First get coordinates for the location
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=1&appid=${API_KEY}`
      );
      
      if (geoResponse.data && geoResponse.data.length > 0) {
        const { lat, lon, name, country } = geoResponse.data[0];
        setLocation({ name, country });
        setCoordinates({ lat, lon });
        fetchWeatherData(lat, lon);
      } else {
        setError("Location not found. Please try another search.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error searching location:", err);
      setError("Failed to search location. Please check your connection and try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
        <CircularProgress size={48} className="text-blue-500" />
        <p className="mt-4 text-lg">Detecting your location and weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <ErrorOutline fontSize="large" />
            <h2 className="text-xl font-bold ml-2">Error</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          
          <button 
            onClick={getUserLocation}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-2"
          >
            <LocationOn className="mr-1" fontSize="small" />
            Try Again with Location
          </button>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Or search for a location:</p>
            <form onSubmit={searchLocation} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city..."
                className="flex-1 px-4 py-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
              >
                <Search fontSize="small" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <header className="max-w-4xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-blue-400 dark:to-cyan-300">
              AtmoSense
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {location ? `Weather in ${location.name}, ${location.country}` : 'Your Local Weather'}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <form onSubmit={searchLocation} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city..."
                className="w-full sm:w-auto px-4 py-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-lg"
              >
                <Search fontSize="small" />
              </button>
            </form>
            <button 
              onClick={getUserLocation}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm mt-2"
            >
              <LocationOn fontSize="small" className="mr-1" />
              Use my location
              <Refresh fontSize="small" className="ml-1" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto">
        {weather && (
          <>
            <WeatherCard weather={weather} />
            {coordinates && <ForecastSection lat={coordinates.lat} lon={coordinates.lon} />}
          </>
        )}
      </main>
      
      <footer className="max-w-4xl mx-auto mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Powered by OpenWeatherMap • {new Date().getFullYear()} © AtmoSense</p>
      </footer>
    </div>
  );
};

export default Home;