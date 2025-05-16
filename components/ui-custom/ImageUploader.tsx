"use client";

import React, { useState, ChangeEvent } from 'react';
import axios, { AxiosProgressEvent } from 'axios';

type UploadStatus = 'Pending' | 'Uploaded' | 'Failed';

export default function ImageUploader() {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [progress, setProgress] = useState<number[]>([]);
    const [status, setStatus] = useState<UploadStatus[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files ? Array.from(e.target.files) : [];
        setFiles(selected);
        setPreviews(selected.map(file => URL.createObjectURL(file)));
        setProgress(selected.map(() => 0));
        setStatus(selected.map(() => 'Pending'));
    };

    const handleUpload = () => {
        files.forEach((file, index) => {
            const formData = new FormData();
            formData.append('file', file);

            axios.post('https://file.io', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (e: AxiosProgressEvent) => {
                    if (e.total) {
                        const percent = Math.round((e.loaded * 100) / e.total);
                        setProgress(prev => {
                            const copy = [...prev];
                            copy[index] = percent;
                            return copy;
                        });
                    }
                }
            }).then(() => {
                setStatus(prev => {
                    const copy = [...prev];
                    copy[index] = 'Uploaded';
                    return copy;
                });
            }).catch(() => {
                setStatus(prev => {
                    const copy = [...prev];
                    copy[index] = 'Failed';
                    return copy;
                });
            });
        });
    };

    return (
        <div className="p-4 max-w-xl mx-auto space-y-4">
            <input type="file" multiple accept="image/*" onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
                {previews.map((src, idx) => (
                    <div key={idx} className="border rounded p-2">
                        <img src={src} className="h-32 object-cover w-full mb-2" alt={`preview-${idx}`} />
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                                style={{ width: `${progress[idx]}%` }}
                            ></div>
                        </div>
                        <p className="text-sm mt-1 text-center">
                            {progress[idx]}% - {status[idx]}
                        </p>
                    </div>
                ))}
            </div>
            {files.length > 0 && (
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleUpload}
                >
                    Upload
                </button>
            )}
        </div>
    );
}
