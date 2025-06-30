import React from 'react';
import { 
  GitHub, 
  LinkedIn, 
  CloudQueue,
  WbSunny,
  Air,
  Thermostat,
  Visibility,
  Speed,
  LocationOn,
  TrendingUp,
  Code,
  Launch,
  Email,
  School,
  Work
} from '@mui/icons-material';

export default function About() {
  const techStack = [
    { name: 'React', color: 'text-blue-500' },
    { name: 'Tailwind CSS', color: 'text-cyan-500' },
    { name: 'OpenWeatherMap API', color: 'text-orange-500' }
  ];

  const features = [
    {
      icon: <WbSunny className="text-yellow-500 text-3xl" />,
      title: 'Real-time Weather',
      description: 'Get current weather conditions for any location worldwide'
    },
    {
      icon: <TrendingUp className="text-blue-500 text-3xl" />,
      title: '7-Day Forecast',
      description: 'Plan ahead with detailed weekly weather predictions'
    },
    {
      icon: <CloudQueue className="text-gray-500 text-3xl" />,
      title: 'Interactive Maps',
      description: 'Explore weather patterns with multiple layer visualizations'
    },
    {
      icon: <Air className="text-green-500 text-3xl" />,
      title: 'Air Quality Index',
      description: 'Monitor air pollution levels and health recommendations'
    },
    {
      icon: <LocationOn className="text-red-500 text-3xl" />,
      title: 'Location-based',
      description: 'Automatic location detection or search any city globally'
    },
    {
      icon: <Speed className="text-purple-500 text-3xl" />,
      title: 'Fast & Responsive',
      description: 'Optimized performance with beautiful, modern design'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <CloudQueue className="text-white text-6xl" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            About AtmoSense
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A modern, comprehensive weather application that brings you real-time meteorological data 
            with stunning visualizations and intuitive user experience.
          </p>
        </div>

        {/* Project Story Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                The Story Behind AtmoSense
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p className="text-lg leading-relaxed">
                  Hey there! I'm <span className="font-semibold text-blue-600 dark:text-blue-400">Sachintha Bhashitha</span>, 
                  and I created AtmoSense as a passion project to combine my love for web development with my fascination for weather patterns.
                </p>
                <p className="text-lg leading-relaxed">
                  Living in a world where weather affects our daily decisions, I wanted to build something that goes beyond 
                  basic weather apps. AtmoSense provides not just current conditions, but immersive weather maps, 
                  air quality insights, and forecasts that help you truly understand your environment.
                </p>
                <p className="text-lg leading-relaxed">
                  This project showcases modern web development techniques while solving real-world problems. 
                  Every feature is crafted with user experience in mind, from the smooth animations to the 
                  intuitive interface design.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Weather Metrics</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">5</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Map Layers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">7-Day</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Forecast</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">Real-time</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Makes AtmoSense Special
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white ml-3">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Built With Modern Technologies
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {techStack.map((tech, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-full px-6 py-3 flex items-center space-x-2 hover:scale-105 transition-transform">
                <Code className={`${tech.color} text-lg`} />
                <span className="font-semibold text-gray-800 dark:text-gray-200">{tech.name}</span>
              </div>
            ))}
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
            AtmoSense is built using cutting-edge web technologies to ensure optimal performance, 
            scalability, and user experience. The modern tech stack enables real-time data processing 
            and responsive design across all devices.
          </p>
        </div>

        {/* Developer Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 md:p-12 text-white mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Meet the Developer
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <School className="text-blue-200" />
                  <span className="text-lg">Computer Science Student & Full-Stack Developer</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Work className="text-blue-200" />
                  <span className="text-lg">Passionate about Weather Technology & Data Visualization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Code className="text-blue-200" />
                  <span className="text-lg">Specializing in React, Node.js & Modern Web Development</span>
                </div>
              </div>
              
              <p className="text-blue-100 text-lg leading-relaxed mt-6">
                I'm always excited to work on projects that combine technology with real-world applications. 
                AtmoSense represents my commitment to creating useful, beautiful, and performant web applications 
                that make a difference in people's daily lives.
              </p>
            </div>
            
            <div className="text-center lg:text-right">
              <div className="inline-block bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
                <div className="text-4xl md:text-5xl font-bold mb-2">Sachintha Bhashitha</div>
                <div className="text-blue-200 text-lg">Full-Stack Developer</div>
              </div>
              
              {/* Social Links */}
              <div className="flex justify-center lg:justify-end space-x-4">
                <a 
                  href="https://github.com/LEXES7/AtmoSense.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-full p-4 transition-all duration-300 hover:scale-110"
                >
                  <GitHub className="text-2xl group-hover:text-gray-900" />
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/sachintha-bhashitha/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-full p-4 transition-all duration-300 hover:scale-110"
                >
                  <LinkedIn className="text-2xl group-hover:text-blue-600" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Explore the Code & Connect
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Interested in the technical details? Check out the source code on GitHub or connect with me 
            on LinkedIn to discuss this project or potential collaborations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://github.com/LEXES7/AtmoSense.git"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3"
            >
              <GitHub className="text-xl" />
              <span>View on GitHub</span>
              <Launch className="text-lg group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
              href="https://www.linkedin.com/in/sachintha-bhashitha/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3"
            >
              <LinkedIn className="text-xl" />
              <span>Connect on LinkedIn</span>
              <Launch className="text-lg group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Made with ❤️ by Sachintha Bhashitha • © 2024 AtmoSense
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}