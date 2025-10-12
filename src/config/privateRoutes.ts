export const privateRoutes = (path: string) => {
    const token = localStorage.getItem('Authorization');
    const pages = localStorage.getItem('Pages');
    let hasPage = '';
    
    if(!token){
        //NÃO ESTÁ LOGADO.
        return 401;
    }

    if (pages) {
        const collections = JSON.parse(pages);
        for (const collection of collections){
            const found = collection.pages.find((pagePath: any) => pagePath.path === path);
            if (found) {
                hasPage = found;
                break;
            }
        }
    }

    if(hasPage){
        return 100;
    } else {
        return 403;
    }

}