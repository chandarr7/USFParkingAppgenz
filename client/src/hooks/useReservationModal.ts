import { useState } from "react";
import { ParkingSpot } from "@/types";

interface ReservationFormData {
  parking_spot_id: number;
  date: string;
  start_time: string;
  duration: number;
  vehicle_type: string;
  license_plate: string;
}

export function useReservationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedParkingSpot, setSelectedParkingSpot] = useState<ParkingSpot | null>(null);
  const [reservationData, setReservationData] = useState<ReservationFormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const onOpen = () => {
    setIsOpen(true);
  };
  
  const onClose = () => {
    setIsOpen(false);
    if (!isEditing) {
      setSelectedParkingSpot(null);
      setReservationData(null);
    }
  };
  
  const openForEdit = (parkingSpot: ParkingSpot, data: ReservationFormData) => {
    setSelectedParkingSpot(parkingSpot);
    setReservationData(data);
    setIsEditing(true);
    setIsOpen(true);
  };
  
  return {
    isOpen,
    selectedParkingSpot,
    reservationData,
    isEditing,
    onOpen,
    onClose,
    openForEdit,
    setSelectedParkingSpot,
    setReservationData,
    setIsEditing
  };
}
