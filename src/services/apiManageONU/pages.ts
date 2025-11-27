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
    }).then(response => {
        return response.data;
    }).catch(() => {
        return null;
    });
    return response;
}

export async function setPages({departmentId, roleId, newPages}: {departmentId?: number | null, roleId?: number, newPages: any}): Promise<IResponseData | IResponseError>{
    const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/pages`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
        },
        data:{
            roleId: roleId,
            departmentId: departmentId,
            newPages: newPages,
        }
    }).then(response => {
        return response.data;
    }).catch(() => {
        return null;
    });
    return response;
}

export async function removePages({departmentId, roleId, pageId}: {departmentId?: number | null, roleId?: number, pageId: number}): Promise<IResponseData | IResponseError>{
    const response = await axios({
        method: 'delete',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/pages`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
        },
        data:{
            roleId: roleId,
            departmentId: departmentId,
            pageId: pageId,
        }
    }).then(response => {
        return response.data;
    }).catch(() => {
        return null;
    });
    return response;
}