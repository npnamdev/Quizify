"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

type ImageUpload = {
    file: File;
    previewUrl: string;
    progress: number;
    status: "idle" | "uploading" | "success" | "error";
    uploadTime: number | null;
};

const MultiImageUploader = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<ImageUpload[]>([]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: ImageUpload[] = Array.from(files).map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            progress: 0,
            status: "idle",
            uploadTime: null,
        }));

        setImages((prev) => [...prev, ...newImages]);
    };

    const handleUpload = async () => {
        const newState = [...images];

        for (let i = 0; i < newState.length; i++) {
            const image = newState[i];
            const formData = new FormData();
            formData.append("file", image.file);

            image.status = "uploading";
            setImages([...newState]);

            const start = performance.now();

            try {
                await axios.post("https://api.wedly.info/api/media", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (e) => {
                        const percent = Math.round((e.loaded * 100) / (e.total || 1));
                        newState[i].progress = percent;
                        setImages([...newState]);
                    },
                });

                const end = performance.now();
                image.status = "success";
                image.uploadTime = +((end - start) / 1000).toFixed(2);
                setImages([...newState]);
            } catch (err) {
                image.status = "error";
                image.uploadTime = null;
                setImages([...newState]);
            }
        }
    };

    const renderProgress = (img: ImageUpload) => {
        const radius = 24;
        const stroke = 4;
        const normalizedRadius = radius - stroke / 2;
        const circumference = normalizedRadius * 2 * Math.PI;
        const offset = circumference - (img.progress / 100) * circumference;

        return (
            <div className="absolute top-2 right-2">
                <svg
                    width={radius * 2}
                    height={radius * 2}
                    className="transform -rotate-90"
                >
                    <circle
                        stroke="#e5e7eb"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke={
                            img.status === "error"
                                ? "#ef4444"
                                : img.status === "success"
                                    ? "#10b981"
                                    : "#3b82f6"
                        }
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        style={{ transition: "stroke-dashoffset 0.3s ease" }}
                    />
                </svg>

                {/* Icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {img.status === "success" && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {img.status === "error" && (
                        <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {img.status === "uploading" && (
                        <span className="text-xs font-medium text-blue-600">
                            {img.progress}%
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 space-y-4">
            {/* Chọn file */}
            <div className="space-x-2">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => inputRef.current?.click()}
                >
                    Chọn ảnh
                </button>
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    onClick={handleUpload}
                    disabled={images.length === 0}
                >
                    Upload
                </button>
            </div>

            {/* Preview ảnh */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="relative border rounded overflow-hidden shadow-sm"
                    >
                        <img
                            src={img.previewUrl}
                            alt={`preview-${index}`}
                            className="w-full h-40 object-cover"
                        />
                        {img.status !== "idle" && renderProgress(img)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MultiImageUploader;
