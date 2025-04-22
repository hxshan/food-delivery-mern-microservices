import { Routes, Route } from 'react-router-dom';
import './App.css'
import AddRestaurant from './pages/RestaurantAdmin/AddRestaurant'
import Sidebar from './components/SideBar/Sidebar';
import AddMenuItem from './pages/RestaurantAdmin/AddMenuItem'

function App() {
  

  return (
    <>
   
   <div className='flex'>
    <Sidebar/>
          <Routes>
            <Route path="/add-restaurant" element={<AddRestaurant />} />
            <Route path="/add-menu" element={<AddMenuItem />} />
            
          </Routes>
       
          </div>
   
    </>
  )
}

export default App;
