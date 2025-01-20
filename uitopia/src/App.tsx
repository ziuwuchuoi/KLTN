import { useState } from 'react'
import PageHome from './pages/PageHome'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PageHome></PageHome>
    </>
  )
}

export default App
