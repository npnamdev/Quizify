import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ImageCropper() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Upload file</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[900px] p-0 h-dvh md:h-auto overflow-hidden">
                <Tabs defaultValue="upload" className="w-full h-full">
                    <TabsList className="w-full h-[60px] overflow-x-auto flex gap-3 justify-start shadow rounded-none px-4">
                        <TabsTrigger className="py-2.5 px-4" value="upload">Upload from device</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="imagegently">ImageGently</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="unsplash">Unsplash</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="camera">Camera</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="url">Upload from URL</TabsTrigger>
                        <TabsTrigger className="py-2.5 px-4" value="googledrive">Google Drive</TabsTrigger>
                    </TabsList>

                    <div className="h-full md:h-[560px] p-4">
                        <TabsContent value="upload" className="h-full mt-0">
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
                        <TabsContent value="imagegently" className="h-full mt-0">
                            <p>ImageGently image selection or search content goes here.</p>
                        </TabsContent>

                        <TabsContent value="unsplash" className="h-full mt-0">
                            <p>Browse and select images from Unsplash here.</p>
                        </TabsContent>

                        <TabsContent value="camera" className="h-full mt-0">
                            <p>Camera access and capture functionality here.</p>
                        </TabsContent>

                        <TabsContent value="url" className="h-full mt-0">
                            <p>Enter the URL of an image to upload here.</p>
                        </TabsContent>

                        <TabsContent value="googledrive" className="h-full mt-0">
                            <p>Google Drive integration or file picker goes here.</p>
                        </TabsContent>
                    </div>

                </Tabs>

            </DialogContent>
        </Dialog>
    )
}
