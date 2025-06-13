'use client'

import { client } from '@/lib/supabaseClient';
import React, {useEffect, useState} from "react";
import StudyCard from "../../../components/wordStudy/StudyCard";  // supabaseClient.js에서 불러옴

export default function SuggestBoardPage() {
  const [userList, setUserList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

  const fetchUserList = async () => {
    try {
      const { data, error } = await client
        .from('users')
        .select('*')
      /*.eq('id', user.id)
      .single();*/

      if (error) {
        console.error('users 테이블 조회 실패:', error);
        setUserList(null);
        setError(error);
      } else {
        setUserList(data);
      }

    } catch (e) {
      console.error('알 수 없는 에러:', e);
      setUserList(null);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  if (loading) return <div className="container wrap">로딩 중...</div>
  if (error) return <div>오류: {error}</div>

  if (userList.length === 0) return <p>데이터가 없습니다.</p>;

  return (
    <div>
      <h1>사용자관리</h1>
      {userList.length === 0 && (
        <p>데이터가 없습니다.</p>
      )}
      {userList?.map(item => (
        <div key={item.id}>
          {item.full_name} / {item.email} / {item.role}
        </div>
      ))}
    </div>
  )
}
