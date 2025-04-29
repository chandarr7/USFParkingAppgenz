import { useState } from "react";

export function useDeleteModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
  
  const open = (id: number, confirmCallback: () => void) => {
    setReservationId(id);
    setOnConfirm(() => confirmCallback);
    setIsOpen(true);
  };
  
  const onClose = () => {
    setIsOpen(false);
    setReservationId(null);
    setOnConfirm(null);
  };
  
  const onConfirmDelete = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };
  
  return {
    isOpen,
    reservationId,
    open,
    onClose,
    onConfirmDelete
  };
}
