'use client'

import { client } from '@/lib/supabaseClient';
import React, {useEffect, useState} from "react";  // supabaseClient.js에서 불러옴

export default function SuggestBoardPage() {
  const [quizData, setQuizData] = useState([])
  const [sessionList, setSessionList] = useState([])
  const [selectedSession, setSelectedSessions] = useState('')
  const [quizCount, setQuizCount] = useState('10')

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
    // selectedSession
    const { data ,error } = await client.from('chinese_study')
      .select('id, chinese_char, mean, pinyin')
      .eq('study_session', selectedSession)

    const shuffled = data.sort(() => Math.random() - 0.5).slice(0, quizCount).map(item => ({
        ...item,
        showAnswer: false,
        randomBit: Math.random() < 0.5 ? 0 : 1
      }));

    setQuizData(shuffled)
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
          <input value={quizCount} onChange={e => setQuizCount(e.target.value)}/>
          <button onClick={fnQuizStart}>시작</button>
        </div>
        <div className="quiz-list">
          {quizData.map(item => (
            <div key={item.id} className="quiz-card">
              <div className="quiz-word">
                {item.randomBit === 0 ?
                  (
                    <div className="word">
                      <p className="char">{item.chinese_char}</p>
                      <p className="pinyin">{item.pinyin}</p>
                    </div>

                  )
                  : (<p className="mean">{item.mean}</p>)
                }
                <button className="show-answer-btn" onClick={() => fnShowAnswer(item)}>정답</button>
              </div>
              <div className="answer-word">
                {item.showAnswer && (
                  item.randomBit === 0
                    ? <p className="mean">{item.mean}</p>
                    :
                    <div className="word">
                      <p className="char">{item.chinese_char}</p>
                      <p className="pinyin">{item.pinyin}</p>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}