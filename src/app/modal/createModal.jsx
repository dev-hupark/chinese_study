// Modal.js
'use client'

import React, { useState } from 'react';
import { client } from '/lib/supabaseClient';
import '/src/app/css/app.css';

const Modal = ({ isOpen, closeModal, onSubmit }) => {
  const [studySession, setStudySession] = useState('');
  const [chineseChar, setChineseChar] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [mean, setMean] = useState('');
  const [studyDt, setStudyDt] = useState('');
  const [ttsUrl, setTtsUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await client.from('chinese_study').insert([
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
      onSubmit();
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>새로운 항목 등록</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>학습 회차</label>
            <input
              type="text"
              value={studySession}
              onChange={(e) => setStudySession(e.target.value)}
              required
            />
          </div>
          <div>
            <label>한자</label>
            <input
              type="text"
              value={chineseChar}
              onChange={(e) => setChineseChar(e.target.value)}
              required
            />
          </div>
          <div>
            <label>병음</label>
            <input
              type="text"
              value={pinyin}
              onChange={(e) => setPinyin(e.target.value)}
              required
            />
          </div>
          <div>
            <label>뜻</label>
            <input
              type="text"
              value={mean}
              onChange={(e) => setMean(e.target.value)}
              required
            />
          </div>
          <div>
            <label>학습일</label>
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
          <div className="button-group">
            <button type="submit" className="confirm">
              등록
            </button>
            <button type="button" className="cancel" onClick={closeModal}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
