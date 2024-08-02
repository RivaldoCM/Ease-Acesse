import axios from "axios";
import { IResponseData, IResponseError } from "../../interfaces/IDefaultResponse";

export async function getTokenExitLag():Promise<IResponseData|IResponseError>{
    const res = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/exitLag`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
        },
    }).then((response) => {
        return response.data;
    }).catch(() =>{
        return null;
    });
    return res;
}

