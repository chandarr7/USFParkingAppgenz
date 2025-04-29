import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReservations, deleteReservation } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash, Plus } from "lucide-react";
import { format } from "date-fns";
import { EnrichedReservation, ParkingSpot } from "@/types";
import { useReservationModal } from "@/hooks/useReservationModal";
import { useDeleteModal } from "@/hooks/useDeleteModal";
import ReservationModal from "@/components/ReservationModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

const MyReservations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedReservation, setSelectedReservation] = useState<EnrichedReservation | null>(null);
  
  const {
    isOpen: isReservationModalOpen,
    onOpen: openReservationModal,
    onClose: closeReservationModal,
    setSelectedParkingSpot,
    setReservationData,
    selectedParkingSpot,
    reservationData,
    setIsEditing
  } = useReservationModal();
  
  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    onClose: closeDeleteModal,
    onConfirmDelete
  } = useDeleteModal();
  
  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['/api/reservations'],
    queryFn: () => fetchReservations(1) // Using user ID 1 for demo
  });
  
  const deleteMutation = useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reservation deleted successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/reservations'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete reservation",
        variant: "destructive",
      });
    }
  });
  
  const handleAddReservation = () => {
    setIsEditing(false);
    openReservationModal();
  };
  
  const handleEditReservation = (reservation: EnrichedReservation) => {
    setSelectedReservation(reservation);
    setSelectedParkingSpot(reservation.parkingSpot);
    setReservationData({
      parking_spot_id: reservation.parking_spot_id,
      date: format(new Date(reservation.date), 'yyyy-MM-dd'),
      start_time: reservation.start_time,
      duration: reservation.duration,
      vehicle_type: reservation.vehicle_type,
      license_plate: reservation.license_plate,
      total_price: reservation.total_price
    });
    setIsEditing(true);
    openReservationModal();
  };
  
  const handleDeleteReservation = (id: number) => {
    openDeleteModal(id, () => {
      deleteMutation.mutate(id);
    });
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      <section className="mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-medium">My Reservations</CardTitle>
            <Button 
              onClick={handleAddReservation}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Reservation
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(2).fill(0).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-5 w-40" />
                          <Skeleton className="h-4 w-32 mt-1" />
                        </TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      </TableRow>
                    ))
                  ) : reservations.length > 0 ? (
                    reservations.map((reservation) => (
                      <TableRow key={reservation.id} className="hover:bg-neutral-50">
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium text-neutral-800">
                              {reservation.parkingSpot.name}
                            </div>
                            <div className="text-xs text-neutral-500">
                              {reservation.parkingSpot.address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-neutral-700">
                          {format(new Date(reservation.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-neutral-700">
                          {reservation.start_time} - {/* Calculate end time based on duration */}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-neutral-700">
                          ${reservation.total_price.toFixed(2)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(reservation.status)}`}>
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleEditReservation(reservation)}
                              className="text-primary hover:text-primary-dark hover:bg-primary/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleDeleteReservation(reservation.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                        No reservations found. Click "Add Reservation" to create one.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <ReservationModal
        isOpen={isReservationModalOpen}
        onClose={closeReservationModal}
        parkingSpot={selectedParkingSpot}
        initialData={reservationData}
        reservationId={selectedReservation?.id}
      />
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={onConfirmDelete}
      />
    </>
  );
};

export default MyReservations;
