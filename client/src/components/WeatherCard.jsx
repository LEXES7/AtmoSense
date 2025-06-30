import { 
  WbSunny,
  Cloud,
  Grain, 
  AcUnit,
  Thunderstorm,
  WaterDrop,
  Air,
  Visibility,
  CompareArrows,
  Schedule,
  ExploreOutlined
} from '@mui/icons-material';

const WeatherCard = ({ weather }) => {
  const getWeatherIcon = (weatherId, large = false) => {
    const iconSize = large ? "text-6xl md:text-8xl" : "text-3xl md:text-4xl"; 
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
    if (weatherId >= 200 && weatherId < 300) return "text-purple-500";
    if (weatherId >= 300 && weatherId < 600) return "text-blue-500";
    if (weatherId >= 600 && weatherId < 700) return "text-cyan-400";
    if (weatherId >= 700 && weatherId < 800) return "text-gray-400";
    if (weatherId === 800) return "text-yellow-500";
    if (weatherId > 800) return "text-gray-400";
    return "text-yellow-500";
  };

  const getBgGradient = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return "bg-gradient-to-br from-purple-900 to-blue-900";
    if (weatherId >= 300 && weatherId < 600) return "bg-gradient-to-br from-blue-700 to-blue-900";
    if (weatherId >= 600 && weatherId < 700) return "bg-gradient-to-br from-blue-200 to-blue-400";
    if (weatherId >= 700 && weatherId < 800) return "bg-gradient-to-br from-gray-300 to-gray-500";
    if (weatherId === 800) return "bg-gradient-to-br from-sky-400 to-blue-500";
    if (weatherId > 800) return "bg-gradient-to-br from-slate-400 to-slate-600";
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
  
  const renderWindCompass = () => {
    const windDegree = weather.wind.deg;
    const windSpeed = Math.round(weather.wind.speed * 3.6);
    const compassSize = 160;
    
    const getWindSpeedColor = () => {
      if (windSpeed < 10) return "from-blue-300 to-blue-400";
      if (windSpeed < 20) return "from-blue-400 to-blue-500";
      if (windSpeed < 30) return "from-blue-500 to-blue-600";
      return "from-blue-600 to-blue-700";
    };
    
    return (
      <div className="w-full my-6 md:my-8 bg-white/10 rounded-xl p-4 md:p-6">
        <div className="text-center mb-4">
          <span className="text-lg md:text-xl font-medium">Wind Direction</span>
        </div>
        
        <div className="compass-container flex flex-col items-center justify-center mx-auto">
          <div 
            className="relative mx-auto"
            style={{ 
              width: `${compassSize}px`, 
              height: `${compassSize}px`,
              maxWidth: '90vw',
              maxHeight: '90vw'
            }}
          >
            <div 
              className="absolute inset-0 rounded-full border-2 border-white/30 bg-gradient-to-br from-white/10 to-white/5"
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.1)"
              }}
            />
            
            {['N', 'E', 'S', 'W'].map((dir, i) => (
              <div 
                key={dir} 
                className="absolute text-white font-bold text-base md:text-lg flex items-center justify-center"
                style={{
                  top: dir === 'N' ? '8px' : dir === 'S' ? `${compassSize - 30}px` : `${compassSize/2 - 12}px`,
                  left: dir === 'E' ? `${compassSize - 30}px` : dir === 'W' ? '8px' : `${compassSize/2 - 12}px`,
                  width: '24px',
                  height: '24px',
                  opacity: 0.8,
                  zIndex: 2
                }}
              >
                {dir}
              </div>
            ))}
            
            {['NE', 'SE', 'SW', 'NW'].map((dir, i) => {
              const angleDeg = i * 90 + 45;
              const radians = (angleDeg * Math.PI) / 180;
              const radius = (compassSize / 2) - 24;
              const x = (compassSize / 2) + radius * Math.sin(radians);
              const y = (compassSize / 2) - radius * Math.cos(radians);
              
              return (
                <div 
                  key={dir} 
                  className="absolute text-white text-xs md:text-sm flex items-center justify-center"
                  style={{ 
                    left: `${x - 12}px`, 
                    top: `${y - 12}px`,
                    width: '24px',
                    height: '24px',
                    opacity: 0.7
                  }}
                >
                  {dir}
                </div>
              );
            })}
            
            <div className="absolute inset-0 rounded-full border border-white/10" 
              style={{ width: '70%', height: '70%', left: '15%', top: '15%' }} />
            <div className="absolute inset-0 rounded-full border border-white/10" 
              style={{ width: '40%', height: '40%', left: '30%', top: '30%' }} />
              
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
                className={`w-6 h-24 md:w-8 md:h-32 bg-gradient-to-t ${getWindSpeedColor()} rounded-full absolute`}
                style={{ 
                  bottom: '50%',
                  left: 'calc(50% - 12px)',
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  transformOrigin: "50% 100%"
                }}
              />
              <div
                className="absolute rounded-full bg-white w-6 h-6 md:w-8 md:h-8"
                style={{
                  bottom: 'calc(50% - 12px)',
                  left: 'calc(50% - 12px)',
                  boxShadow: "0 0 10px rgba(255,255,255,0.8)",
                  zIndex: 3
                }}
              />
            </div>
            
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
          
          <div className="mt-4 text-center bg-white/20 rounded-md py-2 px-4 backdrop-blur-sm w-full max-w-xs mx-auto">
            <div className="text-sm md:text-base font-medium">
              <span className="font-bold">{getWindDirection(windDegree)}</span> • {windDegree}° • {windSpeed} km/h
            </div>
            <div className="text-xs md:text-sm mt-1 opacity-80">
              {windSpeed < 10 ? 'Light breeze' : windSpeed < 20 ? 'Moderate wind' : windSpeed < 30 ? 'Strong wind' : 'High wind'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className={`flex-1 p-4 md:p-8 rounded-2xl shadow-xl text-white ${getBgGradient(weatherId)}`}>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold">
              {Math.round(weather.main.temp)}°C
            </h2>
            <div className="flex items-center justify-center md:justify-start space-x-2 mt-2 md:mt-3">
              <span className="text-lg md:text-2xl capitalize">{weather.weather[0].description}</span>
            </div>
            <p className="text-base md:text-xl mt-2 opacity-90">Feels like {Math.round(weather.main.feels_like)}°C</p>
          </div>
          <div className="flex flex-col items-center">
            {getWeatherIcon(weatherId, true)}
            <span className="text-sm md:text-lg mt-2 md:mt-3 opacity-80 text-center">
              {new Date().toLocaleDateString([], {weekday: 'long'})}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mt-8 md:mt-12">
          <div className="flex flex-col items-center bg-white/15 p-3 md:p-5 rounded-xl transform transition-all hover:scale-105 text-center">
            <WaterDrop className="text-2xl md:text-3xl" />
            <span className="text-xs md:text-sm mt-1 md:mt-2 opacity-80">Humidity</span>
            <span className="text-sm md:text-xl font-semibold">{weather.main.humidity}%</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/15 p-3 md:p-5 rounded-xl transform transition-all hover:scale-105 text-center">
            <Air className="text-2xl md:text-3xl" />
            <span className="text-xs md:text-sm mt-1 md:mt-2 opacity-80">Wind</span>
            <span className="text-sm md:text-xl font-semibold">{Math.round(weather.wind.speed * 3.6)} km/h</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/15 p-3 md:p-5 rounded-xl transform transition-all hover:scale-105 text-center">
            <Visibility className="text-2xl md:text-3xl" />
            <span className="text-xs md:text-sm mt-1 md:mt-2 opacity-80">Visibility</span>
            <span className="text-sm md:text-xl font-semibold">{(weather.visibility / 1000).toFixed(1)} km</span>
          </div>
          
          <div className="flex flex-col items-center bg-white/15 p-3 md:p-5 rounded-xl transform transition-all hover:scale-105 text-center">
            <ExploreOutlined className="text-2xl md:text-3xl" />
            <span className="text-xs md:text-sm mt-1 md:mt-2 opacity-80">Pressure</span>
            <span className="text-sm md:text-xl font-semibold">{weather.main.pressure} hPa</span>
          </div>
        </div>
        
        {renderWindCompass()}
        
        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 text-sm md:text-base opacity-90">
          <div className="flex items-center justify-center md:justify-start space-x-3 bg-white/10 p-3 md:p-4 rounded-xl">
            <Schedule className="text-xl md:text-2xl flex-shrink-0" />
            <div className="text-center md:text-left">
              <p className="text-sm md:text-lg">Sunrise: {formatTime(weather.sys.sunrise)}</p>
              <p className="text-sm md:text-lg">Sunset: {formatTime(weather.sys.sunset)}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center md:justify-start space-x-3 bg-white/10 p-3 md:p-4 rounded-xl">
            <CompareArrows className="text-xl md:text-2xl flex-shrink-0" />
            <div className="text-center md:text-left">
              <p className="text-sm md:text-lg">Min: {Math.round(weather.main.temp_min)}°C</p>
              <p className="text-sm md:text-lg">Max: {Math.round(weather.main.temp_max)}°C</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;