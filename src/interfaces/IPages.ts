export type IPageCollection = {
    category: string;
    order: number;
    pages: {
        name: string,
        order: number,
        path: string,
        Rules: {
            id: number;
            name: string;
        }[]
    }[]
}