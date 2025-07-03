import axios from "axios";
import { IResponseData, IResponseError } from "../../interfaces/IDefaultResponse";

export async function getOnuInfo({oltId, cityId, serialNumber}: {oltId?: number, cityId?: number, serialNumber: string}): Promise<IResponseData | IResponseError>{
    const response = await axios({
        method: 'get',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/onuInfo`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
        },
        params: {
            oltId: oltId || null,
            cityId: cityId || null,
            serialNumber: serialNumber
        },
    }).then((response) => {
        return response.data;
    }).catch(() => {
        return null;
    });
    return response;
}