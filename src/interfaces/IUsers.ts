export interface IUsers{
    id: number,
    name: string,
    email: string,
    password: string,
    department_id: number,
    is_disabled: string
}

export type IAuthedUser = {
    rule: number;
    uid: number;
}
