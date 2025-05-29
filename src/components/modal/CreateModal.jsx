// Modal.js
'use client'

import React, { useState, useEffect } from 'react';
import { client } from '@/lib/supabaseClient';
import '@/css/app.css';
import InputPinyin from "./InputPinyin";

const Modal = ({ selectedData, isOpen, closeModal, onSubmit }) => {
  const wordType = [{key: '패턴', value: 'P'}, {key: '회화', value: 'C'}]
  const [studyData, setStudyData] = useState({
    id: null,
    study_session: '',
    chinese_char: '',
    pinyin: '',
    mean: '',
    word_type: 'P',
  });

  useEffect(() => {
    if (selectedData) {
      setStudyData({
        id: selectedData.id ?? null,
        study_session: selectedData.study_session ?? '',
        chinese_char: selectedData.chinese_char ?? '',
        pinyin: selectedData.pinyin ?? '',
        mean: selectedData.mean ?? '',
        word_type: selectedData.word_type ?? 'P',
      });
    } else {
      setStudyData({
        ...studyData,
      })
    }

  }, [selectedData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const upsertData = { ...studyData };
    if (!upsertData.id) {
      delete upsertData.id; // 빈 문자열이나 null인 경우 제거
    }

    const { data, error } = await client
      .from('chinese_study')
      .upsert([upsertData], {
        onConflict: 'id', // 유니크 키 컬럼 지정
      });

    if (error) {
      console.error('upsert error :', error);
    } else {
      console.log('success : ', data);
      onSubmit();
      closeModal();
    }
  };

  const handlePinyinChange = (value) => {
    setStudyData((prev) => ({
      ...prev,
      pinyin: value,
    }));
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>새로운 항목 등록</h2>
        <form className="insert-form" onSubmit={handleSubmit}>
          <div>
            <label>학습 회차</label>
            <input
              type="text"
              value={studyData.study_session}
              onChange={(e) => {
                const value = e.target.value;
                setStudyData((prev) => ({
                  ...prev,
                  study_session: value,
                }));
              }}
              required
            />
            {/*onChange={(e) => setStudySession(e.target.value)}*/}
          </div>
          <div>
            <label>한자</label>
            <input
              type="text"
              value={studyData.chinese_char}
              onChange={(e) => {
                const value = e.target.value;
                setStudyData((prev) => ({
                  ...prev,
                  chinese_char: value,
                }));
              }}
              required
            />
          </div>
          <InputPinyin
              onKeyDown={handlePinyinChange}
          />
          {/*<div>
            <label>병음</label>
            <div>
              <input
                type="text"
                value={studyData.pinyin}
                onChange={(e) => {
                  const value = e.target.value;
                  setStudyData((prev) => ({
                    ...prev,
                    pinyin: value,
                  }));
                }}
                onKeyDown={getPinyin}
                required
              />
            </div>
          </div>*/}
          <div>
            <label>뜻</label>
            <input
              type="text"
              value={studyData.mean}
              onChange={(e) => {
                const value = e.target.value;
                setStudyData((prev) => ({
                  ...prev,
                  mean: value,
                }));
              }}
              required
            />
          </div>
          <div>
            <label>구분</label>
            <select
              value={studyData.word_type}
              onChange={(e) => {
                const value = e.target.value;
                setStudyData((prev) => ({
                  ...prev,
                  word_type: value,
                }));
              }}>
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
