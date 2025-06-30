# AtmoSense 🌤️

A modern, responsive weather application built with React and powered by OpenWeatherMap API. AtmoSense provides real-time weather data, interactive weather maps, and beautiful weather-based animations.


## ✨ Features

- **Real-time Weather Data**: Get current weather conditions for any location worldwide
- **Location Detection**: Automatic location detection using browser geolocation
- **Interactive Weather Maps**: Explore weather patterns with multiple layer options:
  - Precipitation
  - Cloud coverage
  - Temperature
  - Wind speed
  - Atmospheric pressure
- **Weather Animations**: Dynamic background animations based on current weather conditions
- **5-Day Forecast**: Detailed weather predictions with hourly breakdowns
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Automatic theme switching based on day/night conditions
- **Search Functionality**: Search for weather in any city globally

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/AtmoSense.git
   cd AtmoSense
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies (if applicable)
   cd ../server
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the client directory:
   ```env
   VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
   ```

4. **Start the development server**
   ```bash
   cd client
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

## 🛠️ Built With

- **Frontend Framework**: React 18
- **Styling**: Tailwind CSS
- **UI Components**: Material-UI (MUI)
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Weather API**: OpenWeatherMap API
- **Maps**: Custom tile-based weather maps
- **Animations**: CSS animations with weather-based triggers

## 📱 Screenshots

### Home Dashboard
Beautiful weather dashboard with location-based weather data and animated backgrounds.

### Interactive Weather Maps
Multi-layer weather visualization with real-time data including precipitation, clouds, temperature, wind, and pressure.

### Mobile Responsive
Fully responsive design that works seamlessly across all devices.

## 🌐 API Integration

AtmoSense integrates with the OpenWeatherMap API to provide:

- Current weather conditions
- 5-day weather forecasts
- Weather map tiles
- Geocoding for location search
- Reverse geocoding for coordinates

## 🎨 Weather Animations

The app features dynamic animations that change based on weather conditions:

- **Sunny**: Bright gradients with sun effects
- **Cloudy**: Animated cloud movements
- **Rainy**: Cloud animations with rainfall effects
- **Night**: Starry sky with twinkling animations
- **Snowy**: Special winter-themed effects

## 📊 Weather Map Layers

- **Precipitation**: Real-time rain and snow data
- **Clouds**: Cloud coverage percentage
- **Temperature**: Temperature distribution
- **Wind Speed**: Wind patterns and intensity
- **Pressure**: Atmospheric pressure systems

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_WEATHER_API_KEY` | OpenWeatherMap API key | Yes |

### API Endpoints Used

- Current Weather: `https://api.openweathermap.org/data/2.5/weather`
- 5-Day Forecast: `https://api.openweathermap.org/data/2.5/forecast`
- Geocoding: `https://api.openweathermap.org/geo/1.0/direct`
- Reverse Geocoding: `https://api.openweathermap.org/geo/1.0/reverse`
- Weather Maps: `https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png`

## 🚀 Deployment

### Using Netlify

1. Build the project:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

3. Set environment variables in Netlify dashboard

### Using Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd client
   vercel --prod
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Material-UI](https://mui.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the powerful frontend framework

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub.

---

**AtmoSense** - Making weather beautiful and accessible ✨