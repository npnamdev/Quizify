import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
            <DialogContent className="sm:max-w-md h-dvh">
                <DialogHeader className="h-[60px]">
                    <DialogTitle>Thông báo</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 sm:max-h-[800px] overflow-y-auto h-[calc(100%-120px)]">
                    {notifications.map((noti, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 py-2.5 p-3 border rounded-md shadow-sm"
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

                <DialogFooter className="h-[60px]">
                    <Button type="button">Đã hiểu</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}