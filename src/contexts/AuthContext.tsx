import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";
import { IAuthContextProps, IAuthContextProviderProps } from "../interfaces/IAuthContextProps";
import { IDecodedJWT } from "../interfaces/IDecodedJWT";

export const AuthContext = createContext<IAuthContextProps | undefined>(undefined);

export function AuthContextProvider(props: IAuthContextProviderProps){
    const storedToken = localStorage.getItem('Authorization');

    const [user, setUser] = useState<any | undefined>(() => {
        if (storedToken) {
            try{
                const decodedToken: IDecodedJWT = jwtDecode(storedToken);
                return decodedToken;
            } catch(err){
                return undefined;
            }
        }
        return undefined;
    });

    return(
        <AuthContext.Provider value={{ user, setUser }}> 
            {props.children}
        </AuthContext.Provider>
    )
}