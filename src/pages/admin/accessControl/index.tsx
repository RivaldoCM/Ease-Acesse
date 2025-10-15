import { useEffect, useState } from "react";
import { CardDepartment, Container, Header, Nav, View } from "./style";
import { getDepartments } from "../../../services/apiManageONU/getDepartments";
import { IconButton } from "@mui/joy";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';

export function AccessControl(){
    const [departaments, setDepartaments] = useState([]);
    const [selected, setSelected] = useState<null | number>(null);
    const [accordions, setAccordions] = useState<number[]>([]);

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


    console.log(accordions)
    const handleExpandAccordion = (index: number) => {
        if(accordions.includes(index)){
            setAccordions(accordions.filter(accordions => accordions !== index))
        } else {
            setAccordions([...accordions, index]);
        }
    };

    return(
        <Container>
            <Header className="header">

            </Header>
            <Nav className="nav">
                <header className="flex">
                    <p>Departamentos e Cargos</p>
                </header>
                <div className="flex">
                    {departaments && departaments.map((department: IDepartments, index) => (
                        <CardDepartment className="flex" isSelected={index === selected} isExpanded={accordions.includes(index)}>
                            <div className="header flex">
                                <div>
                                    <IconButton variant="soft" size="sm">
                                        <GroupOutlinedIcon />
                                    </IconButton>
                                </div>
                                <div className="flex">
                                    <p>{department.name}</p>
                                    <p>{department.Roles.length} cargos</p>
                                </div>
                                <div>
                                    <IconButton variant="soft" size="sm" onClick={() => handleExpandAccordion(index)}>
                                        {accordions.includes(index) ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                    <IconButton variant="soft" size="sm">
                                        <KeyboardDoubleArrowRightIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="accordion">
                                {
                                    department.Roles.map((role, roleIndex) => (
                                        <div key={roleIndex} className="flex">

                                            <div>
                                                <IconButton variant="soft" size="sm">
                                                    <AssignmentIndOutlinedIcon />
                                                </IconButton>
                                            </div>
                                            <div>
                                                <p>{role.name}</p>
                                            </div>
                                        </div>
                                    ))
                                }
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