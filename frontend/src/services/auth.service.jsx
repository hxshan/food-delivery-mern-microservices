import { API_URL } from "../api";

const TOKEN_KEY = "user_";

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
            return(true)
        }else{
            return(response.message)
        }
    }
}

export const authService = new AuthService()