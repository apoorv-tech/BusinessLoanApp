import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StartPage from './pages/StartPage';
import MainPage from './pages/MainPage'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' Component={StartPage}/>
      <Route path='/mainPage/:id' Component={MainPage}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
