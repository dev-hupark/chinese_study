'use client'

import { client } from '@/lib/supabaseClient';  // supabaseClient.js에서 불러옴
import { useEffect } from 'react'

export default function LoginPage() {
    const handleLogin = async () => {
        const { error } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback/google`, // 선택
            },
        })
        if (error) console.error('로그인 실패:', error)
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>로그인 페이지</h1>
            <button onClick={handleLogin}>Google로 로그인</button>
        </div>
    )
}
