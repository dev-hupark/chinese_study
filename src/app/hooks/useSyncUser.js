import { useEffect } from 'react'
import { client } from '/lib/supabaseClient';  // supabaseClient.js에서 불러옴

export const useSyncUser = () => {
    useEffect(() => {
        const syncUser = async () => {
            const { data: { user }, error } = await client.auth.getUser()

            if (!user || error) {
                console.error('유저 정보를 가져올 수 없음:', error)
                return
            }

            const { id, email, user_metadata } = user
            const full_name = user_metadata.full_name
            const avatar_url = user_metadata.avatar_url

            // 👉 예시: 특정 이메일이면 관리자
            const role = email === 'dev.hupark@gmail.com' ? 'admin' : 'user'

            const { error: upsertError } = await client.from('users').upsert([
                {
                    id,
                    email,
                    full_name,
                    avatar_url,
                    role,
                    last_login: new Date()
                }
            ])

            if (upsertError) {
                console.error('유저 정보 저장 실패:', upsertError)
            } else {
                console.log('유저 정보 저장 완료')
            }
        }

        syncUser()
    }, [])
}
