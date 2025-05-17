"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Cloud, FolderDown, Globe, Image as ImageIcon, Camera, X } from "lucide-react";
import MediaGallery from "@/components/ui-custom/MediaGallery";
import DropzoneArea from "@/components/ui-custom/DropzoneArea";

type FileWithPreview = {
    file: File;
    preview: string;
};
export default function ImageCropper() {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Tải ảnh lên</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[1000px] p-0 md:h-auto overflow-hidden" onInteractOutside={(e) => e.preventDefault()}>
                <Tabs defaultValue="imagegently" className="w-full">
                    <TabsList className="w-full h-[60px] overflow-auto flex gap-3 justify-start shadow rounded-none px-4">
                        <TabsTrigger className="py-2.5 px-4 flex items-center gap-2" value="imagegently">
                            <ImageIcon className="w-4 h-4" /> <span className="hidden md:flex">Thư viện hình ảnh</span>
                        </TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4 flex items-center gap-2" value="upload">
                            <UploadCloud className="w-4 h-4" /> <span className="hidden md:flex">Tải lên từ thiết bị</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="overflow-auto h-[620px]">
                        <TabsContent value="upload" className="h-full w-full my-0">
                            <div className="p-5 h-full">
                                <DropzoneArea />
                            </div>
                        </TabsContent>

                        <TabsContent value="imagegently" className="h-full w-full my-0">
                            <div className="px-6 py-5">
                                <MediaGallery />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}