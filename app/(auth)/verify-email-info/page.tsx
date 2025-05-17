import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function VerifyEmailInfoPage() {
    return (
        <div className="min-h-dvh flex items-center justify-center bg-muted px-4">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="flex flex-col items-center">
                    <CheckCircle2 className="text-green-600 mb-2 h-12 w-12" />
                    <CardTitle className="text-2xl text-center">Xác thực Email Của Bạn</CardTitle>
                    <CardDescription className="text-center text-muted-foreground max-w-xs mt-2">
                        Chúng tôi đã gửi một email xác thực đến địa chỉ của bạn. Vui lòng kiểm tra hộp thư đến hoặc thư mục spam và nhấn vào liên kết trong email để hoàn tất đăng ký.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Link href="/login" passHref>
                        <Button variant="outline" className="w-full max-w-xs">
                            Quay lại trang đăng nhập
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}