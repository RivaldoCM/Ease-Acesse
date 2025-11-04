import axios from 'axios';
import { IAuthOnuProps } from '../../interfaces/IAuthOnuProps';
import { IResponseData, IResponseError } from '../../interfaces/IDefaultResponse';

export async function writeONU(props: IAuthOnuProps): Promise<IResponseData | IResponseError>{
    const response = await axios({
        method: 'post',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/writeONU`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`,
        },
        data: {
            userId: props.userId,
            oltId: props.oltId,
            slot: props.slot,
            pon: props.pon,
            serialNumber: props.serialNumber,
            modelOnu: props.modelOnu,
            typeOnu: props.typeOnu,
            rxPowerPreview: props.rxPowerPreview,
            contract: props.contract,
            cpf: props.cpf,
            pppoeUser: props.pppoeUser,
            pppPass: props.pppPass,
            wifiSSIDBS: props.wifiSSIDBS,
            wifiPassBS: props.wifiPassBS,
            wifiSSID24: props.wifiSSID24,
            wifiPass24: props.wifiPass24,
            wifiSSID58: props.wifiSSID58,
            wifiPass58: props.wifiPass58,
            sipUser: props.sipUser,
            sipPass: props.sipPass,
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