import { useState } from "react";

export function useCrud<T>() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<T | null>(null);

  return {
    modalOpen,
    setModalOpen,
    deleteOpen,
    setDeleteOpen,
    selected,
    setSelected,
  };
}
