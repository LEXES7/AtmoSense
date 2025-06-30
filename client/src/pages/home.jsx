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
  
  const animationRendered = useRef(false);
  const locationFetched = useRef(false);
  const abortControllerRef = useRef(null);
  
  const API_KEY = typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_WEATHER_API_KEY 
    : process.env.REACT_APP_WEATHER_API_KEY;
  
  useEffect(() => {
    if (!API_KEY) {
      setError("Weather API key is missing. Please check your environment configuration.");
      setLoading(false);
      return;
    }
    
    if (!locationFetched.current) {
      getUserLocation();
    }
    
    return () => {
      animationRendered.current = false;
      setAnimationsReady(false);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [API_KEY]);
  
  useEffect(() => {
    if (weather && !animationRendered.current) {
      animationRendered.current = true;
      const timer = setTimeout(() => {
        setAnimationsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [weather]);

  const getUserLocation = () => {
    if (locationFetched.current) return;
    
    setLoading(true);
    setError(null);
    setAnimationsReady(false);
    animationRendered.current = false;
    
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationFetched.current = true;
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lon: longitude });
          fetchLocationName(latitude, longitude);
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setError("Failed to get your location. Please allow location access or use search instead.");
          setLoading(false);
        },
        options
      );
    } else {
      setError("Geolocation is not supported by your browser. Please use the search feature.");
      setLoading(false);
    }
  };

  const fetchLocationName = async (latitude, longitude) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`,
        { signal: abortControllerRef.current.signal }
      );
      
      if (response.data && response.data.length > 0) {
        const { name, country } = response.data[0];
        setLocation({ name, country });
      }
    } catch (err) {
      if (err.name !== 'CanceledError') {
        console.error("Error fetching location name:", err);
      }
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`,
        { signal: abortControllerRef.current.signal }
      );
      
      setWeather(response.data);
      setLoading(false);
    } catch (err) {
      if (err.name !== 'CanceledError') {
        console.error("Error fetching weather data:", err);
        
        if (err.response && err.response.status === 401) {
          setError("API authentication failed. Your OpenWeatherMap API key may be invalid or inactive.");
        } else {
          setError("Failed to fetch weather data. Please try again later.");
        }
        setLoading(false);
      }
    }
  };

  const searchLocation = async (event) => {
    if (event) event.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setAnimationsReady(false);
    animationRendered.current = false;
    
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=1&appid=${API_KEY}`,
        { signal: abortControllerRef.current.signal }
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
      if (err.name !== 'CanceledError') {
        console.error("Error searching location:", err);
        setError("Failed to search location. Please check your connection and try again.");
        setLoading(false);
      }
    }
  };

  const getBackgroundGradient = () => {
    if (!weather) return "from-blue-50 to-blue-100";
    
    const weatherId = weather.weather[0].id;
    const isDark = weather.weather[0].icon?.includes('n') || false;
    
    if (isDark) {
      return "from-gray-900 via-blue-900/20 to-gray-900";
    } else {
      if (weatherId === 800) {
        return "from-sky-400 via-yellow-100 to-sky-200";
      } else if (weatherId > 800 && weatherId <= 802) {
        return "from-blue-400 via-blue-200 to-blue-100";
      } else if (weatherId > 802) {
        return "from-gray-300 via-gray-200 to-gray-100";
      } else if (weatherId >= 700 && weatherId < 800) {
        return "from-gray-400 via-gray-300 to-gray-200";
      } else if (weatherId >= 600 && weatherId < 700) {
        return "from-blue-100 via-blue-50 to-gray-100";
      } else if (weatherId >= 500 && weatherId < 600) {
        return "from-blue-500 via-blue-400 to-blue-300";
      } else if (weatherId >= 300 && weatherId < 500) {
        return "from-blue-400 via-blue-300 to-blue-200";
      } else if (weatherId >= 200 && weatherId < 300) {
        return "from-indigo-700 via-purple-600 to-indigo-500";
      }
    }
    
    return "from-blue-50 to-blue-100";
  };

  const getCloudConfig = () => {
    if (!weather) return { count: 6, opacity: 0.4, dark: false };
    
    const weatherId = weather.weather[0].id;
    const isDark = weather.weather[0].icon?.includes('n') || false;
    
    if (weatherId === 800) {
      return { count: 2, opacity: 0.2, dark: isDark };
    } else if (weatherId > 800 && weatherId <= 802) {
      return { count: 5, opacity: 0.5, dark: isDark };
    } else if (weatherId > 802) {
      return { count: 8, opacity: 0.7, dark: isDark };
    } else if (weatherId >= 700 && weatherId < 800) {
      return { count: 4, opacity: 0.8, dark: isDark };
    } else if (weatherId >= 600 && weatherId < 700) {
      return { count: 6, opacity: 0.5, dark: isDark, snow: true };
    } else if (weatherId >= 200 && weatherId < 600) {
      return { count: 7, opacity: 0.6, dark: isDark, rain: true };
    }
    
    return { count: 6, opacity: 0.4, dark: isDark };
  };

  const renderSunEffect = () => {
    if (!animationsReady || !weather || weather.weather[0].id !== 800 || weather.weather[0].icon?.includes('n')) {
      return null;
    }

    return (
      <div className="absolute top-10 right-10 md:top-20 md:right-20 z-0 pointer-events-none">
        <div className="w-32 h-32 md:w-48 md:h-48 bg-yellow-300 rounded-full blur-xl opacity-60 animate-pulse"></div>
        <div className="w-40 h-40 md:w-64 md:h-64 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-gradient-radial from-yellow-200 to-transparent rounded-full opacity-40"></div>
      </div>
    );
  };

  const renderClouds = () => {
    if (!animationsReady) return null;
    
    const config = getCloudConfig();
    const cloudCount = config.count;
    const cloudOpacity = config.opacity;
    const isDark = config.dark;
    
    const cloudShapes = [
      'M0,20 Q5,10 10,20 T20,20 T30,20 T40,20 T50,20 T60,20 T70,20 Q75,10 80,20 L80,40 L0,40 Z',
      'M0,25 Q10,5 20,25 T40,25 T60,25 Q70,5 80,25 L80,50 L0,50 Z',
      'M0,15 Q20,0 40,15 T80,15 L80,35 L0,35 Z'
    ];
    
    return Array(cloudCount).fill().map((_, i) => {
      const size = Math.random() * 150 + 100;
      const duration = Math.random() * 80 + 60;
      const delay = Math.random() * -40;
      const shape = cloudShapes[Math.floor(Math.random() * cloudShapes.length)];
      const cloudOpacityVariation = cloudOpacity * (0.7 + Math.random() * 0.5);
      
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

  const renderStars = () => {
    if (!animationsReady || !weather || !weather.weather[0].icon?.includes('n')) return null;
    
    const weatherId = weather.weather[0].id;
    let starCount = 300;
    
    if (weatherId >= 801 && weatherId <= 802) starCount = 200;
    else if (weatherId >= 803 && weatherId <= 804) starCount = 100;
    else if (weatherId >= 700 && weatherId < 800) starCount = 60;
    else if (weatherId >= 200 && weatherId < 700) starCount = 40;
    
    const starsKey = `${weather.id}-${weatherId}-${Math.round(weather.main.temp)}`;
    
    return Array(starCount).fill().map((_, i) => {
      const size = Math.random() * 2 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      const starType = Math.floor(Math.random() * 4);
      const baseOpacity = 0.1 + Math.random() * 0.7;
      
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
            onClick={() => {
              locationFetched.current = false;
              getUserLocation();
            }}
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

  const isDarkMode = weather?.weather[0]?.icon?.includes('n') || false;
  const gradientClass = getBackgroundGradient();
  const isSunnyDay = !isDarkMode && weather?.weather[0]?.id === 800;

  return (
    <>
      <style>{`
        html, body {
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
        
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
        
        @keyframes sun-pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .star-glow {
          z-index: 0;
        }
        
        .twinkle-1, .twinkle-2, .twinkle-3, .pulse-star {
          animation-iteration-count: infinite;
          z-index: 0;
        }
      `}</style>

      <div className={`relative min-h-screen bg-gradient-to-b ${gradientClass}`}>
        {renderSunEffect()}
        
        <div className="star-container fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          {renderStars()}
        </div>
        
        <div className="cloud-container fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          {renderClouds()}
        </div>
        
        <div className="relative z-10">
          <div className="min-h-screen flex flex-col">
            <header className="flex-shrink-0 pt-20 pb-4 px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h1 className={`text-3xl sm:text-4xl font-bold ${
                      isDarkMode 
                        ? 'text-white' 
                        : isSunnyDay 
                          ? 'bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-yellow-500'
                          : 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400'
                    }`}>
                      AtmoSense
                    </h1>
                    <p className={
                      isDarkMode 
                        ? "text-gray-300 mt-1" 
                        : isSunnyDay 
                          ? "text-amber-900 mt-1" 
                          : "text-gray-600 mt-1"
                    }>
                      {location ? `Weather in ${location.name}, ${location.country}` : 'Your Local Weather'}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <form onSubmit={searchLocation} className="flex">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search city..."
                        className={`w-full sm:w-auto px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${isDarkMode
                            ? 'bg-gray-800/80 border-gray-700 text-white'
                            : isSunnyDay
                              ? 'border bg-white/80 text-gray-800'
                              : 'border bg-white text-gray-800'
                          }`}
                      />
                      <button 
                        type="submit"
                        className={`${isSunnyDay ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-2 rounded-r-lg`}
                      >
                        <Search fontSize="small" />
                      </button>
                    </form>
                    <button 
                      onClick={() => {
                        locationFetched.current = false;
                        getUserLocation();
                      }}
                      className={`flex items-center text-sm mt-2
                        ${isDarkMode 
                          ? 'text-gray-300 hover:text-blue-400' 
                          : isSunnyDay
                            ? 'text-amber-900 hover:text-amber-700'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                    >
                      <LocationOn fontSize="small" className="mr-1" />
                      Use my location
                      <Refresh fontSize="small" className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </header>
            
            <main className="flex-1 px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                {weather && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    <div className="lg:col-span-1">
                      <WeatherCard weather={weather} />
                    </div>
                    <div className="lg:col-span-2">
                      {coordinates && <ForecastSection lat={coordinates.lat} lon={coordinates.lon} />}
                    </div>
                  </div>
                )}
              </div>
            </main>
            
            <footer className="flex-shrink-0 py-4 px-4 sm:px-6">
              <div className="max-w-6xl mx-auto text-center text-sm" 
                style={{ 
                  color: isDarkMode 
                    ? 'rgba(255,255,255,0.5)' 
                    : isSunnyDay 
                      ? 'rgba(146,64,14,0.8)' 
                      : 'rgba(75,85,99,0.8)' 
                }}>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;