import React from 'react';

export default function StudyCard({ item, isAdmin, onSpeak, onDelete, onModify, wordViewType }) {
    const handleMoveNaverZh = (word) => {
        window.open(`https://zh.dict.naver.com/#/search?range=all&query=${word}`, '_blank');
        // word
    }
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
      <h1 className="char">
        { wordViewType.includes('C') ? ('-') : (
            <p onClick={() => handleMoveNaverZh(item.chinese_char)}>
                {item.chinese_char}
            </p>
        )}
      </h1>
      <p className="pinyin">
        { wordViewType.includes('P') ? ('-') : item.pinyin}
      </p>
      <p className="mean">
        { wordViewType.includes('M') ? ('-') : item.mean}
      </p>
    </div>
  );
}
