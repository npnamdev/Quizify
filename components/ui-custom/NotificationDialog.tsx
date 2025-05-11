import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react"
import moment from "moment"
import "moment/locale/vi"

moment.locale("vi") // Thiết lập ngôn ngữ tiếng Việt

const notifications = [
    {
        type: "info",
        message: "Hệ thống sẽ bảo trì lúc 22:00.",
        date: "2025-05-11T13:10:00Z",
    },
    {
        type: "success",
        message: "Bạn đã đăng ký khóa học thành công.",
        date: "2025-05-11T07:10:00Z",
    },
    {
        type: "warning",
        message: "Mật khẩu của bạn sắp hết hạn.",
        date: "2025-05-10T14:10:00Z",
    },
    {
        type: "error",
        message: "Không thể kết nối đến máy chủ.",
        date: "2025-04-11T10:10:00Z",
    },
    {
        type: "info",
        message: "Hệ thống sẽ bảo trì lúc 22:00.",
        date: "2025-05-11T13:10:00Z",
    },
    {
        type: "success",
        message: "Bạn đã đăng ký khóa học thành công.",
        date: "2025-05-11T07:10:00Z",
    },
    {
        type: "warning",
        message: "Mật khẩu của bạn sắp hết hạn.",
        date: "2025-05-10T14:10:00Z",
    },
    {
        type: "error",
        message: "Không thể kết nối đến máy chủ.",
        date: "2025-04-11T10:10:00Z",
    },
    {
        type: "info",
        message: "Hệ thống sẽ bảo trì lúc 22:00.",
        date: "2025-05-11T13:10:00Z",
    },
    {
        type: "success",
        message: "Bạn đã đăng ký khóa học thành công.",
        date: "2025-05-11T07:10:00Z",
    },
    {
        type: "warning",
        message: "Mật khẩu của bạn sắp hết hạn.",
        date: "2025-05-10T14:10:00Z",
    },
    {
        type: "error",
        message: "Không thể kết nối đến máy chủ.",
        date: "2025-04-11T10:10:00Z",
    },
    {
        type: "info",
        message: "Hệ thống sẽ bảo trì lúc 22:00.",
        date: "2025-05-11T13:10:00Z",
    },
    {
        type: "success",
        message: "Bạn đã đăng ký khóa học thành công.",
        date: "2025-05-11T07:10:00Z",
    },
    {
        type: "warning",
        message: "Mật khẩu của bạn sắp hết hạn.",
        date: "2025-05-10T14:10:00Z",
    },
    {
        type: "error",
        message: "Không thể kết nối đến máy chủ.",
        date: "2025-04-11T10:10:00Z",
    },
]

const iconMap = {
    info: <Info className="text-blue-500" />,
    success: <CheckCircle className="text-green-500" />,
    warning: <AlertTriangle className="text-yellow-500" />,
    error: <XCircle className="text-red-500" />,
}

function formatRelativeTime(dateStr: string) {
    return moment(dateStr).fromNow()
}

export default function NotificationDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Mở thông báo</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl flex flex-col items-start p-0 gap-0">
                <DialogHeader className="border-b w-full h-[60px] justify-center px-6">
                    <DialogTitle className="text-md font-bold">Thông báo</DialogTitle>
                </DialogHeader>

                <div className="h-[calc(100dvh-60px)] lg:h-[400px] w-full px-4 overflow-auto select-none py-4 flex flex-col gap-2.5">
                    {notifications.map((noti, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 py-2.5 px-3 border rounded-md shadow-sm"
                        >
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                                {iconMap[noti.type as keyof typeof iconMap]}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{noti.message}</p>
                                <p className="text-sm text-gray-500 mt-1">{formatRelativeTime(noti.date)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <DialogFooter className="flex sm:justify-center border-t w-full h-[60px] items-center px-4">
                   <div className="flex items-center h-full justify-end w-full gap-2">
                        <DialogClose asChild>
                            <Button variant="outline">Đóng thông báo</Button>
                        </DialogClose>
                    </div>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}