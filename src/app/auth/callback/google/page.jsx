'use client'

import { useSyncUser } from '/src/hooks/useSyncUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthCallbackPage() {
    const router = useRouter()
    useSyncUser()

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/')  // 로그인 후 메인으로 이동
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    return <div>로그인 처리 중입니다...</div>
}