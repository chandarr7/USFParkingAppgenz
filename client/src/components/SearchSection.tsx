import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar } from "lucide-react";
import { SearchParams } from "@/types";

const searchSchema = z.object({
  location: z.string().min(1, "Location is required"),
  date: z.string().min(1, "Date is required"),
  radius: z.string().min(1, "Search radius is required")
});

interface SearchSectionProps {
  onSearch: (data: SearchParams) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const form = useForm<SearchParams>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      location: "",
      date: today,
      radius: "1"
    }
  });
  
  const handleSubmit = (data: SearchParams) => {
    onSearch(data);
  };
  
  return (
    <section className="mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-medium text-neutral-800">Find Parking Near You</h2>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                            <Input 
                              placeholder="Enter address, city or zipcode" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                            <Input 
                              type="date" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormField
                    control={form.control}
                    name="radius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search Radius</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select radius" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0.5">0.5 miles</SelectItem>
                            <SelectItem value="1">1 mile</SelectItem>
                            <SelectItem value="2">2 miles</SelectItem>
                            <SelectItem value="5">5 miles</SelectItem>
                            <SelectItem value="10">10 miles</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-1 md:col-span-4 flex justify-end mt-2">
                  <Button type="submit" className="bg-primary hover:bg-primary-dark">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default SearchSection;