import React from 'react';
import StudyCard from './StudyCard';

export default function StudyList({ filtered, isAdmin, onSpeak, onDelete, onModify }) {
  if (filtered.length === 0) return <p>데이터가 없습니다.</p>;

  return (
    <div className="card-container">
      {filtered.map(item => (
        <StudyCard
          key={item.id}
          item={item}
          isAdmin={isAdmin}
          onSpeak={onSpeak}
          onDelete={onDelete}
          onModify={onModify}
        />
      ))}
    </div>
  );
}
