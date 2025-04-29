import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { useToast } from '@/hooks/use-toast';
import { capacityDataSchema, usageDataSchema, trendDataSchema } from '@/types/visualization';
import type { CapacityData, UsageData, TrendData } from '@/types/visualization';

// Sample data for visualizations with id property added
const initialCapacityData: CapacityData[] = [
  { id: 1, name: 'Collins Garage', capacity: 200, available: 75 },
  { id: 2, name: 'Laurel Drive', capacity: 150, available: 32 },
  { id: 3, name: 'Crescent Hill', capacity: 180, available: 120 },
  { id: 4, name: 'Leroy Collins', capacity: 250, available: 90 },
  { id: 5, name: 'Sun Dome', capacity: 300, available: 210 },
];

const initialUsageByTypeData: UsageData[] = [
  { id: 1, name: 'Students', value: 65 },
  { id: 2, name: 'Faculty', value: 25 },
  { id: 3, name: 'Visitors', value: 10 },
];

const initialAvailabilityTrendData: TrendData[] = [
  { id: 1, time: '8am', available: 180 },
  { id: 2, time: '10am', available: 120 },
  { id: 3, time: '12pm', available: 60 },
  { id: 4, time: '2pm', available: 80 },
  { id: 5, time: '4pm', available: 100 },
  { id: 6, time: '6pm', available: 150 },
];

// COLORS for the charts
const COLORS = ['#006747', '#D9F2EA', '#404040', '#8884d8', '#83a6ed'];
const CHART_GREEN = '#006747';

const Visualizations = () => {
  const [capacityData, setCapacityData] = useState<CapacityData[]>(initialCapacityData);
  const [usageByTypeData, setUsageByTypeData] = useState<UsageData[]>(initialUsageByTypeData);
  const [availabilityTrendData, setAvailabilityTrendData] = useState<TrendData[]>(initialAvailabilityTrendData);
  const { toast } = useToast();
  
  // Define column configurations for DataTable
  const capacityColumns = [
    { id: 'name', header: 'Parking Lot', accessorKey: 'name', sortable: true },
    { id: 'capacity', header: 'Capacity', accessorKey: 'capacity', sortable: true },
    { id: 'available', header: 'Available', accessorKey: 'available', sortable: true },
    { 
      id: 'percentage', 
      header: 'Percentage Available', 
      accessorKey: (row: CapacityData) => {
        const percent = Math.round((row.available / row.capacity) * 100);
        return `${percent}%`;
      },
      sortable: true 
    },
  ];
  
  const usageColumns = [
    { id: 'name', header: 'User Type', accessorKey: 'name', sortable: true },
    { id: 'value', header: 'Percentage', accessorKey: (row: UsageData) => `${row.value}%`, sortable: true },
  ];
  
  const trendColumns = [
    { id: 'time', header: 'Time', accessorKey: 'time', sortable: true },
    { id: 'available', header: 'Available Spaces', accessorKey: 'available', sortable: true },
  ];
  
  // CRUD Handlers for Capacity Data
  const handleAddCapacity = async (data: Omit<CapacityData, 'id'>) => {
    // In a real app, this would be an API call
    const newItem = {
      ...data,
      id: capacityData.length > 0 ? Math.max(...capacityData.map(item => item.id ?? 0)) + 1 : 1
    };
    setCapacityData([...capacityData, newItem]);
    return Promise.resolve();
  };
  
  const handleUpdateCapacity = async (id: number, data: Partial<CapacityData>) => {
    setCapacityData(capacityData.map(item => 
      item.id === id ? { ...item, ...data } : item
    ));
    return Promise.resolve();
  };
  
  const handleDeleteCapacity = async (id: number) => {
    setCapacityData(capacityData.filter(item => item.id !== id));
    return Promise.resolve();
  };
  
  // CRUD Handlers for Usage Data
  const handleAddUsage = async (data: Omit<UsageData, 'id'>) => {
    const newItem = {
      ...data,
      id: usageByTypeData.length > 0 ? Math.max(...usageByTypeData.map(item => item.id ?? 0)) + 1 : 1
    };
    setUsageByTypeData([...usageByTypeData, newItem]);
    return Promise.resolve();
  };
  
  const handleUpdateUsage = async (id: number, data: Partial<UsageData>) => {
    // Ensure all percentages sum to 100% (optional business rule)
    const currentTotal = usageByTypeData.reduce((sum, item) => sum + item.value, 0);
    const updatedItem = usageByTypeData.find(item => item.id === id);
    const newValue = data.value ?? updatedItem?.value ?? 0;
    const oldValue = updatedItem?.value ?? 0;
    const totalAfterUpdate = currentTotal - oldValue + newValue;
    
    if (totalAfterUpdate > 100) {
      toast({
        title: "Invalid Update",
        description: "Total percentage cannot exceed 100%",
        variant: "destructive"
      });
      return Promise.reject(new Error("Total percentage cannot exceed 100%"));
    }
    
    setUsageByTypeData(usageByTypeData.map(item => 
      item.id === id ? { ...item, ...data } : item
    ));
    return Promise.resolve();
  };
  
  const handleDeleteUsage = async (id: number) => {
    setUsageByTypeData(usageByTypeData.filter(item => item.id !== id));
    return Promise.resolve();
  };
  
  // CRUD Handlers for Trend Data
  const handleAddTrend = async (data: Omit<TrendData, 'id'>) => {
    // Check if time already exists
    if (availabilityTrendData.some(item => item.time === data.time)) {
      toast({
        title: "Duplicate Entry",
        description: `Time '${data.time}' already exists in the dataset`,
        variant: "destructive"
      });
      return Promise.reject(new Error(`Time '${data.time}' already exists`));
    }
    
    const newItem = {
      ...data,
      id: availabilityTrendData.length > 0 ? Math.max(...availabilityTrendData.map(item => item.id ?? 0)) + 1 : 1
    };
    setAvailabilityTrendData([...availabilityTrendData, newItem]);
    return Promise.resolve();
  };
  
  const handleUpdateTrend = async (id: number, data: Partial<TrendData>) => {
    // Check if updated time conflicts with existing times
    if (data.time) {
      const exists = availabilityTrendData.some(item => item.time === data.time && item.id !== id);
      if (exists) {
        toast({
          title: "Duplicate Entry",
          description: `Time '${data.time}' already exists in the dataset`,
          variant: "destructive"
        });
        return Promise.reject(new Error(`Time '${data.time}' already exists`));
      }
    }
    
    setAvailabilityTrendData(availabilityTrendData.map(item => 
      item.id === id ? { ...item, ...data } : item
    ));
    return Promise.resolve();
  };
  
  const handleDeleteTrend = async (id: number) => {
    setAvailabilityTrendData(availabilityTrendData.filter(item => item.id !== id));
    return Promise.resolve();
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#006747] mb-4">Parking Data Visualizations</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            This page provides an overview of parking trends and usage across the campus using dynamic visualizations. 
            The interactive charts below display parking lot capacity vs. availability, usage distribution among 
            students, faculty, and visitors, and how availability changes throughout the day.
          </p>
        </div>
        
        <div className="mb-8">
          <Tabs defaultValue="capacity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="capacity">Capacity vs. Availability</TabsTrigger>
              <TabsTrigger value="usage">Usage by Type</TabsTrigger>
              <TabsTrigger value="trend">Availability Trend</TabsTrigger>
            </TabsList>
            
            {/* Capacity vs. Availability Tab */}
            <TabsContent value="capacity">
              <Card>
                <CardHeader>
                  <CardTitle>Capacity vs. Availability</CardTitle>
                  <CardDescription>
                    Comparing total capacity and available spaces across parking lots
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={capacityData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="capacity" name="Total Capacity" fill={CHART_GREEN} />
                        <Bar dataKey="available" name="Available Spaces" fill="#D9F2EA" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <DataTable
                      data={capacityData}
                      columns={capacityColumns}
                      title="Parking Capacity Data"
                      schema={capacityDataSchema}
                      onAdd={handleAddCapacity}
                      onUpdate={handleUpdateCapacity}
                      onDelete={handleDeleteCapacity}
                      emptyMessage="No parking capacity data available. Add your first entry!"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Usage by Type Tab */}
            <TabsContent value="usage">
              <Card>
                <CardHeader>
                  <CardTitle>Usage by Type</CardTitle>
                  <CardDescription>
                    Distribution of parking usage among students, faculty, and visitors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={usageByTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {usageByTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <DataTable
                      data={usageByTypeData}
                      columns={usageColumns}
                      title="Parking Usage Data"
                      schema={usageDataSchema}
                      onAdd={handleAddUsage}
                      onUpdate={handleUpdateUsage}
                      onDelete={handleDeleteUsage}
                      emptyMessage="No usage data available. Add your first entry!"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Availability Trend Tab */}
            <TabsContent value="trend">
              <Card>
                <CardHeader>
                  <CardTitle>Availability Trend</CardTitle>
                  <CardDescription>
                    How parking availability changes throughout the day
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={availabilityTrendData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="available" 
                          name="Available Spaces" 
                          stroke={CHART_GREEN} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <DataTable
                      data={availabilityTrendData}
                      columns={trendColumns}
                      title="Time Trend Data"
                      schema={trendDataSchema}
                      onAdd={handleAddTrend}
                      onUpdate={handleUpdateTrend}
                      onDelete={handleDeleteTrend}
                      emptyMessage="No trend data available. Add your first entry!"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Visualizations;