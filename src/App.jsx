import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className='text-red-600'>Pawsitivity</h1>
    </>
  )
}

export default App
export function Logo() {
  return (
    <div className="logo-container">
      <img src={reactLogo} className="logo react" alt="React logo" />
      <img src={viteLogo} className="logo vite" alt="Vite logo" />
    </div>
  )
}