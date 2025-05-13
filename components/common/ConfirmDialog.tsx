"use client";

import { ReactNode, useState } from "react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "react-day-picker";

type ConfirmDialogProps = {
    title: string;
    description: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm: () => void;
};

export default function ConfirmDialog({ title, description, cancelText = "Cancel", confirmText = "Continue", onConfirm }: ConfirmDialogProps) {
    const [loading, setLoading] = useState(false);
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>Xóa tài khoản</Button>
            </AlertDialogTrigger>
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
