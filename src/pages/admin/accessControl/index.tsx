import { useEffect, useState } from "react";
import { CardDepartment, Container, Header, Nav, View } from "./style";
import { getDepartments } from "../../../services/apiManageONU/getDepartments";
import { IconButton } from "@mui/joy";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

export function AccessControl(){

    const [departaments, setDepartaments] = useState([]);
    const [selected, setSelected] = useState<null | number>(null);

    console.log(selected)
    useEffect(() => {
        async function getData(){
            const response = await getDepartments();
            if(response){
                if(response.success){
                    setDepartaments(response.responses.response);
                } else {

                }
            } else {

            }
        }
        getData();
    }, []);

    return(
        <Container>
            <Header className="header">

            </Header>
            <Nav className="nav">
                <header className="flex">
                    <p>Departamentos e Cargos</p>
                </header>
                <div className="flex">
                    {departaments && departaments.map((dep, index) => (
                        <CardDepartment className="teste" isSelected={index === selected} onClick={() => {setSelected(index)}}>
                            <div className="header">
                                <p>{dep.name}</p>
                                <IconButton variant="soft" size="sm">
                                <KeyboardArrowDownIcon />
                                </IconButton>
                                <IconButton variant="soft" size="sm" sx={{fontSize: '10px !important'}}>
                                <KeyboardDoubleArrowRightIcon />
                                </IconButton>
                            </div>
                            <div className="accordion">
                                
                            </div>
                        </CardDepartment>
                    ))}
                </div>
            </Nav>
            <View className="view">

            </View>
        </Container>
    )
}