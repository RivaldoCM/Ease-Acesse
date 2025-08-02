import axios from "axios";
import { IResponseData, IResponseError } from "../../interfaces/IDefaultResponse";
import { IAddMassive } from "../../interfaces/IAddMassiveForm";

export async function updateMassive(props: IAddMassive): Promise<IResponseData | IResponseError>{
    const response = await axios({
        method: 'PUT',
        url: `${import.meta.env.VITE_BASEURL_MANAGE_ONU}/massive`,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
        },
        data: {
            id: props.massiveId,
            failure_date: props.failureDateToISO,
            forecast_return: props.forecastDateToISO,
            type: props.problemType,
            city_id: props.cityId,
            affected_local: props.affectedLocals,
            description: props.description,
            updated_by: props.user,
            ready_to_finish: props.readyToFinish,
        }
    }).then((response) => {
        return response.data;
    }).catch(() => {
        return null;
    });
    return response;
}