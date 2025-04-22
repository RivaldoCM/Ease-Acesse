import axios from "axios";

import { IResponseData, IResponseError } from "../../interfaces/IDefaultResponse";

export async function findCPE({userId, cityId, mac}: {userId: number | undefined, cityId: number, mac: string}): Promise<IResponseData | IResponseError>{
    const data = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/CPEs`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
        },
        params:{
            userId: userId,
            cityId: cityId,
            mac: mac
        },
    }).then((res) => {
        return res.data;
    }).catch(() => {
        return false;
    });
    return data;
}