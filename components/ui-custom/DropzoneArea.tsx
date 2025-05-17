import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";
import { UploadCloud, Trash2, Edit3, X, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { formatBytes, getCroppedFile } from "@/utils/utils";

type FileStatus = "idle" | "uploading" | "success" | "error";

type FileWithPreview = {
    file: File;
    preview: string;
    progress: number;
    status: FileStatus;
};

function DropzoneArea() {
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [cropMode, setCropMode] = useState(false);
    const [cropIndex, setCropIndex] = useState<number | null>(null);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [aspectRatio, setAspectRatio] = useState<number | null>(4 / 3);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const mappedFiles: FileWithPreview[] = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            status: "idle",
        }));

        setFiles((prev) => {
            const total = prev.length + mappedFiles.length;
            if (total > 12) {
                toast.error("Chỉ được chọn tối đa 12 ảnh");
                const allowedToAdd = 12 - prev.length;
                if (allowedToAdd <= 0) return prev;
                return [...prev, ...mappedFiles.slice(0, allowedToAdd)];
            }
            return [...prev, ...mappedFiles];
        });
    }, []);

    const removeFile = (index: number) => {
        setFiles((prev) => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: true,
    });

    const onCropComplete = (_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const startCrop = (index: number) => {
        setCropIndex(index);
        setCropMode(true);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setAspectRatio(4 / 3);
    };

    const applyCrop = async () => {
        if (cropIndex === null || !croppedAreaPixels) return;
        const fileWithPreview = files[cropIndex];
        const cropped = await getCroppedFile(fileWithPreview.preview, croppedAreaPixels, fileWithPreview.file);

        const croppedFile: FileWithPreview = {
            file: cropped.file,
            preview: cropped.preview,
            progress: 0,
            status: "idle",
        };

        setFiles((prev) => {
            const newFiles = [...prev];
            URL.revokeObjectURL(newFiles[cropIndex].preview);
            newFiles[cropIndex] = croppedFile;
            return newFiles;
        });

        setCropMode(false);
        setCropIndex(null);
    };

    const cancelCrop = () => {
        setCropMode(false);
        setCropIndex(null);
    };

    const handleUpload = async () => {
        for (let i = 0; i < files.length; i++) {
            setFiles((prev) => {
                const updated = [...prev];
                updated[i].status = "uploading";
                updated[i].progress = 0;
                return [...updated];
            });

            const formData = new FormData();
            formData.append("media", files[i].file);

            try {
                await axios.post("https://api.wedly.info/api/media", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                        setFiles((prev) => {
                            const updated = [...prev];
                            updated[i].progress = percent;
                            return [...updated];
                        });
                    },
                });

                setFiles((prev) => {
                    const updated = [...prev];
                    updated[i].status = "success";
                    return [...updated];
                });
            } catch (error) {
                setFiles((prev) => {
                    const updated = [...prev];
                    updated[i].status = "error";
                    return [...updated];
                });
                toast.error(`Tải ảnh ${files[i].file.name} thất bại!`);
                console.error(error);
            }
        }

        toast.success("Tải ảnh lên hoàn tất!");
        files.forEach((f) => URL.revokeObjectURL(f.preview));
    };

    return (
        <div className="w-full h-full">
            {files.length === 0 && (
                <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition w-full h-full flex items-center justify-center"
                >
                    <input {...getInputProps()} style={{ display: "none" }} />
                    {isDragActive ? (
                        <p className="text-blue-500">Thả ảnh vào đây...</p>
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-600">Kéo ảnh vào đây hoặc click để chọn nhiều ảnh</p>
                        </div>
                    )}
                </div>
            )}

            {files.length > 0 && !cropMode && (
                <div className="absolute w-full h-full top-0 left-0 bg-white">
                    <div className="h-[60px] border-b bg-grey-300 flex items-center px-5">
                        <Button
                            variant="outline"
                            onClick={() => {
                                files.forEach((f) => URL.revokeObjectURL(f.preview));
                                setFiles([]);
                            }}
                        >
                            Quay lại
                        </Button>
                    </div>

                    <div className="px-5 py-3 h-[calc(100%-125px)] overflow-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                            {files.map((fileWithPreview, index) => (
                                <div key={index} className="relative border rounded-md shadow-sm overflow-hidden bg-white">
                                    <div className="relative">
                                        <img src={fileWithPreview.preview} alt={`preview-${index}`} className="w-full h-40 object-cover" />
                                        {fileWithPreview.status === "uploading" && (
                                            <div className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full p-1 shadow">
                                                <CircularProgressbar
                                                    value={fileWithPreview.progress}
                                                    text={`${fileWithPreview.progress}%`}
                                                    styles={buildStyles({
                                                        pathColor: "#3b82f6",
                                                        textSize: "28px",
                                                        textColor: "#000",
                                                    })}
                                                />
                                            </div>
                                        )}
                                        {fileWithPreview.status === "success" && (
                                            <CheckCircle2 className="absolute top-2 right-2 text-green-500 w-6 h-6 bg-white rounded-full shadow p-1" />
                                        )}
                                        {fileWithPreview.status === "error" && (
                                            <XCircle className="absolute top-2 right-2 text-red-500 w-6 h-6 bg-white rounded-full shadow p-1" />
                                        )}
                                    </div>
                                    <div className="py-2.5 px-3 text-sm flex justify-between items-center">
                                        <div>
                                            <p className="text-[13px] font-semibold truncate">{fileWithPreview.file.name}</p>
                                            <p className="text-gray-500 font-semibold text-xs mt-0.5">
                                                {formatBytes(fileWithPreview.file.size)}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => startCrop(index)}
                                                className="bg-white rounded-sm shadow p-1 hover:bg-blue-100"
                                                title="Chỉnh sửa ảnh"
                                            >
                                                <Edit3 className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="bg-white rounded-sm shadow p-1 hover:bg-red-100"
                                                title="Xoá ảnh"
                                            >
                                                <Trash2 className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-[65px] border-t bg-grey-300 flex items-center px-5 justify-end">
                        <Button onClick={handleUpload}>Tải {files.length} ảnh lên</Button>
                    </div>
                </div>
            )}

            {cropMode && cropIndex !== null && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex flex-col z-50">
                    <div className="flex justify-between items-center p-4 bg-white border-b">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Tỉ lệ:</span>
                            <Select
                                value={aspectRatio !== null ? aspectRatio.toString() : "free"}
                                onValueChange={(value) => {
                                    if (value === "free") setAspectRatio(null);
                                    else setAspectRatio(parseFloat(value));
                                }}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Chọn tỉ lệ" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={(1 / 1).toString()}>1:1</SelectItem>
                                    <SelectItem value={(4 / 3).toString()}>4:3</SelectItem>
                                    <SelectItem value={(16 / 9).toString()}>16:9</SelectItem>
                                    <SelectItem value="free">Tự do</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <button onClick={cancelCrop} className="p-1 rounded hover:bg-gray-100" title="Huỷ">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="relative flex-1">
                        <Cropper
                            image={files[cropIndex].preview}
                            crop={crop}
                            zoom={zoom}
                            {...(aspectRatio ? { aspect: aspectRatio } : {})}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>

                    <div className="p-4 bg-white flex items-center space-x-4">
                        <label className="text-sm font-medium">Phóng to:</label>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1"
                        />
                        <Button onClick={applyCrop}>Áp dụng</Button>
                        <Button variant="outline" onClick={cancelCrop}>Huỷ</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DropzoneArea;