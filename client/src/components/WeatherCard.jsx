import { 
  WbSunny,
  Cloud,
  Grain, 
  AcUnit,
  Thunderstorm,
  WaterDrop,
  Air,
  Visibility,
  Navigation,
  CompareArrows,
  Schedule,
  Compress,
  ExploreOutlined
} from '@mui/icons-material';

const WeatherCard = ({ weather }) => {
  const getWeatherIcon = (weatherId, large = false) => {
    const iconSize = large ? "text-8xl" : "text-4xl"; // Increased icon sizes
    const iconClass = `${iconSize} ${getWeatherColor(weatherId)}`;

    if (weatherId >= 200 && weatherId < 300) return <Thunderstorm className={iconClass} />;
    if (weatherId >= 300 && weatherId < 600) return <Grain className={iconClass} />;
    if (weatherId >= 600 && weatherId < 700) return <AcUnit className={iconClass} />;
    if (weatherId >= 700 && weatherId < 800) return <Visibility className={iconClass} />;
    if (weatherId === 800) return <WbSunny className={iconClass} />;
    if (weatherId > 800) return <Cloud className={iconClass} />;
    return <WbSunny className={iconClass} />;
  };

  const getWeatherColor = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return "text-purple-500"; // thunderstorm
    if (weatherId >= 300 && weatherId < 600) return "text-blue-500"; // rain
    if (weatherId >= 600 && weatherId < 700) return "text-cyan-400"; // snow
    if (weatherId >= 700 && weatherId < 800) return "text-gray-400"; // atmosphere
    if (weatherId === 800) return "text-yellow-500"; // clear
    if (weatherId > 800) return "text-gray-400"; // clouds
    return "text-yellow-500";
  };

  const getBgGradient = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return "bg-gradient-to-br from-purple-900 to-blue-900"; // thunderstorm
    if (weatherId >= 300 && weatherId < 600) return "bg-gradient-to-br from-blue-700 to-blue-900"; // rain
    if (weatherId >= 600 && weatherId < 700) return "bg-gradient-to-br from-blue-200 to-blue-400"; // snow
    if (weatherId >= 700 && weatherId < 800) return "bg-gradient-to-br from-gray-300 to-gray-500"; // atmosphere
    if (weatherId === 800) return "bg-gradient-to-br from-sky-400 to-blue-500"; // clear
    if (weatherId > 800) return "bg-gradient-to-br from-slate-400 to-slate-600"; // clouds
    return "bg-gradient-to-br from-sky-400 to-blue-500";
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const weatherId = weather.weather[0].id;

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };
  
  // Function to render the wind compass
  const renderWindCompass = () => {
    const windDegree = weather.wind.deg;
    const windSpeed = Math.round(weather.wind.speed * 3.6); // Convert to km/h
    const compassSize = 160; // Increased size of compass in pixels
    
    // Determine color intensity based on wind speed
    const getWindSpeedColor = () => {
      if (windSpeed < 10) return "from-blue-300 to-blue-400";
      if (windSpeed < 20) return "from-blue-400 to-blue-500";
      if (windSpeed < 30) return "from-blue-500 to-blue-600";
      return "from-blue-600 to-blue-700";
    };
    
    return (
      <div className="w-full my-8 bg-white/10 rounded-xl p-6">
        <div className="text-center mb-4">
          <span className="text-xl font-medium">Wind Direction Compass</span>
        </div>
        
        <div className="compass-container flex flex-col items-center justify-center mx-auto">
          <div className="relative" style={{ width: `${compassSize}px`, height: `${compassSize}px` }}>
            {/* Compass background */}
            <div 
              className="absolute inset-0 rounded-full border-2 border-white/30 bg-gradient-to-br from-white/10 to-white/5"
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.1)"
              }}
            />
            
            {/* Compass markers */}
            {['N', 'E', 'S', 'W'].map((dir, i) => (
              <div 
                key={dir} 
                className="absolute text-white font-bold text-lg"
                style={{
                  top: dir === 'N' ? '8px' : dir === 'S' ? `${compassSize - 30}px` : `${compassSize/2 - 10}px`,
                  left: dir === 'E' ? `${compassSize - 30}px` : dir === 'W' ? '8px' : `${compassSize/2 - 8}px`,
                  opacity: 0.8,
                  zIndex: 2
                }}
              >
                {dir}
              </div>
            ))}
            
            {/* Secondary compass markers */}
            {['NE', 'SE', 'SW', 'NW'].map((dir, i) => {
              const angleDeg = i * 90 + 45;
              const radians = (angleDeg * Math.PI) / 180;
              const radius = (compassSize / 2) - 24;
              const x = (compassSize / 2) + radius * Math.sin(radians);
              const y = (compassSize / 2) - radius * Math.cos(radians);
              
              return (
                <div 
                  key={dir} 
                  className="absolute text-white text-sm"
                  style={{ 
                    left: `${x - 10}px`, 
                    top: `${y - 10}px`,
                    opacity: 0.7
                  }}
                >
                  {dir}
                </div>
              );
            })}
            
            {/* Degree circles - subtle circles to mark degrees */}
            <div className="absolute inset-0 rounded-full border border-white/10" 
              style={{ width: '70%', height: '70%', left: '15%', top: '15%' }} />
            <div className="absolute inset-0 rounded-full border border-white/10" 
              style={{ width: '40%', height: '40%', left: '30%', top: '30%' }} />
              
            {/* Wind direction arrow */}
            <div 
              className="absolute"
              style={{ 
                left: `${compassSize/2}px`,
                top: `${compassSize/2}px`,
                transform: `translate(-50%, -50%) rotate(${windDegree}deg)`,
                width: '100%',
                height: '100%'
              }}
            >
              <div 
                className={`w-8 h-32 bg-gradient-to-t ${getWindSpeedColor()} rounded-full absolute`}
                style={{ 
                  bottom: '50%',
                  left: 'calc(50% - 16px)',
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  transformOrigin: "50% 100%"
                }}
              />
              <div
                className="absolute rounded-full bg-white w-8 h-8"
                style={{
                  bottom: 'calc(50% - 16px)',
                  left: 'calc(50% - 16px)',
                  boxShadow: "0 0 10px rgba(255,255,255,0.8)",
                  zIndex: 3
                }}
              />
            </div>
            
            {/* Center point */}
            <div 
              className="absolute rounded-full bg-white"
              style={{ 
                left: `${compassSize/2 - 5}px`,
                top: `${compassSize/2 - 5}px`,
                width: '10px',
                height: '10px',
                boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                zIndex: 2
              }}
            />
          </div>
          
          {/* Wind info */}
          <div className="mt-4 text-center bg-white/20 rounded-md py-2 px-4 backdrop-blur-sm w-full max-w-xs">
            <div className="text-md font-medium">
              <span className="font-bold">{getWindDirection(windDegree)}</span> • {windDegree}° • {windSpeed} km/h
            </div>
            <div className="text-sm mt-1 opacity-80">
              {windSpeed < 10 ? 'Light breeze' : windSpeed < 20 ? 'Moderate wind' : windSpeed < 30 ? 'Strong wind' : 'High wind'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Weather Card - Enlarged and Enhanced */}
      <div className={`flex-1 p-8 rounded-2xl shadow-xl mb-6 text-white ${getBgGradient(weatherId)}`}>
        {/* Top Section - Enlarged */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-5xl font-bold">
              {Math.round(weather.main.temp)}°C
            </h2>
            <div className="flex items-center space-x-2 mt-3">
              <span className="text-2xl capitalize">{weather.weather[0].description}</span>
            </div>
            <p className="text-xl mt-2 opacity-90">Feels like {Math.round(weather.main.feels_like)}°C</p>
          </div>
          <div className="flex flex-col items-center">
            {getWeatherIcon(weatherId, true)}
            <span className="text-lg mt-3 opacity-80">{new Date().toLocaleDateString([], {weekday: 'long'})}</span>
          </div>
        </div>

        {/* Middle Section - Stats with Larger Elements */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
          <div className="flex flex-col items-center bg-white/15 p-5 rounded-xl transform transition-all hover:scale-105">
            <WaterDrop className="text-3xl" />
            <span className="text-md mt-2 opacity-80">Humidity</span>
            <span className="text-xl font-semibold">{weather.main.humidity}%</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/15 p-5 rounded-xl transform transition-all hover:scale-105">
            <Air className="text-3xl" />
            <span className="text-md mt-2 opacity-80">Wind</span>
            <span className="text-xl font-semibold">{Math.round(weather.wind.speed * 3.6)} km/h</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/15 p-5 rounded-xl transform transition-all hover:scale-105">
            <Visibility className="text-3xl" />
            <span className="text-md mt-2 opacity-80">Visibility</span>
            <span className="text-xl font-semibold">{(weather.visibility / 1000).toFixed(1)} km</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/15 p-5 rounded-xl transform transition-all hover:scale-105">
            <ExploreOutlined className="text-3xl" />
            <span className="text-md mt-2 opacity-80">Pressure</span>
            <span className="text-xl font-semibold">{weather.main.pressure} hPa</span>
          </div>
        </div>
        
        {/* Wind Direction Compass - Static version without animations */}
        {renderWindCompass()}
        
        {/* Bottom Section - Improved Layout */}
        <div className="mt-6 grid grid-cols-2 gap-8 text-md opacity-90">
          <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-xl">
            <Schedule className="text-2xl" />
            <div>
              <p className="text-lg">Sunrise: {formatTime(weather.sys.sunrise)}</p>
              <p className="text-lg">Sunset: {formatTime(weather.sys.sunset)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-xl">
            <CompareArrows className="text-2xl" />
            <div>
              <p className="text-lg">Min: {Math.round(weather.main.temp_min)}°C</p>
              <p className="text-lg">Max: {Math.round(weather.main.temp_max)}°C</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary Info Card - Enhanced */}
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-6">
        <h3 className="font-semibold text-xl text-gray-700 dark:text-gray-200 mb-4">Air Conditions</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800 mr-4">
              <WaterDrop className="text-blue-500 dark:text-blue-300" fontSize="large" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold">{weather.main.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center bg-cyan-50 dark:bg-cyan-900/30 p-4 rounded-xl">
            <div className="p-3 rounded-full bg-cyan-100 dark:bg-cyan-800 mr-4">
              <Air className="text-cyan-500 dark:text-cyan-300" fontSize="large" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
              <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold">{weather.main.pressure} hPa</p>
            </div>
          </div>

          <div className="flex items-center bg-amber-50 dark:bg-amber-900/30 p-4 rounded-xl">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-800 mr-4">
              <Compress className="text-amber-500 dark:text-amber-300" fontSize="large" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pressure Change</p>
              <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold">
                {weather.main.pressure > 1013 ? '+' : '-'}{Math.abs(weather.main.pressure - 1013)} hPa
              </p>
            </div>
          </div>
          
          <div className="flex items-center bg-purple-50 dark:bg-purple-900/30 p-4 rounded-xl">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-800 mr-4">
              <Navigation className="text-purple-500 dark:text-purple-300" fontSize="large" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Wind Direction</p>
              <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold">
                {weather.wind.deg}° {getWindDirection(weather.wind.deg)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;