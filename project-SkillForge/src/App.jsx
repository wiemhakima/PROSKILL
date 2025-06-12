import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Landing from './public/landing';
import Login from './Auth/login';
import Signup from './Auth/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Landing" element={<Landing />} />
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />

        

      </Routes>
    </Router>
  );
}

export default App;
