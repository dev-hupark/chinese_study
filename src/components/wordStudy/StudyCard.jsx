import React from 'react';

export default function StudyCard({ item, isAdmin, onSpeak, onDelete, onModify }) {
  return (
    <div className="hanzi-card" key={item.id}>
      <div className="card-header">
        <p className="session">학습 {item.study_session}회차</p>
        <div className="button-group">
          <button onClick={() => onSpeak(item.chinese_char)}>발음듣기</button>
          {isAdmin && (
            <>
              <button onClick={() => onModify(item)}>수정</button>
              <button className="delete" onClick={() => onDelete(item.id)}>삭제</button>
            </>

          )}
        </div>
      </div>
      <h1 className="char">{item.chinese_char}</h1>
      <p className="pinyin">{item.pinyin}</p>
      <p className="mean">{item.mean}</p>

    </div>
  );
}
