import { jwtDecode } from "jwt-decode";
import { createContext, useState } from "react";
import { handleShowPageByRule } from "../config/menu";
import { IAuthContextProps, IAuthContextProviderProps } from "../interfaces/IAuthContextProps";
import { IDecodedJWT } from "../interfaces/IDecodedJWT";

export const AuthContext = createContext<IAuthContextProps | undefined>(undefined);

export function AuthContextProvider(props: IAuthContextProviderProps){
    const [user, setUser] = useState<any | undefined>(() => {
        const storedToken = localStorage.getItem('Authorization');
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
    handleShowPageByRule(user?.rule);

    console.log(handleShowPageByRule(user?.rule), user)
    return(
        <AuthContext.Provider value={{ user, setUser }}> 
            {props.children}
        </AuthContext.Provider>
    )
}