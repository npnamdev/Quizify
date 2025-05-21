import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function CreateQuestionDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-full h-dvh sm::rounded-0 shadow-none border-none p-0 m-0 gap-0">
                <DialogHeader className="px-7 border-b h-[60px] flex justify-center ">
                    <DialogTitle>TIêu dề</DialogTitle>
                </DialogHeader>
                <div className="h-[calc(100dvh-60px)] grid grid-cols-[250px_1fr]">
                    <div className="border-r bg-gray-100">
                        sidebar left
                    </div>
                    <div className="">
                        content
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
