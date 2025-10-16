import { useEffect, useState } from "react";
import { CardDepartment, Container, Header, Nav, View } from "./style";
import { getDepartments } from "../../../services/apiManageONU/getDepartments";
import { FormControl, FormHelperText, FormLabel, IconButton, Input, Option, Select, Table } from "@mui/joy";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { getUsers } from "../../../services/apiManageONU/getUsers";

export function AccessControl(){
    const [departaments, setDepartaments] = useState([]);
    const [departmentId, setDepartamentId] = useState<null | number>(null);
    const [accordions, setAccordions] = useState<number[]>([]);
    const [usersByDepartment, setUsersBydeparment] = useState([])

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

    useEffect(() => {
        if(departmentId){
            async function getData(){
                const response = await getUsers({departmentId: departmentId});
                if(response){
                    if(response.success){
                        setUsersBydeparment(response.responses.response);
                    } else {

                    }
                } else {

                }
            }
            getData();
        }
    }, [departmentId]);

    const handleExpandAccordion = (index: number) => {
        if(accordions.includes(index)){
            setAccordions(accordions.filter(accordions => accordions !== index))
        } else {
            setAccordions([...accordions, index]);
        }
    };

    const handleSelectDepartment = (id: number) => {
        if(id !== departmentId){
            setDepartamentId(id);
        }
    }

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
                        <CardDepartment className="flex" isSelected={index === departmentId} isExpanded={accordions.includes(index)}>
                            <div className="header flex">
                                <div>
                                    <IconButton variant="soft" size="sm">
                                        <GroupOutlinedIcon />
                                    </IconButton>
                                </div>
                                <div className="flex">
                                    <div>
                                        <p>{department.name}</p>
                                    </div>
                                    <div>
                                        <p>{department.Roles.length} cargos</p>
                                    </div>
                                </div>
                                <div>
                                    <IconButton variant="soft" size="sm" onClick={() => handleExpandAccordion(index)}>
                                        {accordions.includes(index) ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                    <IconButton variant="soft" size="sm" onClick={() => handleSelectDepartment(department.id)}>
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
                <div className="config">
                    <h3>Departamento X</h3>
                    <div>
                        <FormControl>
                            <FormLabel>Nome do departamento</FormLabel>
                            <Input placeholder="Placeholder" />
                        </FormControl>
                    </div>
                    <div>
                        <FormControl sx={{ width: 240 }}>
                            <FormLabel id="select-field-demo-label" htmlFor="select-field-demo-button">
                                Status
                            </FormLabel>
                            <Select
                                defaultValue="dog"
                            >
                                <Option value="dog">Dog</Option>
                                <Option value="cat">Cat</Option>
                                <Option value="fish">Fish</Option>
                                <Option value="bird">Bird</Option>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div className="pages">
                    paginas
                </div>
                <div className="table">
                    <div><h3>Usuários vinculados</h3></div>
                    <div>
                        <Table>
                            <thead>
                                <tr>
                                <th>Column width (40%)</th>
                                <th>Calories</th>
                                <th>Fat&nbsp;(g)</th>

                                </tr>
                            </thead>
                            <tbody>
                                {usersByDepartment.map((row) => (
                                <tr key={row.name}>
                                    <td>{row.name}</td>
                                    <td>{row.email}</td>
                                    <td>{row.is_disabled === false ? 'oi' : 'nao'}</td>

                                </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                
                </div>
            </View>
        </Container>
    )
}