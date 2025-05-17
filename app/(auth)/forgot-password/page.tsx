"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Thực hiện gọi API gửi link reset password
        console.log("Gửi yêu cầu đặt lại mật khẩu cho:", email);

        setSubmitted(true);
    };

    return (
        <div className="min-h-dvh flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold mb-4 text-center">Quên mật khẩu</h1>
                {submitted ? (
                    <p className="text-center text-green-600">
                        Nếu email bạn nhập đúng, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu trong hộp thư.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="email" className="block mb-1">
                                Email của bạn
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="nhập email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Gửi yêu cầu đặt lại mật khẩu
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}