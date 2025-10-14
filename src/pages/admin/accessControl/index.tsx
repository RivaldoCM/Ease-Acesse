import { useEffect, useState } from "react";
import { Container, Header, Nav, View } from "./style";
import { getDepartments } from "../../../services/apiManageONU/getDepartments";

export function AccessControl(){

    const [departaments, setDepartaments] = useState('');
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
            </Nav>
            <View className="view">

            </View>
        </Container>
    )
}