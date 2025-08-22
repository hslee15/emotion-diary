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
  let nextState;

  switch (action.type) {
    case "INIT":
      return action.data
    case "CREATE":
      nextState=[action.data, ...state]
      break;
    case "UPDATE":
      nextState=state.map((item) =>
        String(item.id) === String(action.data.id) ?
          action.data
          : item
      )
      break;
    case "DELETE":
      nextState=state.filter(
        (item) => String(item.id) !== String(action.id)
      )
      break;
    default:
      return state
  }
  localStorage.setItem('diary',JSON.stringify(nextState))

  return nextState
}

export const DiaryStateContext = createContext()
export const DiaryDispatchContext = createContext()
export const ModeContext = createContext()
function App() {

  const [data, dispatch] = useReducer(reducer, [])
  const idRef = useRef(0)
  const [loading, setLoading]=useState(true)
  const [mode, setMode] = useState('light')

  useEffect(() => {
    const stored = localStorage.getItem('diary');
    let initialData = [];

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          initialData = parsed;
        }
      } catch {
      }
    } else {
      localStorage.setItem('diary', JSON.stringify([]));
    }

    const maxId = initialData.reduce((m, it) => Math.max(m, Number(it.id) || 0), 0);
    idRef.current = maxId + 1;

    dispatch({ type: 'INIT', data: initialData });
    setLoading(false);
  }, []);

  useEffect(() => {
    const root = document.getElementById('root')
    if (mode === 'dark') {
      document.body.classList.add('dark')
      if (root) root.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
      if (root) root.classList.remove('dark')
    }
  }, [mode]);

  const onCreate = (createdDate, emotionId, content) => {
    const id = idRef.current++;
    dispatch({
      type: 'CREATE',
      data: { id, createdDate, emotionId, content }
    });
  };
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

  if(loading){
    return <div>데이터를 불러오는 중입니다.</div>
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