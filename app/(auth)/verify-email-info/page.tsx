import Link from 'next/link';

export default function VerifyEmailInfoPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    Xác thực email của bạn
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    Chúng tôi đã gửi một email xác thực đến địa chỉ của bạn. Vui lòng kiểm tra hộp thư đến hoặc thư rác và nhấn vào liên kết trong email để hoàn tất đăng ký.
                </p>
                <div className="text-center">
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Quay lại trang đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}