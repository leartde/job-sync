import { Outlet } from 'react-router-dom';
import './App.css'
import Navbar from "./components/shared/Navbar.tsx";
import Footer from './components/shared/Footer.tsx';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
      <>
          <Navbar/>
          <Outlet/>
        <ToastContainer />
          <Footer/>
      </>


  )

}

export default App;
