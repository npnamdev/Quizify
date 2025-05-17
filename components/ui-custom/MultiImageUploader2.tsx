import React, { useRef, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, X } from "lucide-react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type ImageUpload = {
  file: File;
  previewUrl: string;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  uploadTime: number | null;
};

const MultiImageUploader2 = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [totalUploadTime, setTotalUploadTime] = useState<number | null>(null);
  const [totalProgress, setTotalProgress] = useState(0);

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
    setTotalUploadTime(null);
    setTotalProgress(0);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImageAtIndex = (index: number, newData: Partial<ImageUpload>) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...newData };
      return updated;
    });
  };

  const handleUpload = async () => {
    if (images.length === 0) return;

    setIsUploading(true);
    setTotalUploadTime(null);
    setTotalProgress(0);

    // 1. Set tất cả ảnh thành "uploading" và progress 0 ngay lập tức
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        status: "uploading",
        progress: 0,
        uploadTime: null,
      }))
    );

    const uploadStart = performance.now();

    for (let i = 0; i < images.length; i++) {
      const formData = new FormData();
      formData.append("file", images[i].file);

      const start = performance.now();

      try {
        await axios.post("https://api.wedly.info/api/media", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const total = e.total ?? 1;
            const percent = Math.round((e.loaded * 100) / total);

            updateImageAtIndex(i, { progress: percent });

            // Cập nhật tổng tiến trình trung bình
            setImages((currentImages) => {
              const sumProgress = currentImages.reduce(
                (acc, img) => acc + img.progress,
                0
              );
              setTotalProgress(Math.round(sumProgress / currentImages.length));
              return currentImages;
            });
          },
        });

        const end = performance.now();

        updateImageAtIndex(i, {
          status: "success",
          progress: 100,
          uploadTime: +((end - start) / 1000).toFixed(2),
        });

        // Cập nhật tổng tiến trình trung bình sau khi hoàn thành ảnh này
        setImages((currentImages) => {
          const sumProgress = currentImages.reduce(
            (acc, img) => acc + img.progress,
            0
          );
          setTotalProgress(Math.round(sumProgress / currentImages.length));
          return currentImages;
        });
      } catch (err) {
        updateImageAtIndex(i, {
          status: "error",
          progress: 0,
          uploadTime: null,
        });
      }
    }

    const uploadEnd = performance.now();
    setTotalUploadTime(+((uploadEnd - uploadStart) / 1000).toFixed(2));
    setIsUploading(false);
  };

  return (
    <div className="p-6 space-y-6">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative border rounded overflow-hidden shadow-sm"
          >
            {img.status === "idle" && (
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

            {(img.status === "uploading" || img.status === "error") && (
              <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none"></div>
            )}

            {(img.status === "uploading" || img.status === "error") && (
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none p-4 bg-white bg-opacity-70 rounded">
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={img.progress}
                    text={img.status === "error" ? "Err" : `${img.progress}%`}
                    styles={buildStyles({
                      textColor: img.status === "error" ? "#ef4444" : "#3b82f6",
                      pathColor: img.status === "error" ? "#ef4444" : "#3b82f6",
                      trailColor: "#e5e7eb",
                    })}
                  />
                </div>
              </div>
            )}

            <div className="absolute top-2 right-2">
              {img.status === "success" && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              {img.status === "error" && (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
            </div>

            <div
              className="p-2 bg-gray-50 text-xs text-gray-700 truncate"
              title={img.file.name}
            >
              {img.file.name} — {(img.file.size / 1024).toFixed(1)} KB
            </div>
          </div>
        ))}
      </div>

      {isUploading && (
        <div className="flex items-center space-x-4 mt-4">
          <div style={{ width: 60, height: 60 }}>
            <CircularProgressbar
              value={totalProgress}
              text={`${totalProgress}%`}
              styles={buildStyles({
                textColor: "#3b82f6",
                pathColor: "#3b82f6",
                trailColor: "#e5e7eb",
              })}
            />
          </div>
          <div className="text-gray-700 font-medium">
            Tổng tiến trình upload...
            {totalUploadTime !== null && <span> (Thời gian: {totalUploadTime}s)</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader2;
