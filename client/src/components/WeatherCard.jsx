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
  Schedule
} from '@mui/icons-material';

const WeatherCard = ({ weather }) => {
  const getWeatherIcon = (weatherId, large = false) => {
    const iconSize = large ? "text-6xl" : "text-3xl";
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

  return (
    <div className="w-full">
      {/* Main Weather Card */}
      <div className={`p-6 rounded-xl shadow-lg mb-6 text-white ${getBgGradient(weatherId)}`}>
        {/* Top Section */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-bold">
              {Math.round(weather.main.temp)}°C
            </h2>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xl capitalize">{weather.weather[0].description}</span>
            </div>
            <p className="text-lg mt-1 opacity-90">Feels like {Math.round(weather.main.feels_like)}°C</p>
          </div>
          <div className="flex flex-col items-center">
            {getWeatherIcon(weatherId, true)}
            <span className="text-sm mt-2 opacity-80">{new Date().toLocaleDateString([], {weekday: 'long'})}</span>
          </div>
        </div>

        {/* Middle Section - Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <div className="flex flex-col items-center bg-white/10 p-3 rounded-lg">
            <WaterDrop className="text-2xl" />
            <span className="text-sm mt-1 opacity-80">Humidity</span>
            <span className="text-lg font-semibold">{weather.main.humidity}%</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/10 p-3 rounded-lg">
            <Air className="text-2xl" />
            <span className="text-sm mt-1 opacity-80">Wind</span>
            <span className="text-lg font-semibold">{Math.round(weather.wind.speed * 3.6)} km/h</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/10 p-3 rounded-lg">
            <Visibility className="text-2xl" />
            <span className="text-sm mt-1 opacity-80">Visibility</span>
            <span className="text-lg font-semibold">{(weather.visibility / 1000).toFixed(1)} km</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/10 p-3 rounded-lg">
            <Navigation className="text-2xl" style={{ transform: `rotate(${weather.wind.deg}deg)` }} />
            <span className="text-sm mt-1 opacity-80">Wind Dir</span>
            <span className="text-lg font-semibold">{weather.wind.deg}°</span>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-8 flex flex-wrap justify-between text-sm opacity-90">
          <div className="flex items-center space-x-2">
            <Schedule />
            <div>
              <p>Sunrise: {formatTime(weather.sys.sunrise)}</p>
              <p>Sunset: {formatTime(weather.sys.sunset)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CompareArrows />
            <div>
              <p>Min: {Math.round(weather.main.temp_min)}°C</p>
              <p>Max: {Math.round(weather.main.temp_max)}°C</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Secondary Info Card */}
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl p-4">
        <h3 className="font-medium text-lg text-gray-700 dark:text-gray-200 mb-3">Air Conditions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
              <WaterDrop className="text-blue-500 dark:text-blue-300" fontSize="small" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="text-gray-700 dark:text-gray-200 font-semibold">{weather.main.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-900 mr-3">
              <Air className="text-cyan-500 dark:text-cyan-300" fontSize="small" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Pressure</p>
              <p className="text-gray-700 dark:text-gray-200 font-semibold">{weather.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;