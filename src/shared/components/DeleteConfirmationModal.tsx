import React from "react";
import { CustomAlert } from "./CustomAlert";

interface DeleteConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}

export function DeleteConfirmationModal({
  visible,
  onConfirm,
  onCancel,
  title = "Delete Habit",
  message = "Are you sure you want to delete this habit? This action cannot be undone.",
}: DeleteConfirmationModalProps) {
  return (
    <CustomAlert
      visible={visible}
      title={title}
      message={message}
      onConfirm={onConfirm}
      onCancel={onCancel}
      confirmText="Delete"
      cancelText="Cancel"
      confirmStyle="danger"
    />
  );
}
