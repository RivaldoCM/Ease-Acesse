import { createGlobalStyle } from "styled-components";
import styled from "styled-components";
import { HTMLAttributes, DetailedHTMLProps } from 'react';

interface MyStyledComponentProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    center?: boolean;
}

export const GlobalStyle = createGlobalStyle`
    :root {
        //altura to menu, parte superior
        --top-menu-size: 68px;
        --nav-aside-size: 65px;
        //colors
        --surface-color: #F8F8FF;
        --curve: 40;
    }
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        outline: none;
        border: 0;
        text-decoration: none;
        list-style-type: none;
    }
    html {
        font-size: 17px;

        @media screen {
            @media (max-width: 1000px){
                font-size: 93.75%; // 15px
            }
            @media (max-width: 720px){
                font-size: 87.5%; // 14px
            }
        }
    }

    body {
        //background: #eef1f6 !important;
        -webkit-font-smoothing: antialiased;
    }
    body, button, texarea{
        font-family: 'Montserrat', sans-serif !important;
        font-weight: 400;
    }
    p, li, input, div{
        font-family: 'Poppins', sans-serif !important;
    }
    h1, h2, h3, h4, h5, h6, strong{font-weight: 700; background: none;}
    button {cursor: pointer;}
    //a{color: var(--black)}
    [disable] {opacity: 0.6%; cursor: not-allowed;}

    ::-webkit-scrollbar {
        width: 8px; /* Largura da barra de rolagem */
    }

    /* Track (trilha) */
    ::-webkit-scrollbar-track {
        background: #f1f1f1; /* Cor de fundo da trilha */
    }

    /* Handle (alça) */
    ::-webkit-scrollbar-thumb {
        background: #bdbebd; /* Cor do fundo da alça */
        border-radius: 10px; /* Raio da borda da alça */
    }

    /* Handle on hover (alça ao passar o mouse) */
    ::-webkit-scrollbar-thumb:hover {
        background: #555; /* Cor do fundo da alça ao passar o mouse */
    }

    .flex{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .MUI-CircularProgress{
        width: 30px !important;
        height: 30px !important;
    }

    .alert{
        position: fixed; 
        top: 94%;
        left:50%;
        z-index: 9999;
        transform: translate(-50%, -50%);
    }
`

export const InputContainer = styled.div<MyStyledComponentProps>`
    /*
        ESSE ESTILO CONTROLA O TEXTO E O QUE SEJA INSERIDO PELO USUÁRIO,
        CARACTERISTICO POR: INFORMAÇÃO EM TEXTO SOBRE O QUE DEVE SER INSERIDO
        E O CAMPO DE INSERÇÃO PARA O USUÁRIO
    */
    
    display: flex;
    justify-content: flex-start;
    width: 100%;
    margin: 1rem 0;

    .text{
        display: flex;
        align-items: ${(props) => (props.center ? 'center' : 'end')};
    }

    .text, .content{
        width: 50%;
        padding: 0 2px;
    }

    .content{

        > input{
            //POR ALGUM MOIVO O INPUT TYPE NUMBER FLOODA O MODAL
            max-width: 100%;
        }
    }
    
    @media (max-width: 450px){
        width: 100%;
    }
`