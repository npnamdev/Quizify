'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function VerifyEmail() {
    const [loading, setLoading] = useState(false);
    const [resent, setResent] = useState(false);

    const handleResend = () => {
        setLoading(true);
        setTimeout(() => {
            setResent(true);
            setLoading(false);
        }, 1500); // giả lập gọi API gửi lại email
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <Card className="w-full max-w-lg text-center shadow-xl border-0">
                <CardHeader className="space-y-2">
                    <div className="flex justify-center">
                        <MailCheck className="text-blue-600 dark:text-blue-400 h-14 w-14 animate-fade-in" />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        Xác minh địa chỉ email
                    </CardTitle>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Chúng tôi đã gửi một liên kết xác minh đến địa chỉ email của bạn. Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để kích hoạt tài khoản.
                    </p>
                </CardHeader>

                <CardContent>
                    {resent ? (
                        <p className="text-green-600 font-medium">
                            ✅ Đã gửi lại email xác minh thành công!
                        </p>
                    ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            Bạn không nhận được email?
                        </p>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center">
                    <Button
                        onClick={handleResend}
                        className="w-full sm:w-auto"
                        disabled={loading || resent}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang gửi...
                            </>
                        ) : resent ? 'Đã gửi lại' : 'Gửi lại email xác minh'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
