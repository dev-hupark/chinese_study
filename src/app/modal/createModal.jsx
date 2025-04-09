'use client'

// Modal.js
import React, { useState } from 'react';
import { client } from '/lib/supabaseClient'; // Supabase 클라이언트 임포트
import '/src/app/css/app.css'; // CSS 파일 임포트

const Modal = ({ isOpen, closeModal, onSubmit }) => {
  const [studySession, setStudySession] = useState('');
  const [chineseChar, setChineseChar] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [mean, setMean] = useState('');
  const [studyDt, setStudyDt] = useState('');
  const [ttsUrl, setTtsUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await client
      .from('chinese_study')
      .insert([
        {
          study_session: studySession,
          chinese_char: chineseChar,
          pinyin: pinyin,
          mean: mean,
          study_dt: studyDt,
          tts_url: ttsUrl,
        },
      ]);

    if (error) {
      console.error('데이터 삽입 에러:', error);
    } else {
      alert('등록 성공');
      onSubmit(); // 부모 컴포넌트에게 데이터를 새로고침하도록 요청
      closeModal(); // 모달 닫기
    }
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.modal}>
        <h2>새로운 항목 등록</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Study Session</label>
            <input
              type="text"
              value={studySession}
              onChange={(e) => setStudySession(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Chinese Character</label>
            <input
              type="text"
              value={chineseChar}
              onChange={(e) => setChineseChar(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Pinyin</label>
            <input
              type="text"
              value={pinyin}
              onChange={(e) => setPinyin(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Meaning</label>
            <input
              type="text"
              value={mean}
              onChange={(e) => setMean(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Study Date</label>
            <input
              type="date"
              value={studyDt}
              onChange={(e) => setStudyDt(e.target.value)}
              required
            />
          </div>
          <div>
            <label>TTS URL</label>
            <input
              type="text"
              value={ttsUrl}
              onChange={(e) => setTtsUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit">등록</button>
            <button type="button" onClick={closeModal}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;

// 모달 스타일
const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};