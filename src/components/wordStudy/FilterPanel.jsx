import React from 'react';

export default function FilterPanel({
                                      sessions, wordType,
                                      selectedSession, setSelectedSessions,
                                      selectedWordType, setSelectedWordType
                                    }) {
  return (
    <div className="search-filter">
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
  );
}
