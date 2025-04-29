import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ParkingSpot } from "@/types";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReservation, updateReservation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import PaymentModal from "./PaymentModal";

const reservationSchema = z.object({
  parking_spot_id: z.number(),
  date: z.string().min(1, "Date is required"),
  start_time: z.string().min(1, "Start time is required"),
  duration: z.number().min(1, "Duration is required"),
  vehicle_type: z.string().min(1, "Vehicle type is required"),
  license_plate: z.string().min(2, "License plate is required"),
  total_price: z.number(),
});

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  parkingSpot: ParkingSpot | null;
  initialData?: any;
  reservationId?: number;
}

const ReservationModal = ({
  isOpen,
  onClose,
  parkingSpot,
  initialData,
  reservationId
}: ReservationModalProps) => {
  const isEditing = !!reservationId;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [baseRate, setBaseRate] = useState(parkingSpot?.price ?? 0);
  const [duration, setDuration] = useState(4);
  const [serviceFee] = useState(2.00);
  const [totalCost, setTotalCost] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formData, setFormData] = useState<z.infer<typeof reservationSchema> | null>(null);
  
  useEffect(() => {
    if (parkingSpot) {
      setBaseRate(parkingSpot.price);
    }
  }, [parkingSpot]);
  
  useEffect(() => {
    const total = (baseRate * duration) + serviceFee;
    setTotalCost(total);
  }, [baseRate, duration, serviceFee]);
  
  const defaultValues = {
    parking_spot_id: parkingSpot?.id ?? 0,
    date: initialData?.date ?? new Date().toISOString().split('T')[0],
    start_time: initialData?.start_time ?? "10:00",
    duration: initialData?.duration ?? 4,
    vehicle_type: initialData?.vehicle_type ?? "sedan",
    license_plate: initialData?.license_plate ?? "",
    total_price: initialData?.total_price ?? totalCost,
  };
  
  const form = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
    defaultValues,
  });
  
  // Reset form when modal opens with a new parking spot
  useEffect(() => {
    if (isOpen && parkingSpot) {
      const license = initialData?.license_plate || "";
      form.reset({
        ...defaultValues,
        parking_spot_id: parkingSpot.id,
        total_price: totalCost,
        license_plate: license // Ensure license_plate is explicitly set
      });
      
      // Trigger validation if we're in edit mode with existing data
      if (isEditing && license) {
        form.trigger("license_plate");
      }
    }
  }, [isOpen, parkingSpot, totalCost, form, defaultValues, isEditing, initialData]);
  
  // Update duration value in form when it changes
  useEffect(() => {
    form.setValue('duration', duration);
    form.setValue('total_price', totalCost);
  }, [duration, totalCost, form]);
  
  const createMutation = useMutation({
    mutationFn: (data: z.infer<typeof reservationSchema>) => {
      return createReservation({
        ...data,
        user_id: 1, // Using default user id for demo
        status: 'confirmed'
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reservation created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create reservation",
        variant: "destructive",
      });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: z.infer<typeof reservationSchema>) => {
      if (!reservationId) throw new Error("Reservation ID is required");
      return updateReservation(reservationId, {
        ...data,
        user_id: 1, // Using default user id for demo
        status: 'confirmed'
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reservation updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update reservation",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: z.infer<typeof reservationSchema>) => {
    // Make sure license_plate is properly set before submitting
    if (!data.license_plate || data.license_plate.trim() === "") {
      form.setError("license_plate", {
        type: "manual",
        message: "License plate is required"
      });
      return;
    }
    
    data.total_price = totalCost;
    
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      // Store the form data and show payment modal
      setFormData(data);
      setShowPaymentModal(true);
    }
  };
  
  const handlePaymentComplete = () => {
    // Once payment is complete, create the reservation
    if (formData) {
      createMutation.mutate(formData);
    }
    setShowPaymentModal(false);
  };
  
  return (
    <>
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={handlePaymentComplete}
          amount={totalCost}
        />
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Reservation' : 'Add Reservation'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="parking_spot_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parking Location</FormLabel>
                    <FormControl>
                      <div className="bg-neutral-50 p-3 rounded-md">
                        <h4 className="font-medium">{parkingSpot?.name}</h4>
                        <p className="text-sm text-neutral-600">{parkingSpot?.address}, {parkingSpot?.city}</p>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select
                        onValueChange={(value) => setDuration(Number(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="8">8 hours</SelectItem>
                          <SelectItem value="24">Full day (24 hours)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vehicle_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="license_plate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Plate</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your license plate" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          form.setValue('license_plate', e.target.value, { shouldValidate: true });
                        }}
                      />
                    </FormControl>
                    {form.formState.errors.license_plate && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.license_plate.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              
              <div className="bg-neutral-50 p-3 rounded-md mb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-700">Base Rate:</span>
                  <span className="text-neutral-700">${baseRate.toFixed(2)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700">Duration:</span>
                  <span className="text-neutral-700">{duration} {duration === 1 ? 'hour' : 'hours'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-700">Service Fee:</span>
                  <span className="text-neutral-700">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium mt-2 pt-2 border-t border-neutral-200">
                  <span className="text-neutral-800">Total:</span>
                  <span className="text-neutral-800">${totalCost.toFixed(2)}</span>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReservationModal;