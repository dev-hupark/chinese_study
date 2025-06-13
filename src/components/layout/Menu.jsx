import { useUserInfo } from '@/hooks/useUserInfo'
import React from 'react'
import Link from 'next/link'

export default function Menu({ onToggleMenu }) {
  const { userInfo, loading } = useUserInfo();

  const isSuAdmin = userInfo?.role === 'su'
  const isAdmin = (userInfo?.role === 'admin') || isSuAdmin

  return (
    <aside>
      <div className="menu-bg" onClick={onToggleMenu}/>
      <div className="menu">
        <p>
          <Link href="/">홈</Link>
        </p>
        <p>
          <Link href="/quiz">문제풀기</Link>
        </p>
        { isSuAdmin && (
          <>
            <p>
              <Link href="/board">건의사항</Link>
            </p>
            <p>
              <Link href="/mng/user">사용자관리</Link>
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
