import axios from "axios";

import { getToken } from "./getToken";
import { IUpdateConnectionProps } from "../../interfaces/IUpdateConnectionProps.js";

export async function updateConnection(props: IUpdateConnectionProps){

    let modelOLTVoalle: number = 0;
    if(props.modelOlt === 'ZTE'){
        modelOLTVoalle = 7;
    }else if(props.modelOlt === 'PARKS'){
        modelOLTVoalle = 4;
    } else {
        modelOLTVoalle = 6;
    }
    console.log(props)
    /*
    const response = await axios({
        headers: {
            'Authorization': "Bearer " + await getToken()
        },
        method: 'put',
        url: `${import.meta.env.VITE_BASEURL_TP}:45715/external/integrations/thirdparty/updateconnection/${props.connectionId}`,
        data:{
            "id": props.connectionId,
            "fiberMac": "",
            "mac": "",
            "password": props.pppoePassword, //PPPoE
            "equipmentType": modelOLTVoalle,
            "oltId": props.onuId,
            "slotOlt": props.slot,
            "portOlt": props.pon,
            "equipmentSerialNumber": props.serialNumber,
            "ipType": 0,
            "equipmentUser": "",
            "equipmentPassword": "",
            "authenticationSplitterId": "",
            "port": "",
            "wifiName": props.wifiSSID,
            "wifiPassword": props.wifiPass,
            "technologyType": 8,
            "authenticationAccessPointId": props.accessPointId,
            "updateConnectionParameter": false,
            "shouldMacUpdate": false,
            "user": props.pppoeUser,
            "complement": "",
            "isIPoE": false
        }
    }).then((res) => {
        console.log(res)
        return true;
    }).catch((err) => {
        console.log(err)
        return false;
    });
    */

    //return response;
}