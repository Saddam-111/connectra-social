// Home.jsx
import React from 'react'
import Left from '../components/Left.jsx'
import Middle from '../components/Middle'
import Right from '../components/Right'
import { useSelector } from 'react-redux'

const Home = () => {
   const { darkMode } = useSelector((state) => state.theme); // ✅ subscribe to Redux
  return (
    <div className={`w-full h-screen flex justify-center items-start overflow-hidden ${darkMode ? '': ""}`}>
      <Left />
      <Middle />
      <Right />
    </div>
  )
}

export default Home
