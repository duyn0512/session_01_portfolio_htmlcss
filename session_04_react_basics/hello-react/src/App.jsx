import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import UserProfile from './UserProfile'
import Product from './ProductInfo'
import LifecycleDemo from './LifecycleDemo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Tên của bạn ở đây</h1>
      <p>Hôm nay là ngày đẹp trời</p>
      <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
        <li>React</li>
      </ul>

      <br />

      <UserProfile/>

      <br />

      <Product/>

      <br />

      <LifecycleDemo/>
      
    </div>
  )
}

export default App
