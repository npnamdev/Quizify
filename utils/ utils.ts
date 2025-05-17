export function formatBytes(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export async function getCroppedFile(
    imageSrc: string,
    croppedAreaPixels: any,
    originalFile: File
): Promise<{ file: File; preview: string; progress: number }> {
    const createImage = (url: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.setAttribute("crossOrigin", "anonymous");
            image.src = url;
        });

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Không lấy được context canvas");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                resolve({ file: originalFile, preview: imageSrc, progress: 0 });
                return;
            }
            const newFile = new File([blob], originalFile.name, { type: "image/jpeg" });
            const newPreview = URL.createObjectURL(newFile);
            resolve({ file: newFile, preview: newPreview, progress: 0 });
        }, "image/jpeg");
    });
}