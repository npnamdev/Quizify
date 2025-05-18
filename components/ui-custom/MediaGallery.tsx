import React, { useEffect, useState } from "react";
import axios from "axios";

type MediaItem = {
    _id: string;
    secure_url: string;
    original_filename: string;
    format: string;
    bytes: number;
};

const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MediaGallery = () => {
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await axios.get("https://api.wedly.info/api/media?limit=50");
                setMediaList(res.data.data);
            } catch (err) {
                setError("Không thể tải danh sách ảnh.");
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    return (
        <div className="">
            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mediaList.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden border"
                    >
                        <img
                            src={item.secure_url}
                            alt={item.original_filename}
                            className="w-full h-[145px] object-contain object-center bg-gray-100"
                        />
                        <div className="px-4 py-2 text-sm border-t">
                            <p className="font-semibold truncate">
                                {item.original_filename}
                            </p>
                            <p className="text-gray-500 mt-0.5">{formatBytes(item.bytes)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MediaGallery;