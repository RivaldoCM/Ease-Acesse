export const PrivateRoutes = (path: string) => {
    const token = localStorage.getItem('Authorization');
    const pages = localStorage.getItem('Pages');

    if(!token){
        return false;
    } else {
        pages && JSON.parse(pages).map((page: any) => {
            if(page.path === path){
                return true;
            }
        });
        return false;
    }
}