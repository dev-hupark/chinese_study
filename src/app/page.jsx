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
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSessions] = useState('all');

  const filtered = selectedSession === "all"
    ? studyData
    : studyData.filter((item) => item.study_session === parseInt(selectedSession));

  // fetchData 함수 정의
  const fetchData = async () => {
    setLoading(true); // 로딩 상태로 설정
    try {
      const { data, error } = await client.from('chinese_study')
        .select('*')
        .order('study_session', { ascending: true })
        .order('id', { ascending: true });;
      if (error) throw error;
      setStudyData(data); // 가져온 데이터로 상태 업데이트
      setSessions([...new Set(data.map((item) => item.study_session))]);
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

  const speakChinese = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.8;   // 속도 느리게 (기본: 1)
    utterance.pitch = 1.2;  // 약간 높은 톤
    utterance.volume = 1;   // 최대 볼륨
    speechSynthesis.speak(utterance);
  };

  // 삭제
  const handleDelete = async (id) => {
    // console.log('delete : ', id);
    const confirmed = window.confirm('정말 삭제 하시겠습니까?');
    if (!confirmed) return;

    const { error } = await client
      .from('chinese_study')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('삭제 실패:', error.message);
    } else {
      console.log('삭제 성공');
      fetchData();
    }
  };

  return (
      <div className="container">
        <h1>Chinese Study</h1>
        <div className="nav">
          <div className="button-group">
            <button onClick={handleOpenModal}>등록</button>
          </div>
          <div className="search-filter">
            <label>회차별 검색</label>
            <select onChange={(e) => setSelectedSessions(e.target.value)} value={selectedSession}>
              <option value="all">전체 회차</option>
              {sessions.map((r) => (
                <option key={r} value={r}>{r}회차</option>
              ))}
            </select>
          </div>
        </div>
        <Modal isOpen={isModalOpen} closeModal={handleCloseModal} onSubmit={handleDataSubmit} />

        <div className="card-container">
          {filtered.map(item => (
            <div className="hanzi-card" key={item.id}>
              <div className="card-header">
                <p className="session">{item.study_session}회차</p>
                <div className="button-group">
                  <button onClick={() => speakChinese(item.chinese_char)}>발음듣기</button>
                  <button className="delete" onClick={() => handleDelete(item.id)}>삭제</button>
                </div>
              </div>
              <h1 className="char">{item.chinese_char}</h1>
              <p className="pinyin">{item.pinyin}</p>
              <p className="mean">{item.mean}</p>
            </div>
          ))}
        </div>
      </div>
  );
};

export default Home;