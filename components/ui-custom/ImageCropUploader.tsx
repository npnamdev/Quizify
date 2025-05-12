"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ImageCropUploader = () => {
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Hàm giúp cắt ảnh
    const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
            img.src = imageSrc;
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return canvas.toDataURL("image/jpeg");
    };

    const handleCrop = async () => {
        if (!image || !croppedAreaPixels) return;
        const cropped = await getCroppedImg(image, croppedAreaPixels);
        setCroppedImage(cropped);
    };

    // Hàm gọi API để upload ảnh đã cắt
    const handleUpload = async () => {
        if (!croppedImage) return;

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: croppedImage }), // Gửi ảnh base64
            });

            const result = await response.json();
            if (result.success) {
                console.log("Upload success:", result);
            } else {
                console.error("Upload failed:", result.message);
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button>Open</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Crop Image</DialogTitle>
                </DialogHeader>

                <input type="file" accept="image/*" onChange={handleFileChange} />

                {image && (
                    <div className="relative w-full h-[300px] mt-4">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                )}

                {image && (
                    <Button onClick={handleCrop} className="mt-4">
                        Lưu
                    </Button>
                )}

                {croppedImage && (
                    <div className="mt-4">
                        <p className="mb-2">Ảnh đã cắt:</p>
                        <img src={croppedImage} alt="Cropped" className="max-w-full h-auto" />
                        <Button onClick={handleUpload} className="mt-2 ml-2">
                            Upload
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ImageCropUploader;
