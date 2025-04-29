import { useEffect, useState } from 'react';
import { client } from '@/lib/supabaseClient';

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data: { session } } = await client.auth.getSession();
        const { data: { user }, error: userError } = await client.auth.getUser();

        if (userError || !user) {
          // console.warn('로그인하지 않은 상태입니다.');
          setUserInfo(null);
          setLoading(false);
          return;
        }

        const { data, error } = await client
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        console.log(user.id);

        if (error) {
          console.error('users 테이블 조회 실패:', error);

          const user = await client.auth.getUser();
          console.log('auth 유저 정보 ', user);
          setUserInfo(null);
        } else {
          setUserInfo(data);
        }

      } catch (e) {
        console.error('알 수 없는 에러:', e);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userInfo, loading };
};
