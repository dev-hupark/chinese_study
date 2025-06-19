'use client'

import { client } from '@/lib/supabaseClient';
import React, { useEffect, useState } from "react";

export default function SuggestBoardPage() {
  const [quizData, setQuizData] = useState([])
  const [sessionList, setSessionList] = useState([])
  const [selectedSession, setSelectedSessions] = useState('')
  const [quizCount, setQuizCount] = useState('10')
  const [quizType, setQuizType] = useState('random') // 'random', 'chinese', 'mean'
  const [showPinyin, setShowPinyin] = useState(true) // 병음 보기 여부

  useEffect(() => {
    fetchSesionData()
  }, [])

  const fetchSesionData = async () => {
    const { data, error } = await client.rpc('get_study_session_list')
    if (error) throw error

    setSelectedSessions(data[0].study_session)
    setSessionList(data)
  }

  const fnQuizStart = async () => {
    const { data, error } = await client.from('chinese_study')
      .select('id, chinese_char, mean, pinyin')
      .eq('study_session', selectedSession)

    const shuffled = data
      .sort(() => Math.random() - 0.5)
      .slice(0, quizCount)
      .map(item => {
        let questionType = quizType;

        if (quizType === 'random') {
          questionType = Math.random() < 0.5 ? 'chinese' : 'mean';
        }

        return {
          ...item,
          showAnswer: false,
          questionType
        };
      });

    setQuizData(shuffled);
  }

  const fnShowAnswer = (item) => {
    const updated = quizData.map(q =>
      q.id === item.id ? { ...q, showAnswer: true } : q
    );
    setQuizData(updated);
  }

  return (
    <div className="container wrap">
      <div className="quiz-container">
        <div className="quiz-cond">
          <select onChange={(e) => setSelectedSessions(e.target.value)} value={selectedSession}>
            {sessionList.map((item) => (
              <option key={item.study_session} value={item.study_session}>{item.study_session}회차</option>
            ))}
          </select>

          <p>문항수</p>
          <input value={quizCount} onChange={e => setQuizCount(e.target.value)} />

          <button onClick={fnQuizStart}>시작</button>
        </div>

        <div className="quiz-cond">
          <p>문제 유형</p>
          <select value={quizType} onChange={(e) => setQuizType(e.target.value)}>
            <option value="random">랜덤 보기</option>
            <option value="chinese">한자 보기</option>
            <option value="mean">뜻 보기</option>
          </select>

          <label>
            <input type="checkbox" checked={showPinyin} onChange={(e) => setShowPinyin(e.target.checked)} />
            병음 보기
          </label>
        </div>

        <div className="quiz-list">
          {quizData.map(item => (
            <div key={item.id} className="quiz-card">
              <div className="quiz-word">
                {item.questionType === 'chinese' && (
                  <div className="word">
                    <p className="char">{item.chinese_char}</p>
                    {showPinyin && <p className="pinyin">{item.pinyin}</p>}
                  </div>
                )}
                {item.questionType === 'mean' && (
                  <div className="word">
                    <p className="mean">{item.mean}</p>
                    {showPinyin && <p className="pinyin">{item.pinyin}</p>}
                  </div>
                )}
                <button className="show-answer-btn" onClick={() => fnShowAnswer(item)}>정답</button>
              </div>

              {item.showAnswer && (
                <div className="answer-word">
                  {item.questionType === 'chinese' && (
                    <>
                      <p className="mean">{item.mean}</p>
                      {!showPinyin && <p className="pinyin">{item.pinyin}</p>}
                    </>
                  )}
                  {item.questionType === 'mean' && (
                    <>
                      <p className="char">{item.chinese_char}</p>
                      {!showPinyin && <p className="pinyin">{item.pinyin}</p>}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
