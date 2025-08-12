import axios from "axios";
import { IOltProps } from "../../interfaces/IOlt";
import { IResponseData, IResponseError } from "../../interfaces/IDefaultResponse";

export async function addOlt(form: IOltProps, vlans: IVlans[]): Promise< IResponseData | IResponseError>{
    console.log(form, vlans);
    const res = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/olt`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
        },
        data:{
            data: form,
            vlans: vlans
        }
    }).then((response) => {
        return response.data;
    }).catch((err) =>{
        return err;
    });

    return res;
}
