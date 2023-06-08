import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from './components/Home';
import { Navbar } from './components/Navbar';
import About from './components/About';
import NoteState from './context/notes/NoteState.js';
import Alert from './components/Alert';
import Login from './components/Login';
import SignUp from './components/SignUp';
import { useState } from 'react';
import process from 'process';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };
  return (
    <>
      <NoteState>
        <Router basename={process.env.PUBLIC_URL}>
          <Navbar />
          <Alert alert={alert} showAlert={showAlert} />
          <div className="container">
          <Routes>
            <Route path="/" element={<Home showAlert={showAlert} />} />
            <Route path="/about" element={<About  showAlert={showAlert}/>} />
            <Route path="/login" element={<Login   showAlert={showAlert}/>} />
            <Route path="/signup" element={<SignUp showAlert={showAlert}/>} />
          </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
