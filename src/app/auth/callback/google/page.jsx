'use client'

import { syncUser } from '/src/lib/services/syncUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const syncAndRedirect = async () => {
            await syncUser();  // ⭐️ 여기 await으로 기다려야 함
            router.push('/');     // 완료 후 메인으로 이동
        };

        syncAndRedirect();
    }, []);

    return <div>로그인 처리 중입니다...</div>;
}
