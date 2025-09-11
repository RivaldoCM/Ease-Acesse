import { Socket, io } from 'socket.io-client';
import { ReactNode, createContext, useEffect, useState, } from "react";
import { handleShowPageByRule } from '../config/menu';
import { IDecodedJWT } from '../interfaces/IDecodedJWT';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const SocketContext = createContext<{
    socket: Socket,
    rooms: string[]
}| null>(null);

export function SocketContextProvider({ children }: {children: ReactNode}) {
    const { user } = useAuth();
    const [socket, setSocket] = useState<any>(null);

    const rooms = ['/break_time', '/massive', '/users'];

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BASEURL_MANAGE_ONU).emit('select_room', {room: `/${user?.uid}`});
        newSocket.on('connect', () => {
            setSocket(newSocket);
        });

        newSocket.on('update-user', data => {
            if(data.updateToken === false) {
                localStorage.removeItem('Authorization');
                return;
            }
            localStorage.setItem('Authorization', data.token);
            const jwtDecoded: IDecodedJWT = jwtDecode(data.token);
            handleShowPageByRule(jwtDecoded.rule);
        });

        newSocket.on('disconnect', () => {
            setSocket(null);
        });
    }, []);

    return (
        <SocketContext.Provider value={{ socket, rooms }}>
            {children}
        </SocketContext.Provider>
    );
}