import React from 'react';

export default function FilterPanel({
                                      sessions, wordType,
                                      selectedSession, onChangeSession,
                                      selectedWordType, setSelectedWordType
                                    }) {
  return (
    <div className="search-filter">
      <p>검색 조건</p>
      <div>
        <label>회차</label>
        <select onChange={(e) => onChangeSession(e.target.value)} value={selectedSession}>
          <option value="">전체 회차</option>
          {sessions.map((s, index) => (
            <option key={index} value={s.study_session}>{s.study_session}회차</option>
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
  );
}
