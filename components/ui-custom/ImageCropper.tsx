"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    UploadCloud,
    Cloud,
    FolderDown,
    Globe,
    Image as ImageIcon,
    Camera,
    X,
} from "lucide-react";

export default function ImageCropper() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            setSelectedFiles((prev) => [...prev, ...filesArray]);
        }
    };

    const handleUpload = () => {
        console.log("Uploading files:", selectedFiles);
        alert(`Uploading ${selectedFiles.length} file(s)`);
        // TODO: Implement real upload logic
    };

    const formatBytes = (bytes: number) => {
        const sizes = ["Bytes", "KB", "MB", "GB"];
        if (bytes === 0) return "0 Bytes";
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Tải ảnh lên</Button>
            </DialogTrigger>

            <DialogContent className="w-full sm:max-w-[1000px] p-0 h-dvh md:h-auto overflow-hidden">
                <Tabs defaultValue="upload" className="w-full h-full">
                    <TabsList className="w-full h-[60px] overflow-x-auto flex gap-3 justify-start shadow rounded-none px-4">
                        <TabsTrigger className="py-2.5 px-4 flex items-center gap-2" value="upload">
                            <UploadCloud className="w-4 h-4" />
                            Từ thiết bị
                        </TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4 flex items-center gap-2" value="url">
                            <Cloud className="w-4 h-4" />
                            Từ URL
                        </TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4 flex items-center gap-2" value="googledrive">
                            <FolderDown className="w-4 h-4" />
                            Google Drive
                        </TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4 flex items-center gap-2" value="unsplash">
                            <Globe className="w-4 h-4" />
                            Unsplash
                        </TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4 flex items-center gap-2" value="imagegently">
                            <ImageIcon className="w-4 h-4" />
                            ImageGently
                        </TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4 flex items-center gap-2" value="camera">
                            <Camera className="w-4 h-4" />
                            Máy ảnh
                        </TabsTrigger>
                    </TabsList>

                    <div className="h-full md:h-[640px] p-4 overflow-y-auto">
                        <TabsContent value="upload" className="h-full mt-0">
                            {selectedFiles.length === 0 && (
                                <label
                                    htmlFor="file-upload"
                                    className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer hover:border-blue-500 transition-colors rounded-md"
                                >
                                    <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                                    <span className="text-gray-600">Nhấn hoặc kéo ảnh vào đây để tải lên</span>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            )}

                            {selectedFiles.length > 0 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        {selectedFiles.map((file, index) => (
                                            <div
                                                key={index}
                                                className="relative border rounded-lg overflow-hidden shadow-sm bg-white"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFile(index)}
                                                    className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-10"
                                                    aria-label="Xóa ảnh"
                                                >
                                                    <X className="w-4 h-4 text-gray-600" />
                                                </button>

                                                <div className="relative w-full h-40">
                                                    <Image
                                                        src={URL.createObjectURL(file)}
                                                        alt={`selected-${index}`}
                                                        fill
                                                        style={{ objectFit: "cover" }}
                                                    />
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <Button onClick={handleUpload}>
                                            Upload {selectedFiles.length > 1 ? `(${selectedFiles.length} ảnh)` : ""}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="url" className="h-full mt-0">
                            <p>Nhập URL của ảnh để tải lên.</p>
                        </TabsContent>

                        <TabsContent value="googledrive" className="h-full mt-0">
                            <p>Tích hợp Google Drive hoặc chọn file.</p>
                        </TabsContent>

                        <TabsContent value="unsplash" className="h-full mt-0">
                            <p>Duyệt và chọn ảnh từ Unsplash.</p>
                        </TabsContent>

                        <TabsContent value="imagegently" className="h-full mt-0">
                            <p>Tìm kiếm hoặc chọn ảnh từ ImageGently.</p>
                        </TabsContent>

                        <TabsContent value="camera" className="h-full mt-0">
                            <p>Chụp ảnh bằng máy ảnh thiết bị.</p>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}