import { createContext,useEffect,useReducer } from "react";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext()

export const authReducer = (state,action)=>{
    switch(action.type){
        case 'LOGIN':
            return {user:action.payload}
        case 'LOGOUT':
            return {user:null}
        default:
            return state
    }
}


export const AuthContextProvider =({ children })=>{
const [state,dispatch] = useReducer(authReducer,{
    user:null,
})

//const isTokenExpired = (token)=>{
  //  if(token != null){
   //     const decoded=jwtDecode(token)
   //     const currentTime = Date.now() /1000
   //     return decoded.exp < currentTime;
   // }
//}

useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
        dispatch({ type: 'LOGIN', payload: user }) 
    }

},[])

    console.log('AuthContext',state)

   // if (loading) {
     //   return <div>Loading...</div>;
   // }

    return(
        <AuthContext.Provider value={{...state,dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}