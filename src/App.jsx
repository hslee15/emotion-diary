import './App.css'
import { Routes, Route } from 'react-router-dom'
import Diary from './pages/Diary'
import Edit from './pages/Edit'
import Home from './pages/Home'
import Notfound from './pages/Notfound'
import New from './pages/New'
import { useReducer, useRef, createContext, useEffect, useState } from 'react'



const mockData = [
  {
    id: 1,
    createdDate: new Date("2025-08-17").getTime(),
    emotionId: 1,
    content: "1번 일기 내용"
  },
  {
    id: 2,
    createdDate: new Date("2025-08-05").getTime(),
    emotionId: 2,
    content: "2번 일기 내용"
  },
  {
    id: 3,
    createdDate: new Date("2025-08-05").getTime(),
    emotionId: 4,
    content: "3번 일기 내용"
  }
]

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return action.data
    case "CREATE":
      return [action.data, ...state]
    case "UPDATE":
      return state.map((item) =>
        String(item.id) === String(action.data.id) ?
          action.data
          : item
      )
    case "DELETE":
      return state.filter(
        (item) => String(item.id) !== String(action.id)
      )
    default:
      return state
  }

}

export const DiaryStateContext = createContext()
export const DiaryDispatchContext = createContext()
export const ModeContext = createContext();
function App() {

  const [data, dispatch] = useReducer(reducer, mockData)
  const idRef = useRef(4)
  const [mode, setMode] = useState('light')

  useEffect(()=>{
    dispatch({
      type:"INIT",
      data:mockData
    })
  },[])

  useEffect(() => {
    const root = document.getElementById('root');
    if (mode === "dark") {
      document.body.classList.add("dark");
      if (root) root.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      if (root) root.classList.remove("dark");
    }
  }, [mode]);

  const onCreate = (createdDate, emotionId, content) => {

    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content
      }
    })
  }
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content
      }
    })
  }

  const onDelete = (id) => {
    dispatch({
      type: "DELETE",
      id
    })
  }
  return (
    <div className={`Container ${mode}`}>
      <div className="content-wrap">
        <ModeContext.Provider value={{ mode, setMode }}>
          <DiaryStateContext.Provider value={data}>
            <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/new' element={<New />} />
                <Route path='/edit/:id' element={<Edit />} />
                <Route path='/diary/:id' element={<Diary />} />
                <Route path='*' element={<Notfound />} />
              </Routes>
            </DiaryDispatchContext.Provider>
          </DiaryStateContext.Provider>
        </ModeContext.Provider>
      </div>
    </div>
  )
}

export default App