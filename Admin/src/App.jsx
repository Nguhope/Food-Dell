import React from 'react';
import Navbar from './components/Navbar/Navbar';
import SideBar from './components/Sidebar/sideBar';
import {Routes,Route} from "react-router-dom";
import Add from './pages/Add/add'
import List from './pages/List/list'
import Orders from './pages/Orders/orders'
import { ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {

  const url = "http://localhost:4000"
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr />
      <div className="app-content">
        <SideBar/>
        <Routes>
         <Route path='/add' element = {<Add url={url}/>} />
         <Route path='/list' element = {<List  url={url}/>} />
         <Route path='/orders' element = {<Orders  url={url}/>} />
          
          
        </Routes>
      </div>
    </div>
  );
}

export default App;
