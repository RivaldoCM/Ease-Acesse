import axios from "axios";
import { IResponseData, IResponseError } from "../../interfaces/IDefaultResponse";

export async function getMassive(): Promise<IResponseData | IResponseError>{
    const res = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/massive`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
        },
        params:{
            status: true
        }
    }).then((response) => {
        return response.data;
    }).catch((err) => {
        console.log(err);
        return null;
    });

    return res;
}
