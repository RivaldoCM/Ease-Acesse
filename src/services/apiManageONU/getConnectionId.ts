import axios from "axios";

export async function getConnectionId(cpf: string, peopleId: number, pppoe: string): Promise<any>{
    const formatedCpf = cpf.replace(/\D/g, '');
    const connectionId = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/getConnectionId`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
        },
        data: {
            cpf: formatedCpf,
            peopleId: peopleId,
            pppoe: pppoe
        }
    })
    .then(response => {
        return response.data;
    })
    .catch((err) => {
        console.log(err)
        return null;
    });
    return connectionId;
}