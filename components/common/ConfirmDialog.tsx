"use client";

import { ReactNode, useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

type ConfirmDialogProps = {
    trigger: ReactNode;
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm: () => void;
};

export default function ConfirmDialog({ trigger, title, description, cancelText = "Cancel", confirmText = "Continue", onConfirm }: ConfirmDialogProps) {
    const [loading, setLoading] = useState(false);
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction disabled={loading} onClick={onConfirm}>{confirmText}</AlertDialogAction>
                    {/* <AlertDialogAction onClick={handleConfirm} disabled={loading}>
                        {loading ? "Đang xử lý..." : confirmText}
                    </AlertDialogAction> */}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// cách sử dụng
