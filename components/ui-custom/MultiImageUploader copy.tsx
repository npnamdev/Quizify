"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { CheckCircle, XCircle, X } from "lucide-react";

type ImageUpload = {
  file: File;
  previewUrl: string;
  progress: number; // 0-100
  status: "idle" | "uploading" | "success" | "error";
};

const MultiImageUploader = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Tổng progress (0-100) tính trung bình tất cả ảnh upload đang active
  const [totalProgress, setTotalProgress] = useState(0);

  // Tổng thời gian upload (giây)
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageUpload[] = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "idle",
    }));

    setImages((prev) => [...prev, ...newImages]);
    setTotalProgress(0);
    setTotalTime(0);
  };

  // Bắt đầu đếm thời gian upload
  const startTimer = useCallback(() => {
    setTotalTime(0);
    timerRef.current = setInterval(() => {
      setTotalTime((time) => time + 1);
    }, 1000);
  }, []);

  // Dừng đếm thời gian upload
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleUpload = async () => {
    setIsUploading(true);

    // Đặt trạng thái upload cho tất cả ảnh idle
    const newState = images.map((img) => ({
      ...img,
      status: img.status === "idle" ? "uploading" : img.status,
      progress: img.status === "idle" ? 0 : img.progress,
    }));
    setImages(newState);
    setTotalProgress(0);
    setTotalTime(0);
    startTimer();

    for (let i = 0; i < newState.length; i++) {
      const image = newState[i];
      if (image.status !== "uploading") continue;

      const formData = new FormData();
      formData.append("file", image.file);

      try {
        await axios.post("https://api.wedly.info/api/media", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / (e.total || 1));
            newState[i].progress = percent;
            setImages([...newState]);

            // Tính tổng progress trung bình
            const totalPercent = newState.reduce((acc, img) => acc + img.progress, 0);
            setTotalProgress(Math.round(totalPercent / newState.length));
          },
        });

        newState[i].status = "success";
        newState[i].progress = 100;
        setImages([...newState]);

        // Cập nhật lại tổng progress mỗi lần một ảnh xong
        const totalPercent = newState.reduce((acc, img) => acc + img.progress, 0);
        setTotalProgress(Math.round(totalPercent / newState.length));
      } catch (err) {
        newState[i].status = "error";
        setImages([...newState]);
      }
    }

    stopTimer();
    setIsUploading(false);
  };

  const handleRemoveImage = (index: number) => {
    if (isUploading) return;
    setImages((prev) => {
      const newArr = [...prev];
      URL.revokeObjectURL(newArr[index].previewUrl);
      newArr.splice(index, 1);
      return newArr;
    });
    setTotalProgress(0);
    setTotalTime(0);
  };

  const radius = 30;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (totalProgress / 100) * circumference;

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      {/* Chọn file và upload */}
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

      {/* Tổng progress vòng tròn + thời gian */}
      {images.length > 0 && (
        <div className="flex items-center space-x-4">
          <svg
            height={radius * 2}
            width={radius * 2}
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
              stroke="#3b82f6"
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
          </svg>
          <div className="text-gray-700 font-semibold">
            {isUploading
              ? `Đang upload... ${totalProgress}%`
              : totalProgress === 100
              ? `Upload hoàn thành trong ${totalTime}s`
              : "Chưa upload"}
          </div>
        </div>
      )}

      {/* Hiển thị ảnh */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative border rounded overflow-hidden shadow-sm"
          >
            {/* Nút xóa */}
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

            {/* Overlay khi đang upload */}
            {(isUploading && img.status !== "success") && (
              <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none"></div>
            )}

            {/* Biểu tượng trạng thái */}
            <div className="absolute top-2 right-2">
              {img.status === "success" && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              {img.status === "error" && (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              {img.status === "uploading" && (
                <div className="text-white font-bold text-sm px-2 py-1 bg-blue-600 rounded">
                  {img.progress}%
                </div>
              )}
            </div>

            {/* Tên file */}
            <div className="p-2 bg-gray-50 text-xs text-gray-700 truncate" title={img.file.name}>
              {img.file.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiImageUploader;
