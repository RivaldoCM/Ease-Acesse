export const privateRoutes = (path: string) => {
    const token = localStorage.getItem('Authorization');
    const pages = localStorage.getItem('Pages');
    let hasPage = '';

    if(!token){
        return 401;
    } else {
        pages && JSON.parse(pages).map((collection: any) => {
            hasPage = collection.pages.find((pagePath: any) => pagePath.path === path);
        });

        if(hasPage){
            return 100;
        } else {
            return 403;
        }
    }
}