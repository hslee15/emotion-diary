import React ,{useState,useContext}from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import DiaryList from '../components/DiaryList'
import { DiaryStateContext, ModeContext } from '../App'

const Home = () => {
    const data=useContext(DiaryStateContext)

    const [pivotDate,setPivotDate]=useState(new Date())
    const { mode, setMode } = useContext(ModeContext);


    const getMonthlyData=(pivotDate,data)=>{
        const beginTime=new Date(
            pivotDate.getFullYear(),
            pivotDate.getMonth(),
            1,
            0,0,0
        ).getTime()
        const endTime=new Date(
            pivotDate.getFullYear(),
            pivotDate.getMonth()+1,
            0,
            23,59,59
        ).getTime()

        return data.filter(
            (item)=>beginTime <=item.createdDate && item.createdDate <=endTime
        )
    }


    const MonthlyData=getMonthlyData(pivotDate,data)

    const onIncreamentMonth=()=>{
        setPivotDate(
            new Date(pivotDate.getFullYear(), pivotDate.getMonth()+1)
        )
    }
    const onDecreamentMonth=()=>{
        setPivotDate(
            new Date(pivotDate.getFullYear(), pivotDate.getMonth()-1)
        )
    }
    return (
        <div>
            <button
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
                style={{ position: "absolute", top: "10px", left: "10px" }}
            >
                {mode === "light" ? "🌙 다크 모드" : "☀️ 라이트 모드"}
            </button>
            <Header
            leftChild={<Button text={"<"} onClick={onDecreamentMonth}/>}
            title={`${pivotDate.getFullYear()}년 ${pivotDate.getMonth()+1}월`}
            rightChild={<Button text={">"} onClick={onIncreamentMonth}/>}
            />

            <DiaryList data={MonthlyData}/>
        </div>
    )
}

export default Home