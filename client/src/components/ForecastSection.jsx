import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  CircularProgress,
  Grid,
  useTheme,
  alpha,
  Paper
} from '@mui/material';
import { 
  WbSunny,
  Cloud,
  Grain, 
  AcUnit,
  Thunderstorm,
  WaterDrop,
  Visibility,
} from '@mui/icons-material';

const ForecastSection = ({ lat, lon }) => {
  const theme = useTheme();
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_KEY = typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_WEATHER_API_KEY 
    : process.env.REACT_APP_WEATHER_API_KEY;
  
  useEffect(() => {
    const fetchForecast = async () => {
      if (!lat || !lon) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        
        // Process forecast data to get daily forecasts
        const dailyForecasts = processForecastData(response.data.list);
        setForecast(dailyForecasts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching forecast data:", err);
        setError("Failed to load forecast data");
        setLoading(false);
      }
    };
    
    fetchForecast();
  }, [lat, lon, API_KEY]);
  
  // Process the 3-hour forecast data into daily forecasts
  const processForecastData = (forecastList) => {
    const dailyData = {};
    
    forecastList.forEach(item => {
      // Get date without time
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: new Date(item.dt * 1000),
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          weatherId: item.weather[0].id,
          description: item.weather[0].description,
          pop: item.pop, // Probability of precipitation
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          weatherConditions: []
        };
      } else {
        // Update min/max temperatures
        if (item.main.temp_min < dailyData[date].tempMin) {
          dailyData[date].tempMin = item.main.temp_min;
        }
        if (item.main.temp_max > dailyData[date].tempMax) {
          dailyData[date].tempMax = item.main.temp_max;
        }
      }
      
      // Store all weather conditions to determine the most frequent one
      dailyData[date].weatherConditions.push({
        id: item.weather[0].id,
        description: item.weather[0].description,
        time: new Date(item.dt * 1000).getHours()
      });
      
      // Update precipitation probability
      if (item.pop > dailyData[date].pop) {
        dailyData[date].pop = item.pop;
      }
    });
    
    // Find the most representative weather condition (during daytime if possible)
    Object.keys(dailyData).forEach(date => {
      const daytimeConditions = dailyData[date].weatherConditions.filter(
        cond => cond.time >= 9 && cond.time <= 18
      );
      
      if (daytimeConditions.length > 0) {
        // Count occurrences of each weather id during daytime
        const counts = {};
        daytimeConditions.forEach(cond => {
          counts[cond.id] = (counts[cond.id] || 0) + 1;
        });
        
        // Find the most frequent weather id
        let maxCount = 0;
        let mostFrequentId = null;
        
        Object.entries(counts).forEach(([id, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostFrequentId = parseInt(id);
          }
        });
        
        dailyData[date].weatherId = mostFrequentId;
        dailyData[date].description = daytimeConditions.find(
          cond => cond.id === mostFrequentId
        ).description;
      }
    });
    
    // Convert to array and limit to 7 days
    return Object.values(dailyData).slice(0, 7);
  };
  
  const getWeatherIcon = (weatherId) => {
    const iconSize = { fontSize: 28 };
    
    if (weatherId >= 200 && weatherId < 300) 
      return <Thunderstorm style={iconSize} className="text-purple-500" />;
    if (weatherId >= 300 && weatherId < 500) 
      return <Grain style={iconSize} className="text-blue-400" />;
    if (weatherId >= 500 && weatherId < 600) 
      return <WaterDrop style={iconSize} className="text-blue-500" />;
    if (weatherId >= 600 && weatherId < 700) 
      return <AcUnit style={iconSize} className="text-cyan-400" />;
    if (weatherId >= 700 && weatherId < 800) 
      return <Visibility style={iconSize} className="text-gray-400" />;
    if (weatherId === 800) 
      return <WbSunny style={iconSize} className="text-yellow-500" />;
    if (weatherId > 800) 
      return <Cloud style={iconSize} className="text-gray-400" />;
    return <WbSunny style={iconSize} className="text-yellow-500" />;
  };
  
  const getDayName = (date, index) => {
    if (index === 0) return "Today";
    if (index === 1) return "Tomorrow";
    
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Get weather background gradient based on weather code
  const getWeatherCardColor = (weatherId, index) => {
    const baseOpacity = Math.max(0.9 - (index * 0.08), 0.4);
    
    if (weatherId >= 200 && weatherId < 300) 
      return `linear-gradient(135deg, ${alpha('#6a1b9a', baseOpacity)} 0%, ${alpha('#4a148c', baseOpacity)} 100%)`;
    if (weatherId >= 300 && weatherId < 500) 
      return `linear-gradient(135deg, ${alpha('#42a5f5', baseOpacity)} 0%, ${alpha('#1976d2', baseOpacity)} 100%)`;
    if (weatherId >= 500 && weatherId < 600) 
      return `linear-gradient(135deg, ${alpha('#1e88e5', baseOpacity)} 0%, ${alpha('#0d47a1', baseOpacity)} 100%)`;
    if (weatherId >= 600 && weatherId < 700) 
      return `linear-gradient(135deg, ${alpha('#90caf9', baseOpacity)} 0%, ${alpha('#42a5f5', baseOpacity)} 100%)`;
    if (weatherId === 800) 
      return `linear-gradient(135deg, ${alpha('#ff9800', baseOpacity)} 0%, ${alpha('#f57c00', baseOpacity)} 100%)`;
    if (weatherId > 800) 
      return `linear-gradient(135deg, ${alpha('#78909c', baseOpacity)} 0%, ${alpha('#546e7a', baseOpacity)} 100%)`;
      
    // Default
    return `linear-gradient(135deg, ${alpha('#42a5f5', baseOpacity)} 0%, ${alpha('#1976d2', baseOpacity)} 100%)`;
  };
  
  const getWeatherDesc = (weatherId, pop) => {
    if (pop >= 0.3) {
      return `${Math.round(pop * 100)}% chance of precipitation`;
    }
    
    if (weatherId >= 200 && weatherId < 300) return "Thunderstorm";
    if (weatherId >= 300 && weatherId < 400) return "Drizzle";
    if (weatherId >= 500 && weatherId < 600) return "Rain";
    if (weatherId >= 600 && weatherId < 700) return "Snow";
    if (weatherId >= 700 && weatherId < 800) return "Mist/Fog";
    if (weatherId === 800) return "Clear sky";
    if (weatherId > 800 && weatherId <= 802) return "Partly cloudy";
    if (weatherId > 802) return "Cloudy";
    return "";
  };
  
  if (loading) {
    return (
      <Box className="w-full flex justify-center p-4 mt-6">
        <CircularProgress size={30} color="primary" />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box className="w-full p-4 text-center text-red-500 mt-6">
        <Typography>{error}</Typography>
      </Box>
    );
  }
  
  if (!forecast) return null;
  
  return (
    <Box className="mt-8 mb-8">
      <Card 
        sx={{ 
          backgroundColor: 'rgba(25, 118, 210, 0.15)', 
          borderRadius: '16px',
          backgroundImage: 'linear-gradient(to right bottom, rgba(25, 118, 210, 0.15), rgba(21, 101, 192, 0.25))'
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 4,
            mt: 2
          }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                color: 'white', 
                fontWeight: 700,
                textAlign: 'center',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '2px'
                }
              }}
            >
              7-Day Forecast
            </Typography>
          </Box>
          
          <Box className="forecast-scroll-container overflow-x-auto pb-4" sx={{ 
            '&::-webkit-scrollbar': { height: '6px' },
            '&::-webkit-scrollbar-track': { background: alpha(theme.palette.grey[400], 0.2), borderRadius: '10px' },
            '&::-webkit-scrollbar-thumb': { background: alpha(theme.palette.primary.main, 0.5), borderRadius: '10px' },
            mt: 4 
          }}>
            <Box 
              className="flex min-w-min"
              sx={{ 
                justifyContent: 'center',
                width: '100%',
                gap: { xs: '12px', sm: '16px' }
              }}
            >
              {forecast.map((day, index) => (
                <Paper
                  key={index}
                  elevation={3}
                  className="forecast-day-card flex-shrink-0 rounded-xl overflow-hidden relative"
                  sx={{
                    width: { xs: '130px', sm: '150px' },
                    background: getWeatherCardColor(day.weatherId, index),
                    color: 'white',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                >
                  <Box className="p-3 flex flex-col items-center">
                    {/* Day Name */}
                    <Typography variant="subtitle1" className="font-medium mb-1">
                      {getDayName(day.date, index)}
                    </Typography>
                    
                    {/* Date */}
                    <Typography variant="caption" className="opacity-80 mb-3">
                      {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Typography>
                    
                    {/* Weather Icon */}
                    <Box className="mb-1 p-1 bg-white bg-opacity-20 rounded-full">
                      {getWeatherIcon(day.weatherId)}
                    </Box>
                    
                    {/* Temperature */}
                    <Typography variant="h5" className="font-bold mt-2">
                      {Math.round(day.tempMax)}°
                    </Typography>
                    
                    <Typography variant="body2" className="opacity-75">
                      {Math.round(day.tempMin)}°
                    </Typography>
                    
                    {/* Divider */}
                    <Divider className="w-3/4 my-2 bg-white bg-opacity-30" />
                    
                    {/* Condition Description */}
                    <Typography variant="caption" className="text-center opacity-90 mt-1">
                      {getWeatherDesc(day.weatherId, day.pop)}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
          
          {/* Additional Weather Details */}
          <Box className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="weather-details-card rounded-xl" sx={{ 
              backgroundColor: 'rgba(30, 136, 229, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <CardContent>
                <Typography variant="h6" className="font-medium mb-3" sx={{ color: 'white' }}>
                  💧 Humidity & Precipitation
                </Typography>
                <Box className="grid grid-cols-2 gap-4">
                  {forecast.slice(0, 3).map((day, index) => (
                    <Box key={index} className="flex items-center">
                      <Box className="text-xs font-medium w-16" sx={{ color: alpha('#fff', 0.9) }}>
                        {getDayName(day.date, index)}
                      </Box>
                      <Box className="ml-2">
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.9) }}>
                          Humidity: {day.humidity}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.9) }}>
                          Precip: {Math.round(day.pop * 100)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
            
            <Card className="weather-details-card rounded-xl" sx={{ 
              backgroundColor: 'rgba(30, 136, 229, 0.15)',
              backdropFilter: 'blur(10px)'
            }}>
              <CardContent>
                <Typography variant="h6" className="font-medium mb-3" sx={{ color: 'white' }}>
                  💨 Wind Conditions
                </Typography>
                <Box className="grid grid-cols-2 gap-4">
                  {forecast.slice(0, 3).map((day, index) => (
                    <Box key={index} className="flex items-center">
                      <Box className="text-xs font-medium w-16" sx={{ color: alpha('#fff', 0.9) }}>
                        {getDayName(day.date, index)}
                      </Box>
                      <Typography variant="body2" sx={{ color: alpha('#fff', 0.9) }}>
                        {(day.windSpeed * 3.6).toFixed(1)} km/h
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Box className="mt-4 text-center">
            <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
              Data updated {new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForecastSection;