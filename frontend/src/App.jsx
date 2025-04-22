import { Routes, Route } from 'react-router-dom';
import './App.css'
import AddRestaurant from './pages/RestaurantAdmin/AddRestaurant'
import Sidebar from './components/SideBar/Sidebar';
import AddMenuItem from './pages/RestaurantAdmin/AddMenuItem'
import MenuListByRestaurant from './pages/RestaurantAdmin/MenuListByRestaurant';
import Navbar from './pages/RestaurantAdmin/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RestaurantsInfo from './pages/Admin/RestaurantsInfo';
import RestaurantDetails from './pages/RestaurantAdmin/RestaurantDetails';
import UpdateMenuItem from './pages/RestaurantAdmin/UpdateMenuItem';
function App() {
  

  return (
    <>
     <ToastContainer/>
    <Navbar/>
    <hr></hr>
   <div className='flex'>
    <Sidebar/>
          <Routes>
            <Route path="/add-restaurant" element={<AddRestaurant />} />
            <Route path="/add-menu" element={<AddMenuItem />} />
            <Route path="/restaurants-info" element={<RestaurantsInfo/>} />
            <Route path="/restaurant-details" element={<RestaurantDetails />} />
            <Route path="/menus" element={<MenuListByRestaurant />} />
            <Route path="/update-menu-item" element={<UpdateMenuItem />} />
            
          </Routes>
       
          </div>
   
    </>
  )
}

export default App;
