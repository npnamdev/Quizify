import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ImageCropper() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Upload file</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[900px] p-0">
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="w-full h-[60px] overflow-x-auto">
                        <TabsTrigger className="py-2.5 px-4" value="upload">Upload from device</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="imagegently">ImageGently</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="unsplash">Unsplash</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="camera">Camera</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="url">Upload from URL</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="googledrive">Google Drive</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="dragdrop">Drag & Drop</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="min-h-[500px]">
                        <p>Form upload image from your device will go here.</p>
                    </TabsContent>
                    
                    <TabsContent value="upload" className="min-h-[550px] h-[550px] flex items-center justify-center p-4 mt-0">
                        <label
                            htmlFor="file-upload"
                            className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer hover:border-blue-500 transition-colors rounded-md"
                        >
                            <span className="text-gray-600">Click or drag image here to upload</span>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                            />
                        </label>
                    </TabsContent>

                    <TabsContent value="imagegently" className="min-h-[500px]">
                        <p>ImageGently image selection or search content goes here.</p>
                    </TabsContent>

                    <TabsContent value="unsplash" className="min-h-[500px]">
                        <p>Browse and select images from Unsplash here.</p>
                    </TabsContent>

                    <TabsContent value="camera" className="min-h-[500px]">
                        <p>Camera access and capture functionality here.</p>
                    </TabsContent>

                    <TabsContent value="url" className="min-h-[500px]">
                        {/* Form nhập URL ảnh */}
                        <p>Enter the URL of an image to upload here.</p>
                    </TabsContent>

                    <TabsContent value="googledrive" className="min-h-[500px]">
                        {/* Kết nối API Google Drive hoặc chọn file */}
                        <p>Google Drive integration or file picker goes here.</p>
                    </TabsContent>

                    <TabsContent value="dragdrop" className="min-h-[500px]">
                        {/* Khu vực kéo thả ảnh */}
                        <p>Drag and drop your images here to upload.</p>
                    </TabsContent>
                </Tabs>

            </DialogContent>
        </Dialog>
    )
}
