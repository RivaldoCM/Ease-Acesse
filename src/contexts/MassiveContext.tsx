
import { ReactNode, createContext, useEffect, useState, } from "react";
import { useSocket } from "../hooks/useSocket";
import { useAuth } from "../hooks/useAuth";
import { getMassive } from "../services/apiManageONU/getMassive";

export const MassiveContext = createContext<{
    massives: IMassive[],
}| null>(null);

export function MassiveContextProvider({ children }: {children: ReactNode}) {
    const { user } = useAuth();
    const { socket } = useSocket();

    const [massives, setMassives] = useState<IMassive[]>([]);

    useEffect(() => {
        const getData = async () => {
            const response = await getMassive();
            if(response){
                if(response.success){
                    setMassives(response.responses.response);
                } else {
                    console.log(response.messages)
                }

            }

        }
        getData();
    }, []);

    if(socket){
        socket.emit('select_room', {
            uid: user?.uid,
            room: '/massive'
        });

        socket.on('update-massive', data => {
            setMassives(data.responses.response);
        });
    }

    return (
        <MassiveContext.Provider value={{ massives }}>
            {children}
        </MassiveContext.Provider>
    );
}