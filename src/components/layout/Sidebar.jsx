import { useUserInfo } from '@/hooks/useUserInfo';
import { client } from '@/lib/supabaseClient';
import React from 'react';
import Link from 'next/link';

export default function Sidebar({ onToggleSidebar }) {
  const { userInfo, loading } = useUserInfo();

  const handleLogout = async () => {
    await client.auth.signOut();
    window.location.reload();
  };

  const handleLogin = async () => {
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback/google`, // 선택
      },
    })
    if (error) console.error('로그인 실패:', error)
  }

  const isSuAdmin = userInfo?.role === 'su'
  const isAdmin = (userInfo?.role === 'admin') || isSuAdmin

  return (
    <aside>
      <div className="sidebar-bg" onClick={onToggleSidebar}/>
      <div className="sidebar">
        <nav>
          <ul>
            <li>
              <Link href="/">홈</Link>
            </li>
            <li>
              <Link href="/quiz">문제풀기</Link>
            </li>
            { isSuAdmin && (
              <>
                <li>
                  <Link href="/board">건의사항</Link>
                </li>
                <li>
                  <Link href="/mng/user">사용자관리</Link>
                </li>
              </>
            )}
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
      </div>
    </aside>
  );
}
