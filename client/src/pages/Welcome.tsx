import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { LineChart, BarChart3, MapPin, ChevronRight, Clock, Calendar, Car, Database, Layout, BarChart, PenTool } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Welcome Page Header with Navigation */}
      <div className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center space-y-8">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-[#006747] mr-3" />
              <h1 className="text-4xl font-bold text-[#006747]">USFParkingApp</h1>
            </div>
            
            <div className="flex flex-wrap justify-center gap-10 text-lg font-medium border-t border-b border-gray-200 py-4 w-full max-w-2xl">
              <Link href="/" className="text-[#006747] border-b-2 border-[#006747] py-2 px-3 transform hover:scale-105 transition-all">Welcome</Link>
              <Link href="/home" className="text-gray-600 hover:text-[#006747] hover:border-b-2 hover:border-[#006747] py-2 px-3 transition-all">Home</Link>
              <Link href="/visualizations" className="text-gray-600 hover:text-[#006747] hover:border-b-2 hover:border-[#006747] py-2 px-3 transition-all">Visualizations</Link>
              <Link href="/about" className="text-gray-600 hover:text-[#006747] hover:border-b-2 hover:border-[#006747] py-2 px-3 transition-all">About</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section with background image */}
      <div className="relative flex flex-col items-center justify-center text-center py-28 px-4 bg-[#006747] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
        <div className="absolute inset-0 bg-[url('/parking-background.jpg')] bg-cover bg-center opacity-40 z-0"></div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#006747]/30 to-[#006747]/70 z-5"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto">
          <div className="animate-fadeIn">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-md">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                USFParkingApp
              </span>
            </h1>
            <p className="text-xl mb-10 leading-relaxed max-w-3xl mx-auto text-white/90">
              This prototype web application is designed to help students, faculty, and staff view available 
              parking spaces across campus in real time. While real-time data integration is a 
              future enhancement, this version presents the foundational structure for CRUD operations 
              and data display.
            </p>
            
            <Link href="/visualizations">
              <Button className="group bg-white hover:bg-white/90 text-[#006747] px-7 py-6 text-lg font-medium shadow-xl rounded-full transition-all duration-300 transform hover:scale-105">
                <span>Explore Visualizations</span>
                <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-12 left-10 w-16 h-16 border-t-2 border-l-2 border-white/20 z-10"></div>
        <div className="absolute bottom-12 right-10 w-16 h-16 border-b-2 border-r-2 border-white/20 z-10"></div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#006747] mb-16">
            🚗 Key Features (Planned)
            <div className="mt-2 mx-auto w-24 h-1 bg-[#006747]/30 rounded-full"></div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white rounded-xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-2">
              <div className="text-3xl mb-4">📶</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Live updates on parking availability</h3>
              <p className="text-gray-600">Real-time information about available parking spots in each lot across campus.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-2">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Parking lot zones and names</h3>
              <p className="text-gray-600">Clear identification of different parking areas with interactive map visualization.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-2">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Data visualization for parking trends</h3>
              <p className="text-gray-600">Advanced analytics to help understand peak hours and plan parking accordingly.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 transition-transform duration-300 hover:-translate-y-2">
              <div className="text-3xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Admin dashboard for managing lot info</h3>
              <p className="text-gray-600">Administrative tools to update parking spot availability and manage lot information.</p>
            </div>
          </div>
          
          {/* Additional Features Section */}
          <div className="mt-16 bg-[#F8FBF9] rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-[#006747] mb-8">Additional Benefits</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-[#D9F2EA] p-2 rounded-full mr-4">
                  <Clock className="h-5 w-5 text-[#006747]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Time Saving</h4>
                  <p className="text-gray-600 mt-1">Reduce time spent searching for available parking spots.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#D9F2EA] p-2 rounded-full mr-4">
                  <Calendar className="h-5 w-5 text-[#006747]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Advanced Planning</h4>
                  <p className="text-gray-600 mt-1">Book parking spots in advance for important events and meetings.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#D9F2EA] p-2 rounded-full mr-4">
                  <Car className="h-5 w-5 text-[#006747]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Reduced Congestion</h4>
                  <p className="text-gray-600 mt-1">Better parking distribution results in less traffic congestion.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-[#D9F2EA] p-2 rounded-full mr-4">
                  <BarChart3 className="h-5 w-5 text-[#006747]" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800">Usage Statistics</h4>
                  <p className="text-gray-600 mt-1">Access historical data on parking space utilization patterns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Welcome;