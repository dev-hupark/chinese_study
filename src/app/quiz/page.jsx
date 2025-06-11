'use client'

import { client } from '@/lib/supabaseClient';
import React, {useEffect, useState} from "react";  // supabaseClient.js에서 불러옴

export default function SuggestBoardPage() {
  const [quizData, setQuizData] = useState([])
  const [sessionList, setSessionList] = useState([])
  const [selectedSession, setSelectedSessions] = useState('')
  const [quizCount, setQuizCount] = useState('')

  useEffect(() => {
    fetchSesionData()
  }, [])

  const fetchSesionData = async () => {
    const { data, error } = await client.rpc('get_study_session_list')
        if (error) throw error

    setSessionList(data)
  }

  const fnQuizStart = async () => {
    // selectedSession
    const { data ,error } = await client.from('chinese_study')
      .select('id, chinese_char, mean, pinyin')
      .eq('study_session', selectedSession)

    const shuffled = data
      .sort(() => Math.random() - 0.5)
      .slice(0, quizCount)
      .map(item => ({
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
      <div>
        <select onChange={(e) => setSelectedSessions(e.target.value)} value={selectedSession}>
          <option value="all">전체 회차</option>
          {sessionList.map((item) => (
            <option key={item.study_session} value={item.study_session}>{item.study_session}회차</option>
          ))}
        </select>
        <label>
          문항수
          <input value={quizCount} onChange={e => setQuizCount(e.target.value)}/>
        </label>
        <button onClick={fnQuizStart}>시작</button>
      </div>
      <div>
        {quizData.map(item => (
          <div key={item.id}>
            {item.randomBit === 0 ?
              (
                <p>{item.chinese_char} / {item.pinyin}</p>
              )
              : (<p>{item.mean}</p>)
            }
            <div>
              <button onClick={() => fnShowAnswer(item)}>정답보기 {item.showAnswer}</button>
              {item.showAnswer && (
                item.randomBit === 0
                  ? <span>{item.mean}</span>
                  : <span>{item.chinese_char} / {item.pinyin}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}