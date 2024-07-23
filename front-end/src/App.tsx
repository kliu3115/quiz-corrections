import Home from './Home'
import Navbar from './Navbar'
import Login from './Login'
import Register from './Register'
import MySets from './MySets'
import CreateSet from './CreateSet'
import ViewSet from './ViewSet'
import EditSet from './EditSet'
import Study from './Study'
import Congrats from './Congrats'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {useState} from 'react'

function App() {
  const [loggedInUser, setLoggedInUser] = useState('');
  return (
    <Router>
      <div className = 'App'>
        <Navbar />
        <div className = "content">
          <Routes>
            <Route path="/Congrats/:setID" element={<Congrats />} />
            <Route path="/Study/:setID" element={<Study />} />
            <Route path="/Edit-Set/:setID" element={<EditSet />} />
            <Route path="/View-Set/:setID" element={<ViewSet />} />
            <Route path="/Create-New" element={<CreateSet />} />
            <Route path="/My-Sets" element={<MySets />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
