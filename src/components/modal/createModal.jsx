// Modal.js
'use client'

import React, { useState } from 'react';
import { client } from '@/lib/supabaseClient';
import '/src/css/app.css';

const Modal = ({ isOpen, closeModal, onSubmit }) => {
  const [studySession, setStudySession] = useState('8');
  const [chineseChar, setChineseChar] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [mean, setMean] = useState('');
  const [selectedWordType, setSelectedWordType] = useState('P');
  const wordType = [{key: '패턴', value: 'P'}, {key: '회화', value: 'C'}]

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await client.from('chinese_study').insert([
      {
        study_session: studySession,
        chinese_char: chineseChar,
        pinyin: pinyin,
        mean: mean,
        word_type: selectedWordType,
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
            <label>구분</label>
            <select onChange={(e) => setSelectedWordType(e.target.value)} value={selectedWordType}>
              {wordType.map((item) => (
                  <option key={item.value} value={item.value}>{item.key}</option>
              ))}
            </select>
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
