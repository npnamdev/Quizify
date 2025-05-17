"use client";

import React, { useRef, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, X } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho từng ảnh tải lên
type ImageUpload = {
    file: File; // File gốc
    previewUrl: string; // Đường dẫn xem trước ảnh
    progress: number; // Tiến trình tải (tính theo %)
    status: "idle" | "uploading" | "success" | "error"; // Trạng thái tải ảnh
    uploadTime: number | null; // Thời gian tải lên từng ảnh (tính bằng giây)
};

const MultiImageUploader = () => {
    const inputRef = useRef<HTMLInputElement>(null); // Tham chiếu input file
    const [images, setImages] = useState<ImageUpload[]>([]); // Danh sách ảnh tải lên
    const [isUploading, setIsUploading] = useState(false); // Trạng thái đang tải
    const [totalUploadTime, setTotalUploadTime] = useState<number | null>(null); // Tổng thời gian tải tất cả ảnh
    const [totalProgress, setTotalProgress] = useState(0); // Tổng tiến trình tải của tất cả ảnh

    // Hàm xử lý khi người dùng chọn ảnh
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: ImageUpload[] = Array.from(files).map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file), // Tạo URL xem trước
            progress: 0,
            status: "idle",
            uploadTime: null,
        }));

        // Thêm ảnh mới vào danh sách
        setImages((prev) => [...prev, ...newImages]);
        setTotalUploadTime(null);
        setTotalProgress(0);
    };

    // Xoá một ảnh khỏi danh sách
    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    // Hàm xử lý upload ảnh
    const handleUpload = async () => {
        setIsUploading(true);
        setTotalUploadTime(null);
        setTotalProgress(0);

        const newState = [...images];
        const uploadStart = performance.now(); // Ghi nhận thời điểm bắt đầu upload

        for (let i = 0; i < newState.length; i++) {
            const image = newState[i];
            const formData = new FormData();
            formData.append("file", image.file);

            // Cập nhật trạng thái và tiến trình
            image.status = "uploading";
            image.progress = 0;
            setImages([...newState]);

            const start = performance.now(); // Ghi nhận thời gian bắt đầu upload ảnh

            try {
                // Gửi ảnh lên server
                await axios.post("https://api.wedly.info/api/media", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (e) => {
                        const percent = Math.round((e.loaded * 100) / (e.total || 1));
                        newState[i].progress = percent;
                        setImages([...newState]);

                        // Tính tiến trình tổng thể
                        const totalProgressSum = newState.reduce(
                            (acc, img) => acc + img.progress,
                            0
                        );
                        setTotalProgress(Math.round(totalProgressSum / newState.length));
                    },
                });

                // Thành công
                const end = performance.now();
                image.status = "success";
                image.uploadTime = +((end - start) / 1000).toFixed(2);
                image.progress = 100;
                setImages([...newState]);

                // Cập nhật tiến trình tổng thể
                const totalProgressSum = newState.reduce(
                    (acc, img) => acc + img.progress,
                    0
                );
                setTotalProgress(Math.round(totalProgressSum / newState.length));
            } catch (err) {
                // Gặp lỗi
                image.status = "error";
                image.uploadTime = null;
                image.progress = 0;
                setImages([...newState]);
            }
        }

        // Ghi nhận tổng thời gian tải lên
        const uploadEnd = performance.now();
        setTotalUploadTime(+((uploadEnd - uploadStart) / 1000).toFixed(2));
        setIsUploading(false);
    };

    // Các biến để tính toán cho vòng tròn tiến trình cá nhân và tổng thể
    const radius = 30;
    const stroke = 4;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const radiusTotal = 30;
    const strokeTotal = 4;
    const normalizedRadiusTotal = radiusTotal - strokeTotal / 2;
    const circumferenceTotal = normalizedRadiusTotal * 2 * Math.PI;
    const offsetTotal =
        circumferenceTotal - (totalProgress / 100) * circumferenceTotal;

    return (
        <div className="p-6 space-y-6">
            {/* Nút chọn ảnh và upload */}
            <div className="space-x-2">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                />
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                >
                    Chọn ảnh
                </button>
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    onClick={handleUpload}
                    disabled={images.length === 0 || isUploading}
                >
                    Upload
                </button>
            </div>

            {/* Danh sách ảnh hiển thị */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, index) => {
                    const strokeDashoffset =
                        circumference - (img.progress / 100) * circumference;

                    return (
                        <div
                            key={index}
                            className="relative border rounded overflow-hidden shadow-sm"
                        >
                            {/* Nút xóa ảnh */}
                            {!isUploading && img.status === "idle" && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 z-10 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-1"
                                    aria-label="Xóa ảnh"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            {/* Ảnh preview */}
                            <img
                                src={img.previewUrl}
                                alt={`preview-${index}`}
                                className={`w-full h-40 object-cover transition-opacity duration-300 ${
                                    img.status === "success"
                                        ? "opacity-100"
                                        : img.status === "uploading" || img.status === "error"
                                        ? "opacity-50"
                                        : "opacity-100"
                                }`}
                            />

                            {/* Lớp phủ khi đang tải */}
                            {isUploading && img.status !== "success" && (
                                <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none"></div>
                            )}

                            {/* Vòng tròn tiến trình */}
                            {img.status !== "success" && (
                                <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                                    <svg height={radius * 2} width={radius * 2}>
                                        <circle
                                            stroke="#e5e7eb"
                                            fill="transparent"
                                            strokeWidth={stroke}
                                            r={normalizedRadius}
                                            cx={radius}
                                            cy={radius}
                                        />
                                        <circle
                                            stroke={img.status === "error" ? "#ef4444" : "#3b82f6"}
                                            fill="transparent"
                                            strokeWidth={stroke}
                                            strokeDasharray={`${circumference} ${circumference}`}
                                            strokeDashoffset={strokeDashoffset}
                                            strokeLinecap="round"
                                            r={normalizedRadius}
                                            cx={radius}
                                            cy={radius}
                                            style={{ transition: "stroke-dashoffset 0.3s ease" }}
                                        />
                                        <text
                                            x="50%"
                                            y="50%"
                                            dominantBaseline="middle"
                                            textAnchor="middle"
                                            fontSize="12"
                                            fill={img.status === "error" ? "#ef4444" : "#3b82f6"}
                                        >
                                            {img.status === "error"
                                                ? "Err"
                                                : `${img.progress}%`}
                                        </text>
                                    </svg>
                                </div>
                            )}

                            {/* Icon trạng thái (thành công hoặc lỗi) */}
                            <div className="absolute top-2 right-2">
                                {img.status === "success" && (
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                )}
                                {img.status === "error" && (
                                    <XCircle className="w-6 h-6 text-red-500" />
                                )}
                            </div>

                            {/* Tên ảnh và dung lượng */}
                            <div
                                className="p-2 bg-gray-50 text-xs text-gray-700 truncate"
                                title={img.file.name}
                            >
                                {img.file.name} — {(img.file.size / 1024).toFixed(1)} KB
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Vòng tròn tiến trình tổng thể */}
            {isUploading && (
                <div className="flex items-center space-x-4 mt-4">
                    <svg
                        height={radiusTotal * 2}
                        width={radiusTotal * 2}
                        className="transform -rotate-90"
                    >
                        <circle
                            stroke="#e5e7eb"
                            fill="transparent"
                            strokeWidth={strokeTotal}
                            r={normalizedRadiusTotal}
                            cx={radiusTotal}
                            cy={radiusTotal}
                        />
                        <circle
                            stroke="#3b82f6"
                            fill="transparent"
                            strokeWidth={strokeTotal}
                            strokeDasharray={`${circumferenceTotal} ${circumferenceTotal}`}
                            strokeDashoffset={offsetTotal}
                            strokeLinecap="round"
                            r={normalizedRadiusTotal}
                            cx={radiusTotal}
                            cy={radiusTotal}
                            style={{ transition: "stroke-dashoffset 0.3s ease" }}
                        />
                        <text
                            x="50%"
                            y="50%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize="14"
                            fill="#3b82f6"
                        >
                            {totalProgress}%
                        </text>
                    </svg>
                    <div className="text-gray-700 font-medium">
                        Tổng tiến trình upload...
                        {totalUploadTime !== null && (
                            <span> (Thời gian: {totalUploadTime}s)</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiImageUploader;
