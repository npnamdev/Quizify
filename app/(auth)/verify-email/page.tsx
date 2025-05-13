'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Token không hợp lệ.');
                return;
            }

            try {
                const res = await fetch(`https://api.wedly.info/api/auth/verify-email?token=${token}`);

                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage('Xác thực email thành công! Đang chuyển hướng...');
                    setTimeout(() => {
                        router.push('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Xác thực thất bại. Token có thể đã hết hạn.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Đã có lỗi xảy ra khi xác thực email.');
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded shadow text-center">
                <h2 className="text-2xl font-bold mb-4">Xác thực Email</h2>
                {status === 'loading' && <p className="text-gray-600">Đang xác thực...</p>}
                {status === 'success' && <p className="text-green-600">{message}</p>}
                {status === 'error' && <p className="text-red-600">{message}</p>}
            </div>
        </div>
    );
}