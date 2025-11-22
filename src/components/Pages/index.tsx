import { useState } from "react";
import { IconButton } from "@mui/joy";
import { handleIconMenu } from "../../config/menu";
import { IPageCollection } from "../../interfaces/IPages";
import { PageContainer, Rules } from "./style";

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { RemovePage } from "./modals/removePage";

export function Pages({ pages } : {pages: IPageCollection[]}){
    const [page, setPage] = useState<IPageCollection["pages"][number] | null>(null);
    const [openRemovePage, setOpenRemovePage] = useState(false);

    const handleOpenRemovePage = (page: IPageCollection["pages"][number]) => {
        setPage(page);
        setOpenRemovePage(true);
    };
    const handleCloseRemovePage = () => setOpenRemovePage(false);

    console.log(page)

    return(
        <PageContainer className="flex">
            {pages && pages.map((collection: IPageCollection) => (
                collection.pages.map((page: IPageCollection["pages"][number], index: number) => (
                    <div className="flex" key={index}>
                        <div className="flex">
                            <div className="flex">
                                {handleIconMenu(page.path, 'small')}<p>{page.name}</p>
                            </div>
                            <div className="flex">
                                {page.Rules.map((rule: IPageCollection["pages"][number]["Rules"][number], index: number) => (
                                    <Rules action={rule.name} key={index}>{rule.name}</Rules>
                                ))}
                            </div>
                        </div>
                        <div className="flex">
                            <IconButton variant="soft" color="primary">
                                <EditOutlinedIcon />
                            </IconButton>
                            <IconButton variant="soft" color="danger" onClick={() => {handleOpenRemovePage(page)}}>
                                <DeleteOutlineOutlinedIcon />
                            </IconButton>
                        </div>
                    </div>
                ))
            ))}
            {
                openRemovePage && (
                    <RemovePage 
                        open={openRemovePage}
                        page={page!}
                        handleClose={handleCloseRemovePage}
                    />
                )
            }
        </PageContainer>
    )
}