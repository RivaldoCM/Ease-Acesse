import { IUsers } from "./IUsers"

export type IClientMassive = {
    id?: number;
    userId?: IUsers['id'];
    massiveId: IMassive['id'];
    cityId: number;
    cpf: string;
    name?: string;
    address?: string;
    lat?: string;
    lng?: string;
    User?:{
        name: string
    }
}