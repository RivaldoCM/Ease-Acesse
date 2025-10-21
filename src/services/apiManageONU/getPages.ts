import axios from "axios";
import { IResponseData, IResponseError } from "../../interfaces/IDefaultResponse";

export async function getPages({departmentId, roleId}: {departmentId?: number | null, roleId?: number}): Promise<IResponseData | IResponseError>{
    const response = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/pages`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
        },
        params:{
            roleId: roleId,
            departmentId: departmentId,
        }
    })
    .then(response => {
        return response.data;
    })
    .catch(() => {
        return null;
    });
    return response;
}