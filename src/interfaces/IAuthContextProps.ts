export interface IAuthContextProps {
    user:  any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

export interface IAuthContextProviderProps {
    children: React.ReactNode;
}