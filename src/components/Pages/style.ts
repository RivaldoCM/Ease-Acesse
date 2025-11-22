import styled from "styled-components";

interface Teste {
    action: string
}

export const PageContainer = styled.div`
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;

    > div{
        //CADA PAGINA INDIVIDUAL
        justify-content: space-between;
        width: 268px;
        height: 96px;
        margin: .5rem 0;
        border: 2px solid #d9d9d9;
        border-radius: .4rem;

        > div:first-of-type{
            flex-direction: column;
            justify-content: space-around;
            width: 80%;
            height: 100%;
            padding: .2rem 0;

            p{font-family: 'Itim', cursive !important;}
        }

        //BOTÕES DE AÇÃO
        > div:last-of-type{
            flex-direction: column;
            justify-content: space-around;
            width: 20%;
            height: 100%;
            border-left: 2px solid #d9d9d9;
        }
    }
`;

export const Rules = styled.span<Teste>`
    display: inline-block;
    background-color:  ${(props) => 
    props.color === 'View' ? 
        props.action : props.action === 'Edit' ? '#FFA500' : 
            props.action === 'Delete' ? '#F44336' : 
                '#28A745'
    };      
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    padding: 4px 12px;
    margin-left: .5rem;
    border-radius: 999px;
    text-align: center;
    line-height: 1.2;
    user-select: none;
`;
