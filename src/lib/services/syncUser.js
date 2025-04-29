import { client } from '@/lib/supabaseClient'

export const syncUser = async () => {    // 🔥 usePrefix 삭제
    const { data: { session } } = await client.auth.getSession();

    if (!session) {
        console.error('세션 없음, 유저 정보 저장 생략');
        return;
    }

    const { data: { user }, error } = await client.auth.getUser();

    if (!user || error) {
        console.error('유저 정보를 가져올 수 없음:', error);
        return;
    }

    const { id, email, user_metadata } = user;
    const full_name = user_metadata?.full_name || '';
    const avatar_url = user_metadata?.avatar_url || '';

    if (!id || !email) {
        console.error('id나 email이 비어있음. 유저 정보 저장 생략');
        return;
    }

    const { error: upsertError } = await client.from('users').upsert([
        {
            id: String(id),
            email,
            full_name,
            avatar_url,
            last_login: new Date()
        }
    ]);

    if (upsertError) {
        console.error('유저 정보 저장 실패:', upsertError);
    } else {
        console.log('유저 정보 저장 완료');
    }
};
