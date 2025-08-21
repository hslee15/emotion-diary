import React from 'react'
import Editor from '../components/Editor'
import EmotionItem from '../components/EmotionItem'
import Header from '../components/Header'
import Button from '../components/Button'
import { useContext, useState } from 'react'
import { DiaryDispatchContext } from '../App'
import { useNavigate } from 'react-router-dom'

const New = () => {
    const navigate = useNavigate();
    const {onCreate}=useContext(DiaryDispatchContext)

    const onSubmit=(input)=>{
        onCreate(
            input.createdDate.getTime(),
            input.emotionId,
            input.content
        )
    }
    return (
        <div>
        <Header 
        title={"새 일기 쓰기"}
        leftChild={<Button text={"< 뒤로가기"} onClick={() => navigate(-1)} />}
        />
        <Editor onSubmit={onSubmit}/>
        </div>
    )
}

export default New