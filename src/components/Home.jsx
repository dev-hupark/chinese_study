'use client'

import { client } from '@/lib/supabaseClient';  // supabaseClient.js에서 불러옴
import React, { useEffect, useState } from 'react';
import Modal from '@/components/modal/CreateModal';
import { useUserInfo } from '@/hooks/useUserInfo';

const Home = () => {
  const { userInfo, loading } = useUserInfo();
  const [studyData, setStudyData] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [wordType, setWordType] = useState([]);
  const [selectedSession, setSelectedSessions] = useState('all');
  const [selectedWordType, setSelectedWordType] = useState('all');

  /*const filtered = selectedSession === "all"
    ? studyData
    : studyData.filter((item) => item.study_session === parseInt(selectedSession));*/
  const filtered = studyData.filter((item) => {
    const matchSession = selectedSession === "all" || item.study_session === parseInt(selectedSession);
    const matchWordType = selectedWordType === "all" || item.word_type === selectedWordType;

    return matchSession && matchWordType;
  });

  // fetchData 함수 정의
  const fetchData = async () => {
    try {
      const { data, error } = await client.from('chinese_study')
        .select('*')
        .order('study_session', { ascending: true })
        .order('id', { ascending: true });;
      if (error) throw error;
      setStudyData(data); // 가져온 데이터로 상태 업데이트
      setSessions([...new Set(data.map((item) => item.study_session))]);
      setWordType([...new Set(data.map((item) => item.word_type))]);
    } catch (error) {
      setError(error.message);
    } finally {

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

  const isAdmin = userInfo?.role === 'admin';

  const speakChinese = (text) => {
    const synth = window.speechSynthesis;

    const speak = () => {
      const voices = synth.getVoices();
      const zhVoice = voices.find(v => v.lang === "zh-CN" || v.name.includes("Chinese"));

      if (!zhVoice) {
        alert("중국어 TTS 음성을 찾을 수 없습니다!");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = zhVoice;
      utterance.lang = "zh-CN";
      utterance.rate = 0.8;   // 속도 느리게 (기본: 1)
      utterance.pitch = 1.2;  // 약간 높은 톤
      utterance.volume = 1;   // 최대 볼륨
      synth.speak(utterance);
    };

    if (synth.getVoices().length === 0) {
      synth.addEventListener("voiceschanged", speak);
    } else {
      speak();
    }
  };

  // 삭제
  const handleDelete = async (id) => {
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

  const signInWithGoogle = async () => {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) console.error(error)
    else console.log(data)
  }

  const handleLogout = async () => {
    await client.auth.signOut();
    // 페이지 새로고침하거나 상태 리셋이 필요하다면 여기에 추가
    window.location.reload(); // 선택 사항
  };

  return (
    <div className="container">
      <div className="search-filter">
        {isAdmin && (
          <button onClick={handleOpenModal}>등록</button>
        )}
        <p>검색 조건</p>
        <div>
          <label>회차</label>
          <select onChange={(e) => setSelectedSessions(e.target.value)} value={selectedSession}>
            <option value="all">전체 회차</option>
            {sessions.map((r) => (
              <option key={r} value={r}>{r}회차</option>
            ))}
          </select>
        </div>
        <div>
          <label>구분</label>
          <select onChange={(e) => setSelectedWordType(e.target.value)} value={selectedWordType}>
            <option value="all">전체</option>
            {wordType.map((r) => (
              <option key={r} value={r}>{r === 'P' ? '패턴' : '회화'}</option>
            ))}
          </select>
        </div>
      </div>
      <Modal isOpen={isModalOpen} closeModal={handleCloseModal} onSubmit={handleDataSubmit} />
      <div className="card-container">
        {
          filtered.length === 0 ? (
              <p>데이터가 없습니다.</p>
            ) :
            filtered.map(item => (
              <div className="hanzi-card" key={item.id}>
                <div className="card-header">
                  <p className="session">학습 {item.study_session}회차</p>
                  <div className="button-group">
                    <button onClick={() => speakChinese(item.chinese_char)}>발음듣기</button>
                    {isAdmin && (
                      <button className="delete" onClick={() => handleDelete(item.id)}>삭제</button>
                    )}
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