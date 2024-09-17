import './App.css'
import { Outlet } from 'react-router-dom'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    This is A P2P One way Communication app
      <Outlet/>
    </>
  )
}

export default App
