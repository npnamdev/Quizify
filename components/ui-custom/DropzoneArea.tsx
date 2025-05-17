import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";

type FileWithPreview = {
    file: File;
    preview: string;
};

function formatBytes(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function DropzoneArea() {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const mappedFiles: FileWithPreview[] = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setFiles((prev) => [...prev, ...mappedFiles]);
    }, []);

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [],
        },
        multiple: true,
    });

    return (
        <div className="w-full h-full">
            {/* Dropzone Area */}
            {files.length === 0 && (
                <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition w-full h-full flex items-center justify-center"
                >
                    <input {...getInputProps()} style={{ display: "none" }} className="h-full" />
                    {isDragActive ? (
                        <p className="text-blue-500">Thả ảnh vào đây...</p>
                    ) : (
                        <p className="text-gray-600">Kéo ảnh vào đây hoặc click để chọn nhiều ảnh</p>
                    )}
                </div>
            )}

            {/* Preview cards */}
            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                    {files.map((fileWithPreview, index) => (
                        <div
                            key={index}
                            className="relative border rounded shadow-sm overflow-hidden bg-white"
                        >
                            <img
                                src={fileWithPreview.preview}
                                alt={`preview-${index}`}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-3 text-sm">
                                <p className="font-medium truncate">{fileWithPreview.file.name}</p>
                                <p className="text-gray-500 text-xs">
                                    {formatBytes(fileWithPreview.file.size)}
                                </p>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-white rounded-full shadow p-1 text-xs hover:bg-red-100"
                                title="Xoá ảnh"
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DropzoneArea;