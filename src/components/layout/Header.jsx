import React from 'react'
import Image from 'next/image'
import {client} from '@/lib/supabaseClient'
import {useUserInfo} from '@/hooks/useUserInfo'

export default function Header({ onToggleMenu }) {
  const { userInfo, loading } = useUserInfo();

  const handleLogin = async () => {
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback/google`, // 선택
      },
    })

    if (error) console.error('로그인 실패:', error)
  }

  const handleLogout = async () => {
    await client.auth.signOut();
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="wrap">
        <button onClick={onToggleMenu}>
          <Image src="/images/menu.png" alt="메뉴" width={25} height={25} />
        </button>
        <h1>Chinese Study</h1>
        {userInfo ?
          <button onClick={handleLogout}>
            <Image src="/images/log-out.png" alt="로그아웃" width={25} height={25} />
          </button>
            : (
              <button onClick={handleLogin}>
                {/*구글 로그인*/}
                <Image src="/images/user.png" alt="로그인" width={28} height={28} />
              </button>
            )
        }
      </div>
    </header>
  );
}
