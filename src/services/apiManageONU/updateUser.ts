import axios from "axios";

export async function updateUser({id, userName, email, accessLevel, status}: {id: number, userName: string, email: string, accessLevel: number, status: boolean}){
    const res = await axios({
        method: 'patch',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/users`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
        },
        data:{
            id: id,
            name: userName,
            email: email,
            rule: accessLevel,
            isDisabled: status,
        }
    }).then((response) => {
        return response.data;
    }).catch(() => {
        return null;
    });

    return res;
}
