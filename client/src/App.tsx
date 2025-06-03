import { Outlet } from 'react-router-dom';
import './App.css'
import Navbar from "./components/Navbar.tsx";
import Footer from './components/Footer.tsx';

function App() {

  return (
      <>
          <Navbar/>
          <Outlet/>
          <Footer/>
      </>


  )

}

export default App;
