import { useState, useEffect, useRef } from 'react';
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
  const [animationsReady, setAnimationsReady] = useState(false);
  
  // Reference to prevent multiple re-renders of animations on search
  const animationRendered = useRef(false);
  
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
    
    // Cleanup animations on component unmount
    return () => {
      animationRendered.current = false;
      setAnimationsReady(false);
    };
  }, [API_KEY]);
  
  // Effect to handle animation rendering after weather data is loaded
  useEffect(() => {
    if (weather && !animationRendered.current) {
      animationRendered.current = true;
      // Small delay to ensure smooth animations after data loads
      setTimeout(() => {
        setAnimationsReady(true);
      }, 100);
    }
  }, [weather]);

  const getUserLocation = () => {
    setLoading(true);
    setAnimationsReady(false);
    animationRendered.current = false;
    
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
    setAnimationsReady(false);
    animationRendered.current = false;
    
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

  // Get weather-specific background clouds (more clouds for cloudy weather, etc.)
  const getCloudConfig = () => {
    if (!weather) return { count: 6, opacity: 0.4, dark: false };
    
    const weatherId = weather.weather[0].id;
    const isDark = weather.weather[0].icon?.includes('n') || false; // night icon
    
    if (weatherId === 800) { // Clear sky
      return { count: 2, opacity: 0.2, dark: isDark };
    } else if (weatherId > 800 && weatherId <= 802) { // Few/scattered clouds
      return { count: 5, opacity: 0.5, dark: isDark };
    } else if (weatherId > 802) { // Broken/overcast clouds
      return { count: 8, opacity: 0.7, dark: isDark };
    } else if (weatherId >= 700 && weatherId < 800) { // Atmosphere (fog, mist)
      return { count: 4, opacity: 0.8, dark: isDark };
    } else if (weatherId >= 600 && weatherId < 700) { // Snow
      return { count: 6, opacity: 0.5, dark: isDark, snow: true };
    } else if (weatherId >= 200 && weatherId < 600) { // Rain/Thunder
      return { count: 7, opacity: 0.6, dark: isDark, rain: true };
    }
    
    return { count: 6, opacity: 0.4, dark: isDark };
  };

  // Function to render clouds
  const renderClouds = () => {
    if (!animationsReady) return null;
    
    const config = getCloudConfig();
    const cloudCount = config.count;
    const cloudOpacity = config.opacity;
    const isDark = config.dark;
    
    // Cloud shapes for variety
    const cloudShapes = [
      'M0,20 Q5,10 10,20 T20,20 T30,20 T40,20 T50,20 T60,20 T70,20 Q75,10 80,20 L80,40 L0,40 Z',
      'M0,25 Q10,5 20,25 T40,25 T60,25 Q70,5 80,25 L80,50 L0,50 Z',
      'M0,15 Q20,0 40,15 T80,15 L80,35 L0,35 Z'
    ];
    
    return Array(cloudCount).fill().map((_, i) => {
      const size = Math.random() * 150 + 100; // Random size between 100-250px
      const duration = Math.random() * 80 + 60; // Random animation duration
      const delay = Math.random() * -40; // Negative delay for some clouds to be mid-animation on load
      const shape = cloudShapes[Math.floor(Math.random() * cloudShapes.length)];
      const cloudOpacityVariation = cloudOpacity * (0.7 + Math.random() * 0.5); // Varying opacity
      
      return (
        <div 
          key={`cloud-${i}-${weather?.id || 'init'}`}
          className="absolute"
          style={{
            width: `${size}px`,
            height: `${size/2}px`,
            top: `${10 + Math.random() * 60}%`,
            left: `-${size}px`,
            opacity: cloudOpacityVariation,
            animation: `float-cloud ${duration}s linear ${delay}s infinite`,
            zIndex: 1
          }}
        >
          <svg 
            viewBox="0 0 80 50" 
            width="100%" 
            height="100%" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d={shape}
              fill={isDark ? "#334155" : "white"}
              filter={`blur(${Math.min(size/10, 8)}px)`}
            />
          </svg>
          
          {config.rain && Math.random() > 0.5 && (
            <div className="raindrops absolute inset-0 overflow-hidden opacity-70">
              {Array(5).fill().map((_, j) => (
                <div 
                  key={`raindrop-${j}`}
                  className="absolute w-0.5 bg-blue-400 rounded-full"
                  style={{
                    height: `${10 + Math.random() * 15}px`,
                    left: `${20 + Math.random() * 60}%`,
                    top: `${size/2}px`,
                    animation: `rainfall ${1 + Math.random()}s linear ${Math.random()}s infinite`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  // Function to render stars for night mode
  const renderStars = () => {
    // Only render stars in night mode and when animations are ready
    if (!animationsReady || !weather || !weather.weather[0].icon?.includes('n')) return null;
    
    // Generate different star counts based on weather (fewer stars if cloudy)
    const weatherId = weather.weather[0].id;
    let starCount = 300; // Base count for clear night
    
    if (weatherId >= 801 && weatherId <= 802) starCount = 200; // Few clouds
    else if (weatherId >= 803 && weatherId <= 804) starCount = 100; // More clouds
    else if (weatherId >= 700 && weatherId < 800) starCount = 60; // Fog/mist
    else if (weatherId >= 200 && weatherId < 700) starCount = 40; // Rain/snow/thunder
    
    // Create a unique key for this set of stars based on location and weather condition
    // This ensures stars are regenerated when location changes
    const starsKey = `${weather.id}-${weatherId}-${Math.round(weather.main.temp)}`;
    
    return Array(starCount).fill().map((_, i) => {
      const size = Math.random() * 2 + 1; // Size between 1-3px
      const x = Math.random() * 100; // Random x position
      const y = Math.random() * 100; // Random y position
      
      // Generate different types of stars for variety
      const starType = Math.floor(Math.random() * 4);
      const baseOpacity = 0.1 + Math.random() * 0.7; // Base opacity
      
      // Different animations for different star types
      let animationClass = '';
      switch(starType) {
        case 0:
          animationClass = 'twinkle-1';
          break;
        case 1:
          animationClass = 'twinkle-2';
          break;
        case 2:
          animationClass = 'twinkle-3';
          break;
        default:
          animationClass = 'pulse-star';
      }
      
      // Some stars have special "glow" effect
      const hasGlow = Math.random() > 0.9;
      const glowClass = hasGlow ? 'star-glow' : '';
      const glowSize = hasGlow ? size * 3 : size;
      
      return (
        <div
          key={`star-${starsKey}-${i}`}
          className={`absolute rounded-full ${animationClass} ${glowClass}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}%`,
            top: `${y}%`,
            opacity: baseOpacity,
            backgroundColor: hasGlow ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 1)',
            boxShadow: hasGlow ? `0 0 ${glowSize}px ${glowSize/2}px rgba(255, 255, 255, ${baseOpacity})` : 'none',
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${2 + Math.random() * 8}s`
          }}
        />
      );
    });
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

  // Determine if we should use dark mode based on weather conditions
  const isDarkMode = weather?.weather[0]?.icon?.includes('n') || false;
  
  // Enhanced night gradient for better star visibility
  const gradientClass = isDarkMode 
    ? "from-gray-900 via-blue-900/20 to-gray-900" 
    : "from-blue-50 to-blue-100";

  return (
    <div className={`relative min-h-screen overflow-hidden bg-gradient-to-b ${gradientClass}`}>
      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes float-cloud {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(100vw + 200px));
          }
        }
        
        @keyframes rainfall {
          0% {
            transform: translateY(0);
            opacity: 0.8;
          }
          80% {
            opacity: 0;
          }
          100% {
            transform: translateY(50px);
            opacity: 0;
          }
        }
        
        /* Star animations */
        @keyframes twinkle-1 {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes twinkle-2 {
          0%, 100% { opacity: 0.3; }
          30% { opacity: 0.1; }
          60% { opacity: 0.8; }
        }
        
        @keyframes twinkle-3 {
          0% { opacity: 0.2; }
          25% { opacity: 0.5; }
          50% { opacity: 0.1; }
          75% { opacity: 0.8; }
          100% { opacity: 0.2; }
        }
        
        @keyframes pulse-star {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.9; }
        }
        
        .star-glow {
          z-index: 0;
        }
        
        .twinkle-1, .twinkle-2, .twinkle-3, .pulse-star {
          animation-iteration-count: infinite;
          z-index: 0;
        }
      `}</style>
      
      {/* Night sky with stars - only renders in night mode */}
      <div className="star-container fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {renderStars()}
      </div>
      
      {/* Animated clouds background */}
      <div className="cloud-container fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {renderClouds()}
      </div>
      
      {/* Main content with proper z-index to be above stars and clouds */}
      <div className="relative z-10 p-4 sm:p-6">
        <header className="max-w-6xl mx-auto mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold ${
                isDarkMode 
                  ? 'text-white' 
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400'
              }`}>
                AtmoSense
              </h1>
              <p className={isDarkMode ? "text-gray-300 mt-1" : "text-gray-600 mt-1"}>
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
                  className={`w-full sm:w-auto px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isDarkMode
                      ? 'bg-gray-800/80 border-gray-700 text-white'
                      : 'border bg-white text-gray-800'
                    }`}
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
                className={`flex items-center text-sm mt-2
                  ${isDarkMode 
                    ? 'text-gray-300 hover:text-blue-400' 
                    : 'text-gray-600 hover:text-blue-600'
                  }`}
              >
                <LocationOn fontSize="small" className="mr-1" />
                Use my location
                <Refresh fontSize="small" className="ml-1" />
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto">
          {weather && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <WeatherCard weather={weather} />
              </div>
              <div className="lg:col-span-2">
                {coordinates && <ForecastSection lat={coordinates.lat} lon={coordinates.lon} />}
              </div>
            </div>
          )}
        </main>
        
        <footer className="max-w-6xl mx-auto mt-8 text-center text-sm pb-4" 
          style={{ color: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(75,85,99,0.8)' }}>
          <p>Powered by OpenWeatherMap • {new Date().getFullYear()} © AtmoSense</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;