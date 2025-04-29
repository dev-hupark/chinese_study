import { useAuth } from '@/components/provider/AuthProvider';
import { useUserInfo } from '@/hooks/useUserInfo';
import { client } from '@/lib/supabaseClient';
import React from 'react';

export default function Sidebar() {

  // const { session } = useAuth();
  const { userInfo, loading } = useUserInfo();

  const handleLogout = async () => {
    await client.auth.signOut();
    window.location.reload();
  };

  const handleLogin = async () => {
    console.log('window.location.origin :' ,window.location.origin);
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback/google`, // 선택
      },
    })
    if (error) console.error('로그인 실패:', error)
  }


  const isAdmin = userInfo?.role === 'admin';

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>메뉴 준비중...</li>
        </ul>
        <ul className="bottom">
          {loading ? (<></>) :
            userInfo ? (
            <>
              <li><span>{userInfo.full_name}</span></li>
              <li><button className="logoutBtn" onClick={handleLogout}>로그아웃</button></li>
            </>
          ) : (
            <button className="loginBtn" onClick={handleLogin}>
              구글 로그인
            </button>
          )}
        </ul>
      </nav>
    </aside>
  );
}
