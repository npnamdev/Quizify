import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, User, Mail, BadgeCheck, X, Fingerprint, ShieldCheck, HeartPulse, CalendarClock, Activity } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | number | null;
}

interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data: T;
}

export default function UserDetailsModal({ open, onOpenChange, userId }: UserDetailsModalProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open || !userId) {
      setUser(null);
      return;
    }

    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const res: ApiResponse<UserData> = await axiosInstance.get(`/api/users/${userId}`);

        if (res.status !== "success") {
          toast.error(`Lấy thông tin người dùng thất bại: ${res.message}`);
          setUser(null);
        } else {
          const userData = res.data;
          setUser({
            _id: userData._id,
            username: userData.username,
            fullName: userData.fullName,
            email: userData.email,
            isVerified: userData.isVerified,
            gender: userData.gender,
            role: {
              name: userData.role.name,
            },
            isActive: userData.isActive,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
          });
        }
      } catch (error: any) {
        toast.error(`Lỗi khi lấy thông tin người dùng: ${error.message || error}`);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [open, userId]);

  const handleClose = () => {
    if (isLoading) return;
    onOpenChange(false);
  };

  const infoList = user
    ? [
      { label: "ID", value: user._id, icon: <Fingerprint className="w-4 h-4 text-muted-foreground" /> },
      { label: "Tên đăng nhập", value: user.username, icon: <User className="w-4 h-4 text-muted-foreground" /> },
      { label: "Họ tên", value: user.fullName, icon: <User className="w-4 h-4 text-muted-foreground" /> },
      { label: "Email", value: user.email, icon: <Mail className="w-4 h-4 text-muted-foreground" /> },
      {
        label: "Đã xác minh",
        value: user.isVerified ? (
          <span className="flex items-center gap-1 text-green-600 font-medium">
            <BadgeCheck className="w-4 h-4" /> Xác minh
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-600 font-medium">
            <X className="w-4 h-4" /> Chưa xác minh
          </span>
        ),
        icon: <ShieldCheck className="w-4 h-4 text-muted-foreground" />,
      },
      { label: "Giới tính", value: user.gender, icon: <HeartPulse className="w-4 h-4 text-muted-foreground" /> },
      { label: "Vai trò", value: user.role.name, icon: <ShieldCheck className="w-4 h-4 text-muted-foreground" /> },
      { label: "Trạng thái hoạt động", value: user.isActive ? "Hoạt động" : "Ngừng hoạt động", icon: <Activity className="w-4 h-4 text-muted-foreground" /> },
      { label: "Ngày tạo", value: new Date(user.createdAt).toLocaleString(), icon: <CalendarClock className="w-4 h-4 text-muted-foreground" /> },
      { label: "Ngày cập nhật", value: new Date(user.updatedAt).toLocaleString(), icon: <CalendarClock className="w-4 h-4 text-muted-foreground" /> },
    ]
    : [];

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="sm:max-w-[420px] p-0 h-dvh">
        <SheetHeader className="h-[60px] border-b flex justify-center px-6">
          <SheetTitle className="font-semibold text-lg">
            Thông tin người dùng
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 py-4 h-[calc(100%-120px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
            </div>
          ) : user ? (
            <div className="grid gap-4 text-sm text-gray-700">
              {infoList.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 border-b pb-2 last:border-none"
                >
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="text-right max-w-[60%] break-words">{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Không có dữ liệu người dùng.
            </p>
          )}
        </div>

        <div className="flex justify-end items-center h-[60px] border-t px-6">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Đóng
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
