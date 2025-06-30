import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Divider, 
  CircularProgress,
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
  Air,
  TrendingDown,
  Compress,
  Navigation
} from '@mui/icons-material';

const ForecastSection = ({ lat, lon }) => {
  const theme = useTheme();
  const [forecast, setForecast] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_KEY = typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_WEATHER_API_KEY 
    : process.env.REACT_APP_WEATHER_API_KEY;
  
  useEffect(() => {
    const fetchData = async () => {
      if (!lat || !lon) return;
      
      try {
        setLoading(true);
        
        const [forecastResponse, currentResponse] = await Promise.all([
          axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
          axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        ]);
        
        const dailyForecasts = processForecastData(forecastResponse.data.list);
        setForecast(dailyForecasts);
        setCurrentWeather(currentResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching forecast data:", err);
        setError("Failed to load forecast data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [lat, lon, API_KEY]);
  
  const processForecastData = (forecastList) => {
    const dailyData = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: new Date(item.dt * 1000),
          tempMin: item.main.temp_min,
          tempMax: item.main.temp_max,
          weatherId: item.weather[0].id,
          description: item.weather[0].description,
          pop: item.pop,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          weatherConditions: []
        };
      } else {
        if (item.main.temp_min < dailyData[date].tempMin) {
          dailyData[date].tempMin = item.main.temp_min;
        }
        if (item.main.temp_max > dailyData[date].tempMax) {
          dailyData[date].tempMax = item.main.temp_max;
        }
      }
      
      dailyData[date].weatherConditions.push({
        id: item.weather[0].id,
        description: item.weather[0].description,
        time: new Date(item.dt * 1000).getHours()
      });
      
      if (item.pop > dailyData[date].pop) {
        dailyData[date].pop = item.pop;
      }
    });
    
    Object.keys(dailyData).forEach(date => {
      const daytimeConditions = dailyData[date].weatherConditions.filter(
        cond => cond.time >= 9 && cond.time <= 18
      );
      
      if (daytimeConditions.length > 0) {
        const counts = {};
        daytimeConditions.forEach(cond => {
          counts[cond.id] = (counts[cond.id] || 0) + 1;
        });
        
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
    
    return Object.values(dailyData).slice(0, 7);
  };
  
  const getWeatherIcon = (weatherId) => {
    const iconSize = { fontSize: 32 };
    
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
      
    return `linear-gradient(135deg, ${alpha('#42a5f5', baseOpacity)} 0%, ${alpha('#1976d2', baseOpacity)} 100%)`;
  };
  
  const getWeatherDesc = (weatherId, pop) => {
    if (pop >= 0.3) {
      return `${Math.round(pop * 100)}% rain`;
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

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };
  
  if (loading) {
    return (
      <Card sx={{ 
        backgroundColor: 'rgba(25, 118, 210, 0.15)', 
        borderRadius: '20px',
        height: '400px'
      }}>
        <CardContent sx={{ 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <CircularProgress size={50} color="primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card sx={{ 
        backgroundColor: 'rgba(244, 67, 54, 0.15)', 
        borderRadius: '20px',
        height: '400px'
      }}>
        <CardContent sx={{ 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          <Typography variant="h6" color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }
  
  if (!forecast) return null;
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 7-Day Forecast Card */}
      <Card 
        sx={{ 
          backgroundColor: 'rgba(25, 118, 210, 0.15)', 
          borderRadius: '20px',
          backgroundImage: 'linear-gradient(to right bottom, rgba(25, 118, 210, 0.15), rgba(21, 101, 192, 0.25))',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              color: 'white', 
              fontWeight: 700,
              textAlign: 'center',
              mb: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '2px'
              }
            }}
          >
            7-Day Forecast
          </Typography>
          
          <Box sx={{ 
            overflowX: 'auto',
            overflowY: 'hidden',
            '&::-webkit-scrollbar': { height: '6px' },
            '&::-webkit-scrollbar-track': { 
              background: alpha(theme.palette.grey[400], 0.2), 
              borderRadius: '10px' 
            },
            '&::-webkit-scrollbar-thumb': { 
              background: alpha(theme.palette.primary.main, 0.5), 
              borderRadius: '10px' 
            },
            pb: 2
          }}>
            <Box 
              sx={{ 
                display: 'flex',
                gap: { xs: 2, sm: 3 },
                minWidth: 'max-content',
                pb: 1
              }}
            >
              {forecast.map((day, index) => (
                <Paper
                  key={index}
                  elevation={4}
                  sx={{
                    minWidth: { xs: '140px', sm: '160px' },
                    maxWidth: { xs: '140px', sm: '160px' },
                    background: getWeatherCardColor(day.weatherId, index),
                    color: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    }
                  }}
                >
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {getDayName(day.date, index)}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                      {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Typography>
                    
                    <Box sx={{ 
                      mb: 2, 
                      p: 2, 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                      borderRadius: '50%',
                      width: 56,
                      height: 56,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      {getWeatherIcon(day.weatherId)}
                    </Box>
                    
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {Math.round(day.tempMax)}°
                    </Typography>
                    
                    <Typography variant="body2" sx={{ 
                      opacity: 0.75, 
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
                      {Math.round(day.tempMin)}°
                    </Typography>
                    
                    <Divider sx={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                      mb: 2,
                      width: '60%',
                      margin: '0 auto 16px auto'
                    }} />
                    
                    <Typography variant="caption" sx={{ 
                      opacity: 0.9,
                      fontSize: '0.75rem',
                      lineHeight: 1.2
                    }}>
                      {getWeatherDesc(day.weatherId, day.pop)}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Updated {new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Humidity & Rain and Wind Speed Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
        gap: 3
      }}>
        <Card sx={{ 
          backgroundColor: 'rgba(30, 136, 229, 0.20)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              💧 Humidity & Rain
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              {forecast.slice(0, 3).map((day, index) => (
                <Box key={index} sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '8px' 
                }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                    {getDayName(day.date, index)}
                  </Typography>
                  <WaterDrop sx={{ color: '#81C784', mb: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                    {day.humidity}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Rain: {Math.round(day.pop * 100)}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
        
        <Card sx={{ 
          backgroundColor: 'rgba(30, 136, 229, 0.20)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              💨 Wind Speed
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              {forecast.slice(0, 3).map((day, index) => (
                <Box key={index} sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '8px' 
                }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                    {getDayName(day.date, index)}
                  </Typography>
                  <Air sx={{ color: '#4FC3F7', mb: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                    {(day.windSpeed * 3.6).toFixed(1)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    km/h
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Air Conditions Card - Moved from WeatherCard */}
      {currentWeather && (
        <Card sx={{ 
  backgroundColor: 'rgba(30, 136, 229, 0.20)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.15)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'translateY(-2px)'
          }
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              mb: 3, 
              fontWeight: 600,
              fontSize: '1.25rem'
            }}>
              Air Conditions
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
              gap: 3
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(33, 150, 243, 0.1)', 
                p: 3, 
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(33, 150, 243, 0.2)', 
                  mr: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <WaterDrop sx={{ color: '#2196F3', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                    Humidity
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {currentWeather.main.humidity}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(0, 188, 212, 0.1)', 
                p: 3, 
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 188, 212, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(0, 188, 212, 0.2)', 
                  mr: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Air sx={{ color: '#00BCD4', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                    Pressure
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {currentWeather.main.pressure} hPa
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(255, 193, 7, 0.1)', 
                p: 3, 
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 193, 7, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 193, 7, 0.2)', 
                  mr: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Compress sx={{ color: '#FFC107', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                    Pressure Change
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {currentWeather.main.pressure > 1013 ? '+' : '-'}{Math.abs(currentWeather.main.pressure - 1013)} hPa
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(156, 39, 176, 0.1)', 
                p: 3, 
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(156, 39, 176, 0.15)',
                  transform: 'translateY(-1px)'
                }
              }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(156, 39, 176, 0.2)', 
                  mr: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Navigation sx={{ color: '#9C27B0', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', mb: 0.5 }}>
                    Wind Direction
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                    {currentWeather.wind.deg}° {getWindDirection(currentWeather.wind.deg)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ForecastSection;