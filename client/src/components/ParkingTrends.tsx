import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, MapPin } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ParkingTrends = () => {
  // Sample weekly parking data
  const weeklyData = [
    { day: 'Mon', availability: 75 },
    { day: 'Tue', availability: 68 },
    { day: 'Wed', availability: 60 },
    { day: 'Thu', availability: 55 },
    { day: 'Fri', availability: 42 },
    { day: 'Sat', availability: 70 },
    { day: 'Sun', availability: 85 },
  ];
  
  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Parking Trends & Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Stat Card 1 */}
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full p-3 mr-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-neutral-500 text-sm font-medium">Average Parking Cost</h3>
                  <p className="text-2xl font-semibold text-neutral-800">$8.25/hr</p>
                  <p className="text-xs text-neutral-500 flex items-center">
                    <span className="text-green-500 mr-1">↑</span>
                    5% increase from last month
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stat Card 2 */}
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="flex items-center">
                <div className="bg-amber-500/10 rounded-full p-3 mr-4">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-neutral-500 text-sm font-medium">Peak Hours</h3>
                  <p className="text-2xl font-semibold text-neutral-800">12 PM - 2 PM</p>
                  <p className="text-xs text-neutral-500 flex items-center">
                    <span className="text-red-500 mr-1">↓</span>
                    10% less availability during peak
                  </p>
                </div>
              </div>
            </div>
            
            {/* Stat Card 3 */}
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="flex items-center">
                <div className="bg-green-500/10 rounded-full p-3 mr-4">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-neutral-500 text-sm font-medium">Popular Areas</h3>
                  <p className="text-2xl font-semibold text-neutral-800">Downtown</p>
                  <p className="text-xs text-neutral-500 flex items-center">
                    <span className="text-amber-500 mr-1">★</span>
                    Highest rated locations
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <h3 className="text-neutral-700 text-base font-medium mb-2">Weekly Parking Availability</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAvailability" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3f51b5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" />
                  <YAxis 
                    label={{ 
                      value: 'Availability %', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }} 
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="availability" 
                    stroke="#3f51b5" 
                    fillOpacity={1} 
                    fill="url(#colorAvailability)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ParkingTrends;
