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
  errorMsg?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 10;
const MAX_CONCURRENT_UPLOADS = 8;

const MultiImageUploader = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [totalUploadTime, setTotalUploadTime] = useState<number | null>(null);
  const [totalProgress, setTotalProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Filter by size and limit max files
    const filteredFiles = Array.from(files)
      .filter((file) => file.size <= MAX_FILE_SIZE)
      .slice(0, MAX_FILES - images.length);

    const newImages: ImageUpload[] = filteredFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      status: "idle",
      uploadTime: null,
    }));

    setImages((prev) => [...prev, ...newImages]);
    setTotalUploadTime(null);
    setTotalProgress(0);

    // Reset input to allow re-upload same files if needed
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, newData: Partial<ImageUpload>) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...newData };
      return copy;
    });
  };

  const handleUpload = async () => {
    setIsUploading(true);
    setTotalUploadTime(null);
    setTotalProgress(0);

    const uploadStart = performance.now();

    // Limit concurrent uploads
    let currentIndex = 0;
    let activeUploads = 0;

    return new Promise<void>((resolve) => {
      const uploadNext = () => {
        if (currentIndex >= images.length && activeUploads === 0) {
          // All done
          const uploadEnd = performance.now();
          setTotalUploadTime(+((uploadEnd - uploadStart) / 1000).toFixed(2));
          setIsUploading(false);
          resolve();
          return;
        }

        while (activeUploads < MAX_CONCURRENT_UPLOADS && currentIndex < images.length) {
          const i = currentIndex;
          currentIndex++;
          activeUploads++;

          updateImage(i, { status: "uploading", progress: 0 });

          const formData = new FormData();
          formData.append("file", images[i].file);

          const start = performance.now();

          axios.post("https://api.wedly.info/api/media", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (e) => {
              const percent = Math.round((e.loaded * 100) / (e.total || 1));
              updateImage(i, { progress: percent });

              setImages((imgs) => {
                const total = imgs.reduce((acc, img) => acc + img.progress, 0);
                setTotalProgress(Math.round(total / imgs.length));
                return imgs;
              });
            },
          })
            .then(() => {
              const end = performance.now();
              updateImage(i, {
                status: "success",
                progress: 100,
                uploadTime: +((end - start) / 1000).toFixed(2),
                errorMsg: undefined,
              });
            })
            .catch((error) => {
              updateImage(i, {
                status: "error",
                progress: 0,
                uploadTime: null,
                errorMsg: error?.message || "Upload failed",
              });
            })
            .finally(() => {
              activeUploads--;
              uploadNext();
            });
        }
      };

      uploadNext();
    });
  };

  const handleRetry = (index: number) => {
    if (isUploading) return;
    updateImage(index, { status: "idle", progress: 0, errorMsg: undefined });
    handleUpload();
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
          disabled={isUploading || images.length >= MAX_FILES}
          title={images.length >= MAX_FILES ? `Bạn đã đạt tối đa ${MAX_FILES} ảnh.` : undefined}
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
                disabled={isUploading}
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
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-2">
                {img.status === "uploading" && (
                  <div className="w-16 h-16">
                    <CircularProgressbar
                      value={img.progress}
                      text={`${img.progress}%`}
                      styles={buildStyles({
                        pathColor: "#3b82f6",
                        textColor: "#fff",
                        trailColor: "rgba(255,255,255,0.2)",
                      })}
                    />
                  </div>
                )}
                {img.status === "error" && (
                  <>
                    <XCircle size={32} />
                    <p className="text-xs mt-2 text-center">{img.errorMsg}</p>
                    <button
                      type="button"
                      onClick={() => handleRetry(index)}
                      disabled={isUploading}
                      className="mt-2 px-3 py-1 bg-yellow-400 text-black rounded"
                    >
                      Thử lại
                    </button>
                  </>
                )}
              </div>
            )}

            {img.status === "success" && (
              <div className="absolute top-1 left-1 text-green-500">
                <CheckCircle size={20} />
              </div>
            )}

            {img.status === "success" && img.uploadTime !== null && (
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-xs px-1 rounded text-white">
                {img.uploadTime}s
              </div>
            )}

            <div
              className="p-2 bg-gray-50 text-xs text-gray-700 truncate"
              title={img.file.name}
            >
              {img.file.name} — {(img.file.size / 1024).toFixed(1)} KB
            </div>
          </div>
        ))}
      </div>

      {totalUploadTime !== null && (
        <div className="mt-4 text-center text-green-700 font-semibold">
          Tổng thời gian upload: {totalUploadTime}s
        </div>
      )}

      {images.length >= MAX_FILES && (
        <div className="mt-2 text-red-600 font-semibold">
          Bạn đã đạt tối đa {MAX_FILES} ảnh.
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader;
