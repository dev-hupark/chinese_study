// MultiCreateModal.js
'use client'

import React, {useState, useRef} from 'react';
import { client } from '@/lib/supabaseClient';
import '@/css/app.css';
import InputPinyin from "./InputPinyin";

const MultiCreateModal = ({ isOpen, closeModal, onSubmit }) => {
  const inputPinyin = useRef();

  const wordType = [{key: '패턴', value: 'P'}, {key: '회화', value: 'C'}]
  const [studyData, setStudyData] = useState({
    study_session: '',
    chinese_char: '',
    pinyin: '',
    mean: '',
    word_type: 'P',
  });
  const [upsertData, setUpsertData] = useState([])

  const handleCloseModal = () => {
    setStudyData({
      study_session: '',
      chinese_char: '',
      pinyin: '-',
      mean: '-',
      word_type: 'P',
    })
    setUpsertData([])
    inputPinyin.current?.resetInput();
    closeModal()
  }
  const handleSubmit = async () => {
    upsertData.map(item => {
      if(!item.id) delete item.id
    })

    const { data, error } = await client
      .from('chinese_study')
      .upsert(upsertData, {
        onConflict: 'id', // 유니크 키 컬럼 지정
      });

    if (error) {
      console.error('upsert error :', error);
    } else {
      console.log('success : ', data);
      setUpsertData([])
      onSubmit();
      closeModal();
    }
  }

  const addItems = () => {
    setUpsertData(prevItems => [...prevItems, studyData])
    inputPinyin.current?.resetInput()
    setStudyData(prev => ({
        study_session: prev.study_session,
        chinese_char: '',
        pinyin: '-',
        mean: '-',
        word_type: prev.word_type,
    }))
  }

  const handlePinyinChange = (value) => {
    setStudyData((prev) => ({
      ...prev,
      pinyin: value,
    }));
  }

  if (!isOpen) return null;

  const deleteUpsertData = (index) => {
    setUpsertData(prev => prev.filter((_, idx) => idx !== index));
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content-w800">
        <h2>새로운 항목 등록</h2>
        <form className="multi-insert-form" onSubmit={handleSubmit}>
          <div className="form-data-row">
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
          </div>
          <div className="form-data-row">
            <div className="form-data-column">
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
              />
            </div>
            <InputPinyin
                ref={inputPinyin}
                onKeyDown={handlePinyinChange}
                type={"M"}
            />
            <div className="form-data-column">
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
              />
            </div>
          </div>
          <div className="modal-data-view-container">
            <div className="modal-data-view modal-data-view-h">
              <p>한자</p>
              <p>병음</p>
              <p>뜻</p>
            </div>
            {upsertData?.map((item, index) => (
              <div key={index} className="modal-data-view modal-data-view-b">
                <p><span className="delete-item" onClick={() => deleteUpsertData(index)}>X</span>{item.chinese_char}</p>
                <p>{item.pinyin}</p>
                <p>{item.mean}</p>
              </div>
            ))}
          </div>
          <div className="button-group">
            <button type="button" className="add" onClick={addItems}>
              추가
            </button>
            <button type="button" className="confirm" onClick={handleSubmit}>
              등록
            </button>
            <button type="button" className="cancel" onClick={handleCloseModal}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiCreateModal;
