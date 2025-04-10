'use client'

import { client } from '/lib/supabaseClient';  // supabaseClient.js에서 불러옴
import React, { useEffect, useState } from 'react';
import Modal from './modal/createModal';
import './css/app.css'; // CSS 파일 임포트

const Home = () => {
  const [studyData, setStudyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // fetchData 함수 정의
  const fetchData = async () => {
    setLoading(true); // 로딩 상태로 설정
    try {
      const { data, error } = await client.from('chinese_study').select('*');
      if (error) throw error;
      setStudyData(data); // 가져온 데이터로 상태 업데이트
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  };

  // 처음 컴포넌트가 렌더링 될 때 fetchData 호출
  useEffect(() => {
    fetchData();
  }, []); // 의존성 배열이 비어 있으므로 한 번만 호출

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDataSubmit = () => {
    // 데이터를 제출한 후 새로 데이터를 불러옴
    fetchData();
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
      <div>
        <h1>Chinese Study</h1>
        <button onClick={handleOpenModal}>등록</button>
        <Modal isOpen={isModalOpen} closeModal={handleCloseModal} onSubmit={handleDataSubmit} />
        <table>
          <thead>
          <tr>
            <th>회차</th>
            <th>한자</th>
            <th>병음</th>
            <th>뜻</th>
            <th>발음듣기</th>
            <th>수업일</th>
          </tr>
          </thead>
          <tbody>
          {studyData.map(item => (
              <tr key={item.id}>
                <td>{item.study_session}</td>
                <td>{item.chinese_char}</td>
                <td>{item.pinyin}</td>
                <td>{item.mean}</td>
                <td>
                  <p>-</p>
                  {/*{item.tts_url ? (*/}
                  {/*  <audio controls>*/}
                  {/*  <source src={item.tts_url} type="audio/mpeg" />*/}
                  {/*</audio>*/}
                  {/*) : (<p>-</p>)}*/}
                </td>
                <td>{new Date(item.study_dt).toLocaleDateString('ko-KR')}</td>
              </tr>
          ))}
          </tbody>
        </table>


      </div>
  );
};

export default Home;