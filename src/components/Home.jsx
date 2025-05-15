'use client'

import React, { useEffect, useState } from 'react'
import { client } from '@/lib/supabaseClient'
import Modal from '@/components/modal/CreateModal'
import { useUserInfo } from '@/hooks/useUserInfo'
import FilterPanel from '@/components/wordStudy/FilterPanel'
import StudyList from '@/components/wordStudy/StudyList'

const Home = () => {
  const {userInfo, loading} = useUserInfo()
  const [studyData, setStudyData] = useState([])
  const [error] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sessions, setSessions] = useState([])
  const [wordType, setWordType] = useState([])
  const [selectedSession, setSelectedSessions] = useState('all')
  const [selectedWordType, setSelectedWordType] = useState('all')
  const [selectedData, setSelectedData] = useState({})
  const checkBoxItems = [
    {name: '한자 가리기', value: 'C'},
    {name: '병음 가리기', value: 'P'},
    {name: '뜻 가리기', value: 'M'},
  ]
  const [wordViewType, setWordViewType] = useState([])

  const filtered = studyData.filter((item) => {
    const matchSession = selectedSession === 'all' || item.study_session === parseInt(selectedSession)
    const matchWordType = selectedWordType === 'all' || item.word_type === selectedWordType
    return matchSession && matchWordType
  })

  const fetchData = async () => {
    const { data, error } = await client.from('chinese_study')
      .select('*')
      .order('study_session', { ascending: true })
      .order('id', { ascending: true })

    if (error) throw error

    setStudyData(data)
    setSessions([...new Set(data.map((item) => item.study_session))])
    setWordType([...new Set(data.map((item) => item.word_type))])

  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)
  const handleDataSubmit = () => fetchData()

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>오류: {error}</div>

  const isSuAdmin = userInfo?.role === 'su'
  const isAdmin = (userInfo?.role === 'admin') || isSuAdmin

  const speakChinese = (text) => {
    const synth = window.speechSynthesis
    const speak = () => {
      const voices = synth.getVoices()
      const zhVoice = voices.find(v => v.lang === 'zh-CN' || v.name.includes('Chinese'))
      if (!zhVoice) {
        alert('중국어 TTS 음성을 찾을 수 없습니다!')
        return
      }
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.voice = zhVoice
      utterance.lang = 'zh-CN'
      utterance.rate = 0.8
      utterance.pitch = 1.2
      utterance.volume = 1
      synth.speak(utterance)
    }
    if (synth.getVoices().length === 0) {
      synth.addEventListener('voiceschanged', speak)
    } else {
      speak()
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('정말 삭제 하시겠습니까?')
    if (!confirmed) return
    const { error } = await client.from('chinese_study').delete().eq('id', id)
    if (error) {
      console.error('삭제 실패:', error.message)
    } else {
      console.log('삭제 성공')
      fetchData()
    }
  }

  const handleInsert = () => {
    setSelectedData({})
    handleOpenModal()
  }
  const handleModify = (data) => {
    setSelectedData(data)
    handleOpenModal()
  }
  const handleCheckChange = (event) => {
    const val = event.target.value
    const chk = event.target.checked
    let tmpArr = [ ...wordViewType ];
    if(chk){
      tmpArr.push(val)
    } else {
      tmpArr = tmpArr.filter(item => item !== val);
    }
    setWordViewType(tmpArr)
  }

  return (
    <div className="container wrap">
      <div className="top-section">
        <FilterPanel
          sessions={sessions}
          wordType={wordType}
          selectedSession={selectedSession}
          setSelectedSessions={setSelectedSessions}
          selectedWordType={selectedWordType}
          setSelectedWordType={setSelectedWordType}
        />
        <div className="view-option">

          {isAdmin && <button onClick={handleInsert}>등록</button>}
        </div>
      </div>
      <Modal isOpen={isModalOpen}
             selectedData={selectedData}
             closeModal={handleCloseModal}
             onSubmit={handleDataSubmit} />
      <StudyList
        filtered={filtered}
        isAdmin={isAdmin}
        onSpeak={speakChinese}
        onDelete={handleDelete}
        onModify={handleModify}
        wordViewType={wordViewType}
      />
    </div>
  )
}

export default Home