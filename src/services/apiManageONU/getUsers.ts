import axios from "axios";
import { IResponseData, IResponseError } from "../../interfaces/IDefaultResponse";

export async function getUsers({userId, departmentId}: {userId?: number | null, departmentId?: number | null}): Promise<IResponseData | IResponseError>{
    const users = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/users`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
        },
        params: {
            departmentId: departmentId,
            overrideRulesByUserId: userId
        },
    }).then((response) => {
        return response.data;
    }).catch(() => {
        return null;
    });

    return users;
}