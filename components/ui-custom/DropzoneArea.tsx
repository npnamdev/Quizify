import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { UploadCloud, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
                        <div className="flex flex-col justify-center items-center">
                            <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-600">Kéo ảnh vào đây hoặc click để chọn nhiều ảnh</p>
                        </div>
                    )}
                </div>
            )}

            {/* Preview cards */}
            {files.length > 0 && (
                <div className="absolute w-full h-full top-0 left-0 bg-white">
                    <div className="h-[60px] border-b bg-grey-300 flex items-center px-5">
                        <Button variant={"outline"} onClick={() => setFiles([])}>
                            Quay lại
                        </Button>
                    </div>
                    <div className="px-5 py-3 h-[calc(100%-125px)] overflow-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                            {files.map((fileWithPreview, index) => (
                                <div
                                    key={index}
                                    className="relative border rounded-md shadow-sm overflow-hidden bg-white"
                                >
                                    <img
                                        src={fileWithPreview.preview}
                                        alt={`preview-${index}`}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="py-2.5 px-3 text-sm">
                                        <p className="text-[13px] font-semibold truncate">{fileWithPreview.file.name}</p>
                                        <p className="text-gray-500 font-semibold text-xs mt-0.5">
                                            {formatBytes(fileWithPreview.file.size)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 bg-white rounded-sm shadow p-1 hover:bg-red-100"
                                        title="Xoá ảnh"
                                    >
                                        <Trash2 className="w-4 h-4 text-grey-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-[65px] border-t bg-grey-300 flex items-center px-5 justify-end">
                        <Button>Tải {files.length} ảnh lên</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DropzoneArea;