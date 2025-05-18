import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import CreateAdd from './pages/CreateAdd';
import Header from './components/Header';
import Footer from './components/Footer';
import Listings from "./pages/Listings";
import AdDetail from './components/AdDetail';
import './assets/fonts/font.css';
function App() {
  return (
    <>
      <BrowserRouter>
      <Header/>
      <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/create' element={<CreateAdd/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<AdDetail />} />
      </Routes>
      <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App;
