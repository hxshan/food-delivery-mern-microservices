import { API_URL } from "../api";
import socketService from "./socketService";
const TOKEN_KEY = "user_";

// export const connectSocketAfterLogin = (token, user) => {
//     const socket = socketService.initSocket(token, user);
//     if (user.type === 'driver') {
//       socket.on('new_order_request', (data) => {
//         console.log('New order request received:', data);
//       });
//       startDriverLocationTracking(socket);
//     } 
//     else if (user.type === 'customer') {
//       // Set up customer-specific event listeners
//       // These are mostly handled by the specific functions when tracking an order
//     }
//     else if (user.type === 'restaurant') {
//       socket.on('new_order', (data) => {
//         console.log('New order received:', data);
//       });
//     }
    
//     return socket;
//   };
//  export const startDriverLocationTracking = (socket) => {
   
//     if ('geolocation' in navigator) {
//       const locationWatchId = navigator.geolocation.watchPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };
          
//           const currentOrderId = localStorage.getItem('currentOrderId');
//           if (currentOrderId) {
//             socketService.updateDriverLocation(currentOrderId, location);
//           }
          
//           socket.emit('driver_available', { location });
//         },
//         (error) => {
//           console.error('Error getting location:', error.message);
//         },
//         {
//           enableHighAccuracy: true,
//           maximumAge: 10000,
//           timeout: 5000      
//         }
//       );
      
//       // Store the watch ID to clear when needed
//       localStorage.setItem('locationWatchId', locationWatchId);
//     } else {
//       console.error('Geolocation is not available in this browser');
//       // Show an error to the driver that location services are required
//     }
//   };

export class AuthService {
    async login(email,password){
        console.log(TOKEN_KEY,API_URL)

        let data = JSON.stringify({ email:email , password:password})

        const response = await fetch(`${API_URL}/api/auth/login`,{
            method:"POST",
            body:data,
            headers:{
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json());

        if(response.token){
            localStorage.setItem(TOKEN_KEY,response.token)
            socketService.initSocket();
            return(true)
        }else{
            return(response.message)
        }
    }
}

export const authService = new AuthService()