"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Cloud, FolderDown, Globe, Image as ImageIcon, Camera, X } from "lucide-react";
import MediaGallery from "@/components/ui-custom/MediaGallery";

type FileWithPreview = {
    file: File;
    preview: string;
};
export default function ImageCropper() {
    const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files).map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));

            setSelectedFiles((prev) => [...prev, ...filesArray]);
        }
    };

    const handleUpload = () => {
        console.log("Uploading files:", selectedFiles);
        alert(`Uploading ${selectedFiles.length} file(s)`);
    };

    const formatBytes = (bytes: number) => {
        const sizes = ["Bytes", "KB", "MB", "GB"];
        if (bytes === 0) return "0 Bytes";
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Tải ảnh lên</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[1000px] p-0 md:h-auto overflow-hidden" onInteractOutside={(e) => e.preventDefault()}>
                <Tabs defaultValue="upload" className="w-full h-dvh md:h-[700px]">
                    {selectedFiles.length === 0 && (
                        <TabsList className="w-full h-[60px] overflow-auto flex gap-3 justify-start shadow rounded-none px-4">
                            <TabsTrigger className="py-2.5 px-4 flex items-center gap-2" value="upload">
                                <UploadCloud className="w-4 h-4" />
                                <span className="hidden md:flex">Tải lên từ thiết bị</span>
                            </TabsTrigger>
                            <TabsTrigger className="py-2.5 px-4 flex items-center gap-2" value="imagegently">
                                <ImageIcon className="w-4 h-4" />

                                <span className="hidden md:flex">Thư viện hình ảnh</span>
                            </TabsTrigger>
                        </TabsList>
                    )}

                    <div className="h-[calc(100%-60px)] p-4 w-full overflow-y-auto">
                        <TabsContent value="upload" className="w-full h-full my-0">
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
                                <div className="h-full">
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        {selectedFiles.map(({ file, preview }, index) => (
                                            <div
                                                key={preview}
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
                                                        src={preview}
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

                                    {/* <div className="flex justify-end mt-4 h-[60px] items-center">
                                        <Button onClick={handleUpload}>
                                            Upload {selectedFiles.length > 1 ? `(${selectedFiles.length} ảnh)` : ""}
                                        </Button>
                                    </div> */}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="imagegently" className="h-full w-full my-0">
                            <div className="h-full">
                                <MediaGallery />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}