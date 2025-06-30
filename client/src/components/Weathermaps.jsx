import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  MyLocation, 
  Opacity,
  Visibility,
  Cloud,
  Grain,
  AcUnit,
  WbSunny,
  Thermostat,
  Air,
  Info,
  Refresh,
  Warning,
  LocationOff,
  PanTool,
  Palette,
  VisibilityOff
} from '@mui/icons-material';

const WeatherMaps = () => {
  const [selectedLayer, setSelectedLayer] = useState('precipitation_new');
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [zoomLevel, setZoomLevel] = useState(6);
  const [opacity, setOpacity] = useState(0.9);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, lat: 0, lng: 0 });
  const [mapDimensions, setMapDimensions] = useState({ width: 800, height: 600 });
  const [mapStyle, setMapStyle] = useState('light');
  const [weatherTilesLoaded, setWeatherTilesLoaded] = useState({});
  const [showWeatherLayer, setShowWeatherLayer] = useState(true);
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const locationTimeoutRef = useRef(null);
  
  const API_KEY = typeof import.meta !== 'undefined' 
    ? import.meta.env.VITE_WEATHER_API_KEY 
    : process.env.REACT_APP_WEATHER_API_KEY;

  const weatherLayers = [
    { 
      id: 'precipitation_new', 
      name: 'Precipitation', 
      icon: <Grain className="text-blue-500" />,
      description: 'Rain and snow intensity',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      activeColor: 'from-blue-600 to-blue-700',
      filter: 'none',
      blendMode: 'normal',
      colorLegend: [
        { color: '#E3F2FD', label: 'No Rain', value: '0 mm/h' },
        { color: '#2196F3', label: 'Light Rain', value: '0.1-2.5 mm/h' },
        { color: '#1976D2', label: 'Moderate Rain', value: '2.5-10 mm/h' },
        { color: '#0D47A1', label: 'Heavy Rain', value: '>10 mm/h' }
      ]
    },
    { 
      id: 'clouds_new', 
      name: 'Clouds', 
      icon: <Cloud className="text-gray-500" />,
      description: 'Cloud coverage percentage',
      color: 'bg-gradient-to-r from-gray-400 to-gray-500',
      activeColor: 'from-gray-500 to-gray-600',
      filter: 'none',
      blendMode: 'normal',
      colorLegend: [
        { color: '#FFFFFF', label: 'Clear Sky', value: '0-10%' },
        { color: '#E0E0E0', label: 'Partly Cloudy', value: '10-50%' },
        { color: '#BDBDBD', label: 'Mostly Cloudy', value: '50-90%' },
        { color: '#757575', label: 'Overcast', value: '90-100%' }
      ]
    },
    { 
      id: 'pressure_new', 
      name: 'Pressure', 
      icon: <Thermostat className="text-purple-500" />,
      description: 'Sea level atmospheric pressure',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      activeColor: 'from-purple-600 to-purple-700',
      filter: 'hue-rotate(240deg) saturate(1.8) contrast(1.3) brightness(0.9)',
      blendMode: 'multiply',
      colorLegend: [
        { color: '#E1BEE7', label: 'Low Pressure', value: '<1000 hPa' },
        { color: '#AB47BC', label: 'Normal Low', value: '1000-1010 hPa' },
        { color: '#8E24AA', label: 'Normal High', value: '1010-1020 hPa' },
        { color: '#7B1FA2', label: 'High Pressure', value: '1020-1030 hPa' },
        { color: '#6A1B9A', label: 'Very High', value: '>1030 hPa' }
      ]
    },
    { 
      id: 'wind_new', 
      name: 'Wind Speed', 
      icon: <Air className="text-green-500" />,
      description: 'Wind speed at 10m height',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      activeColor: 'from-green-600 to-green-700',
      filter: 'none',
      blendMode: 'normal',
      colorLegend: [
        { color: '#E8F5E8', label: 'Calm', value: '0-5 km/h' },
        { color: '#81C784', label: 'Light Breeze', value: '5-15 km/h' },
        { color: '#4CAF50', label: 'Moderate', value: '15-30 km/h' },
        { color: '#2E7D32', label: 'Strong Wind', value: '>30 km/h' }
      ]
    },
    { 
      id: 'temp_new', 
      name: 'Temperature', 
      icon: <WbSunny className="text-red-500" />,
      description: 'Air temperature 2m above ground',
      color: 'bg-gradient-to-r from-red-500 to-orange-500',
      activeColor: 'from-red-600 to-orange-600',
      filter: 'contrast(1.2) saturate(1.3)',
      blendMode: 'normal',
      colorLegend: [
        { color: '#1976D2', label: 'Very Cold', value: '<-10°C' },
        { color: '#2196F3', label: 'Cold', value: '-10-0°C' },
        { color: '#4CAF50', label: 'Cool', value: '0-15°C' },
        { color: '#FF9800', label: 'Warm', value: '15-30°C' },
        { color: '#F44336', label: 'Hot', value: '>30°C' }
      ]
    }
  ];

  const updateMapDimensions = useCallback(() => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMapDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  useEffect(() => {
    updateMapDimensions();
    const handleResize = () => updateMapDimensions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateMapDimensions]);

  // Fixed getUserLocation with better error handling
  const getUserLocation = useCallback(() => {
    if (loading) return; // Prevent multiple simultaneous requests
    
    setLoading(true);
    setLocationError(null);
    
    // Clear any existing timeout
    if (locationTimeoutRef.current) {
      clearTimeout(locationTimeoutRef.current);
    }
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by this browser');
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: false, // Changed to false to avoid CoreLocation errors
      timeout: 10000, // Reduced timeout
      maximumAge: 60000 // Allow cached position for 1 minute
    };

    // Set a backup timeout
    locationTimeoutRef.current = setTimeout(() => {
      setLocationError('Location request timed out');
      setLoading(false);
    }, 12000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (locationTimeoutRef.current) {
          clearTimeout(locationTimeoutRef.current);
        }
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setMapCenter({ lat: latitude, lng: longitude });
        setLocationError(null);
        setLoading(false);
      },
      (error) => {
        if (locationTimeoutRef.current) {
          clearTimeout(locationTimeoutRef.current);
        }
        let errorMessage = 'Unable to get your location';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location';
            break;
        }
        console.warn('Geolocation error:', error);
        setLocationError(errorMessage);
        setLoading(false);
      },
      options
    );
  }, [loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, []);

  const getBaseTileUrl = (z, x, y) => {
    switch(mapStyle) {
      case 'satellite':
        return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
      case 'dark':
        return `https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/${z}/${x}/${y}.png`;
      case 'light':
      default:
        return `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;
    }
  };

  // Fixed weather tile URL - ensure integer zoom levels only
  const getWeatherTileUrl = (layer, z, x, y) => {
    // Ensure zoom level is integer
    const intZoom = Math.floor(z);
    const servers = ['tile', 'a.tile', 'b.tile', 'c.tile'];
    const server = servers[Math.abs(x + y) % servers.length];
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 10));
    return `https://${server}.openweathermap.org/map/${layer}/${intZoom}/${x}/${y}.png?appid=${API_KEY}&_=${timestamp}`;
  };

  const generateTiles = useCallback(() => {
    const tiles = [];
    const tileSize = 256;
    // Ensure integer zoom level
    const intZoomLevel = Math.floor(zoomLevel);
    const zoomPow = Math.pow(2, intZoomLevel);
    
    const lat_rad = mapCenter.lat * Math.PI / 180;
    const centerTileX = (mapCenter.lng + 180) / 360 * zoomPow;
    const centerTileY = (1 - Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2 * zoomPow;
    
    const tilesWide = Math.ceil(mapDimensions.width / tileSize) + 2;
    const tilesHigh = Math.ceil(mapDimensions.height / tileSize) + 2;
    
    const startX = Math.floor(centerTileX - tilesWide / 2);
    const startY = Math.floor(centerTileY - tilesHigh / 2);
    
    for (let y = 0; y < tilesHigh; y++) {
      for (let x = 0; x < tilesWide; x++) {
        const tileX = startX + x;
        const tileY = startY + y;
        
        if (tileX >= 0 && tileX < zoomPow && tileY >= 0 && tileY < zoomPow) {
          const pixelX = (tileX - centerTileX) * tileSize + mapDimensions.width / 2;
          const pixelY = (tileY - centerTileY) * tileSize + mapDimensions.height / 2;
          
          tiles.push({
            x: tileX,
            y: tileY,
            z: intZoomLevel, // Use integer zoom
            pixelX,
            pixelY,
            key: `${intZoomLevel}-${tileX}-${tileY}`
          });
        }
      }
    }
    
    return tiles;
  }, [mapCenter, zoomLevel, mapDimensions]);

  const handleMouseDown = (e) => {
    if (!mapRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    setDragStart({
      x: clientX,
      y: clientY,
      lat: mapCenter.lat,
      lng: mapCenter.lng
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !mapRef.current) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    const scale = Math.pow(2, Math.floor(zoomLevel)); // Use integer zoom
    const pixelsPerDegree = (mapDimensions.width * scale) / 360;
    
    const deltaLat = -(deltaY / pixelsPerDegree);
    const deltaLng = (deltaX / pixelsPerDegree);
    
    const newLat = Math.max(-85, Math.min(85, dragStart.lat + deltaLat));
    let newLng = dragStart.lng + deltaLng;
    while (newLng > 180) newLng -= 360;
    while (newLng < -180) newLng += 360;
    
    setMapCenter({ lat: newLat, lng: newLng });
  }, [isDragging, dragStart, zoomLevel, mapDimensions]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const zoomIn = () => setZoomLevel(prev => Math.min(12, Math.floor(prev) + 1));
  const zoomOut = () => setZoomLevel(prev => Math.max(2, Math.floor(prev) - 1));

  const handleWheel = useCallback((e) => {
    const delta = e.deltaY > 0 ? -1 : 1; // Only integer increments
    setZoomLevel(prev => Math.max(2, Math.min(12, Math.floor(prev) + delta)));
  }, []);

  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    zoomIn();
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleMouseMove(e);
      }
    };
    
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalMouseMove);
      document.addEventListener('touchend', handleGlobalMouseUp);
      
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    } else {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalMouseMove);
      document.removeEventListener('touchend', handleGlobalMouseUp);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Add native wheel event listener to handle preventDefault properly
  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    const handleNativeWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const delta = e.deltaY > 0 ? -1 : 1;
      setZoomLevel(prev => Math.max(2, Math.min(12, Math.floor(prev) + delta)));
    };

    // Add native event listener with non-passive option
    mapElement.addEventListener('wheel', handleNativeWheel, { passive: false });

    return () => {
      if (mapElement) {
        mapElement.removeEventListener('wheel', handleNativeWheel);
      }
    };
  }, []);

  const tiles = generateTiles();
  const currentLayer = weatherLayers.find(l => l.id === selectedLayer);

  if (!API_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 dark:from-gray-900 dark:to-gray-800 pt-20 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <Warning className="text-yellow-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">API Key Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Add your OpenWeatherMap API key to view weather maps
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded font-mono">
            VITE_WEATHER_API_KEY={API_KEY || 'undefined'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Weather Maps
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore live weather conditions with high-contrast visualizations and real-time data
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Layers className="mr-3 text-blue-500" />
                Weather Layers
              </h3>
              
              <div className="space-y-3">
                {weatherLayers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                      selectedLayer === layer.id
                        ? `bg-gradient-to-r ${layer.activeColor} text-white shadow-lg transform scale-105`
                        : 'bg-gray-50/70 dark:bg-gray-700/70 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                    style={{ transform: selectedLayer === layer.id ? 'scale(1.05)' : 'scale(1)' }}
                  >
                    <div className="flex items-center p-4">
                      <div className="flex-shrink-0">
                        {layer.icon}
                      </div>
                      <div className="ml-4 text-left flex-1">
                        <div className="font-semibold text-base">{layer.name}</div>
                        <div className="text-xs opacity-75 mt-1">{layer.description}</div>
                      </div>
                    </div>
                    {selectedLayer === layer.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {currentLayer && (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Palette className="mr-3 text-purple-500" />
                  Legend
                </h3>
                <div className="space-y-3">
                  {currentLayer.colorLegend.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-5 h-5 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 mr-3"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="xl:col-span-3 space-y-4">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              <div className={`bg-gradient-to-r ${currentLayer?.activeColor} px-8 py-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-white/20 rounded-xl mr-4">
                      {currentLayer?.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{currentLayer?.name}</h2>
                      <p className="text-white/80 text-sm">{currentLayer?.description}</p>
                    </div>
                  </div>
                 
                </div>
              </div>

              <div 
                ref={mapRef}
                className={`relative h-[500px] lg:h-[650px] overflow-hidden select-none transition-all duration-300 bg-gray-100 dark:bg-gray-600 ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                onDoubleClick={handleDoubleClick}
                style={{ touchAction: 'none' }}
              >
                {/* Base Map Layer */}
                <div className="absolute inset-0 z-10">
                  {tiles.map((tile) => (
                    <img
                      key={`base-${tile.key}`}
                      src={getBaseTileUrl(tile.z, tile.x, tile.y)}
                      alt=""
                      className="absolute pointer-events-none transition-opacity duration-300"
                      style={{
                        width: '256px',
                        height: '256px',
                        left: `${tile.pixelX}px`,
                        top: `${tile.pixelY}px`,
                        imageRendering: 'auto'
                      }}
                      onError={(e) => {
                        e.target.style.backgroundColor = '#f1f5f9';
                        e.target.style.opacity = '0.7';
                      }}
                      loading="lazy"
                    />
                  ))}
                </div>

                {/* Weather Layer */}
                {showWeatherLayer && (
                  <div 
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{ 
                      opacity,
                      filter: currentLayer?.filter || 'none',
                      mixBlendMode: currentLayer?.blendMode || 'normal'
                    }}
                  >
                    {tiles.map((tile) => (
                      <img
                        key={`weather-${selectedLayer}-${tile.key}`}
                        src={getWeatherTileUrl(selectedLayer, tile.z, tile.x, tile.y)}
                        alt=""
                        className="absolute transition-opacity duration-300"
                        style={{
                          width: '256px',
                          height: '256px',
                          left: `${tile.pixelX}px`,
                          top: `${tile.pixelY}px`,
                          imageRendering: 'auto'
                        }}
                        onLoad={(e) => {
                          setWeatherTilesLoaded(prev => ({
                            ...prev,
                            [`${selectedLayer}-${tile.key}`]: true
                          }));
                        }}
                        onError={(e) => {
                          // Only log error once per tile type to reduce console spam
                          if (!e.target.dataset.errorLogged) {
                            console.warn(`Weather tile failed for ${selectedLayer} at zoom ${tile.z}:`, getWeatherTileUrl(selectedLayer, tile.z, tile.x, tile.y));
                            e.target.dataset.errorLogged = 'true';
                          }
                          e.target.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
                        }}
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}

                {userLocation && (
                  <div 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-40"
                    style={{
                      left: '50%',
                      top: '50%'
                    }}
                  >
                    <div className="relative">
                      <div className="w-6 h-6 bg-blue-500 border-3 border-white rounded-full shadow-2xl animate-pulse" />
                      <div className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-75" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                  <div className="relative">
                    <div className="w-8 h-8 bg-white/95 dark:bg-gray-800/95 border-2 border-gray-400 dark:border-gray-500 rounded-full shadow-2xl backdrop-blur-sm">
                      <div className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 left-6 bg-black/80 text-white px-4 py-3 rounded-xl backdrop-blur-lg shadow-2xl z-30">
                  <div className="flex items-center text-sm">
                    <PanTool fontSize="small" className="mr-2 text-blue-400" />
                    <span className="font-medium">Drag to pan • Scroll to zoom • Toggle weather layers</span>
                  </div>
                </div>

                <div className="absolute top-6 right-6 bg-black/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-lg z-30">
                  <div className="space-y-1">
                    <div>API: {API_KEY ? '✓ Connected' : '✗ Missing'}</div>
                    <div>Tiles: {Object.keys(weatherTilesLoaded).length}</div>
                    <div>Layer: {selectedLayer}</div>
                    <div>Zoom: {Math.floor(zoomLevel)}</div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-lg shadow-lg z-30">
                  <div className="flex items-center space-x-2">
                    <span>© {mapStyle === 'satellite' ? 'Esri' : 'CartoDB'}</span>
                    <span>•</span>
                    <span>Weather: OpenWeatherMap</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 items-center">
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Base Map</label>
                  <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    {[
                      { key: 'light', label: 'Light' },
                      { key: 'dark', label: 'Dark' },
                      { key: 'satellite', label: 'Sat' }
                    ].map((style) => (
                      <button
                        key={style.key}
                        onClick={() => setMapStyle(style.key)}
                        className={`py-1 px-2 rounded text-xs font-medium transition-all ${
                          mapStyle === style.key 
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weather Layer</label>
                  <button
                    onClick={() => setShowWeatherLayer(!showWeatherLayer)}
                    className={`w-full py-2 px-4 rounded-lg transition-all font-medium text-sm ${
                      showWeatherLayer 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {showWeatherLayer ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Zoom</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={zoomOut}
                      disabled={zoomLevel <= 2}
                      className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <ZoomOut fontSize="small" />
                    </button>
                    <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg min-w-[3rem] text-center">
                      {Math.floor(zoomLevel)}
                    </span>
                    <button
                      onClick={zoomIn}
                      disabled={zoomLevel >= 12}
                      className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      <ZoomIn fontSize="small" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Opacity</label>
                    <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {Math.round(opacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer opacity-slider"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
                  <button
                    onClick={getUserLocation}
                    disabled={loading}
                    className="w-full flex items-center justify-center py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm font-medium text-sm"
                  >
                    {loading ? (
                      <Refresh className="animate-spin mr-2" fontSize="small" />
                    ) : (
                      <MyLocation className="mr-2" fontSize="small" />
                    )}
                    {loading ? 'Finding...' : 'My Location'}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
                  <div className="flex items-center justify-center py-2 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live</span>
                  </div>
                </div>

              </div>

              {locationError && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-center">
                    <LocationOff className="text-red-500 mr-2 flex-shrink-0" fontSize="small" />
                    <div>
                      <p className="text-sm font-semibold text-red-800 dark:text-red-400">Location Error</p>
                      <p className="text-xs text-red-600 dark:text-red-300">{locationError}</p>
                    </div>
                  </div>
                </div>
              )}

              {userLocation && (
                <div className="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center">
                    <MyLocation className="text-green-500 mr-2 flex-shrink-0" fontSize="small" />
                    <div>
                      <p className="text-sm font-semibold text-green-800 dark:text-green-400">Location Found</p>
                      <p className="text-xs font-mono text-green-600 dark:text-green-300">
                        {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed CSS styles */}
      <style>{`
        .opacity-slider {
          background: linear-gradient(to right, #e5e7eb, #3b82f6);
        }
        
        .opacity-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          transition: all 0.2s ease;
        }
        
        .opacity-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
        }
        
        .opacity-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

export default WeatherMaps;