import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle, Info, AlertTriangle, XCircle } from "lucide-react"
import moment from "moment"
import "moment/locale/vi"

moment.locale("vi")

const notifications = [
    {
        type: "info",
        message: "Hệ thống sẽ bảo trì định kỳ vào 23:00 ngày 15/05.",
        date: "2025-05-11T13:10:00Z",
        isRead: true,
    },
    {
        type: "success",
        message: "Khóa học 'Lập trình Python cơ bản' đã được tạo thành công.",
        date: "2025-05-11T07:10:00Z",
        isRead: false,
    },
    {
        type: "warning",
        message: "Dung lượng máy chủ sắp đầy. Vui lòng kiểm tra.",
        date: "2025-05-10T14:10:00Z",
        isRead: false,
    },
    {
        type: "error",
        message: "Lỗi kết nối đến máy chủ sao lưu dữ liệu.",
        date: "2025-05-09T08:20:00Z",
        isRead: true,
    },
    {
        type: "info",
        message: "Có 12 học viên chưa hoàn thành khóa học đúng hạn.",
        date: "2025-05-08T10:00:00Z",
        isRead: true,
    },
    {
        type: "success",
        message: "Đã thêm quản trị viên mới: Nguyễn Văn A.",
        date: "2025-05-07T17:35:00Z",
        isRead: false,
    },
    {
        type: "warning",
        message: "Một số bài giảng chưa có nội dung video.",
        date: "2025-05-06T09:45:00Z",
        isRead: true,
    },
    {
        type: "error",
        message: "Hệ thống ghi nhận lỗi thanh toán từ cổng VNPAY.",
        date: "2025-05-05T13:30:00Z",
        isRead: false,
    },
    {
        type: "info",
        message: "Đã cập nhật giao diện người dùng cho trang dashboard.",
        date: "2025-05-04T15:20:00Z",
        isRead: false,
    },
    {
        type: "success",
        message: "Tất cả bài kiểm tra cuối kỳ đã được chấm điểm tự động.",
        date: "2025-05-03T10:00:00Z",
        isRead: true,
    },
    {
        type: "warning",
        message: "Một số học viên sử dụng email không hợp lệ.",
        date: "2025-05-02T16:40:00Z",
        isRead: false,
    },
    {
        type: "error",
        message: "Không thể gửi thông báo đến 24 học viên.",
        date: "2025-05-01T07:55:00Z",
        isRead: true,
    },
    {
        type: "info",
        message: "Hệ thống đã ghi nhận 350 lượt truy cập hôm nay.",
        date: "2025-04-30T14:15:00Z",
        isRead: true,
    },
    {
        type: "success",
        message: "Toàn bộ cơ sở dữ liệu đã được sao lưu thành công.",
        date: "2025-04-29T11:25:00Z",
        isRead: false,
    },
    {
        type: "warning",
        message: "Một số quản trị viên chưa cập nhật mật khẩu hơn 90 ngày.",
        date: "2025-04-28T17:05:00Z",
        isRead: false,
    },
    {
        type: "error",
        message: "Có lỗi trong quá trình xử lý dữ liệu học viên.",
        date: "2025-04-27T13:10:00Z",
        isRead: true,
    },
    {
        type: "info",
        message: "Đã thêm module báo cáo thống kê học viên.",
        date: "2025-04-26T08:00:00Z",
        isRead: true,
    },
    {
        type: "success",
        message: "Tính năng gửi email tự động đã được bật.",
        date: "2025-04-25T19:00:00Z",
        isRead: false,
    },
    {
        type: "warning",
        message: "Hệ thống ghi nhận đăng nhập bất thường từ nước ngoài.",
        date: "2025-04-24T22:45:00Z",
        isRead: false,
    },
    {
        type: "error",
        message: "Không thể truy cập vào thư viện nội dung số.",
        date: "2025-04-23T06:30:00Z",
        isRead: true,
    },
]

function formatRelativeTime(dateStr: string) {
    return moment(dateStr).fromNow()
}

export default function NotificationDialog() {
    const getIconByType = (type: string) => {
        switch (type) {
            case "info":
                return <Info className="text-blue-500" />
            case "success":
                return <CheckCircle className="text-green-500" />
            case "warning":
                return <AlertTriangle className="text-yellow-500" />
            case "error":
                return <XCircle className="text-red-500" />
            default:
                return null
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Mở thông báo</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl flex flex-col items-start p-0 gap-0">
                <DialogHeader className="border-b w-full h-[60px] justify-center px-6">
                    <DialogTitle className="text-md font-bold">Thông báo</DialogTitle>
                </DialogHeader>

                <div className="h-[calc(100dvh-60px)] lg:h-[400px] w-full px-5 overflow-auto select-none py-4 flex flex-col gap-2.5">
                    {notifications.map((noti, index) => (
                        <div
                            key={index}
                            className="relative flex items-center gap-4 py-2.5 px-3 border rounded-md shadow-sm"
                        >
                            {/* Dot if unread */}
                            {!noti.isRead && (
                                <span className="absolute right-4 w-2.5 h-2.5 bg-red-500 rounded-full" />
                            )}
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 shrink-0">
                                {getIconByType(noti.type)}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{noti.message}</p>
                                <p className="text-sm text-gray-500 mt-1">{formatRelativeTime(noti.date)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}