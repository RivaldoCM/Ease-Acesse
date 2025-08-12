import { DetailedHTMLProps, HTMLAttributes } from "react";
import styled from "styled-components";

interface IOffCard extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
    offCardOpen?: boolean;
    readyToFinish?: boolean;
    rule?: number;
}

export const Container = styled.div`
    min-width: 100%;
    min-height: calc(100vh - 200px);
    padding: .2rem;

    .add-massive{
        position: fixed;
        bottom: 16px;
        right: 1rem;
    }
`;

export const Cards = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, 400px);
    justify-content: center;
    gap: .5rem;
    width: 100%;
    line-height: 30px;

    @media (max-width: 620px){
        grid-template-columns: repeat(auto-fit, 400px);
    }

    @media (max-width: 420px){
        grid-template-columns: repeat(auto-fit, 90vw);
    }
`;

export const CardController = styled.div`
    position: relative;
    flex-direction: column;
    align-items: center;
    width: inherit;
    height: 300px;
    overflow: hidden;

    @media (max-width: 899px){
        line-height: 28px;
    }
`;

export const Card = styled.div<IOffCard>`
    position: relative;
    flex-direction: column;
    width: inherit;
    height: inherit;
    padding: .5rem .5rem 2rem .5rem;
    background-color: ${(props) =>
        props.readyToFinish && props.rule === 19 ||
            props.readyToFinish && props.rule === 17 ||
                props.readyToFinish && props.rule === 16 ||
                    props.readyToFinish && props.rule === 14 ? '#22b35279' : '#CCE5FF'
    };
    border-radius: 1.5rem;
    overflow: hidden;
    filter: ${(props) => props.offCardOpen ? 'blur(2px)' : 'blur(0)'};

    .header{
        flex-direction: column;
        width: 100%;
        height: 20%;
        font-family: "Itim", cursive !important;

        h2,p{
            font-family: "Itim", cursive !important;
            font-size: 1.3rem;
        }
    }
    
    .content{
        width: 100%;
        height: 85%;
        padding-top: .5rem;

        p{
            font-family: "Itim", cursive !important;
        }

        .basic-info{
            align-items: flex-start;
            justify-content: flex-start;
            height: 35%;
            overflow: auto;
        }

        .description{
            align-items: flex-start;
            justify-content: flex-start;
            height: 50%;
            overflow: auto;

            p{
                //PERMITE AMOSTRAGEM DA QUEBRA DE LINHA FEITA NO TEXTAREA
                white-space: break-spaces;
            }
        }
    }
`;

export const IconMassivePeople = styled.div`
    position: absolute;
    top: .2rem;
    right: 1rem;
`;

export const MassivePeopleStyle = styled.div`
    position: absolute;
    top: .5rem;
    width: calc(100% - 6rem);
    height: 250px;
    text-align: center;
    background: white;
    border-radius: .5rem;
    box-shadow: 0px 0px 15px 23px rgba(0,0,0,0.1);

    .clients{
        position: relative;
        flex-direction: column;
        justify-content: flex-start;
        height: 75%;
        overflow: auto;

        .client{
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            padding: .5rem;
            text-align: start;

            p{
                font-size: .8rem;
            }
        }
    }
`;

//------------------------OFF-CARD------------------------//

export const OffCard = styled.div<IOffCard>`
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: calc(100% - 3rem);
    height: 250px;
    padding: 0 0.5rem;
    background: rgba(231, 219, 219, 0.53);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid rgba(8, 174, 215, 0.3);
    transform: ${(props) => props.offCardOpen ? 'translateY(5%)' : 'translateY(96%)'};
    transition: .2s ease-in-out;

    p{
        font-family: "Itim", cursive !important;
    }

    .off-card-button{
        z-index: 3;
        overflow: hidden;
        color: #ffffff;
        
        :hover{
            background-color: transparent;
        }
    }

    .off-card-information{
        height: 60%;

        p{
            padding: .2rem 0;
        }
    }

    .off-card-action-buttons{
        justify-content: space-evenly;
        width: 100%;
        height: 20%;
    }
`;

export const FormAddMassive = styled.form`
    flex-direction: column;
    width: 100%;
    max-width: 464px;
    margin: 0 1rem;
    height: auto;
    padding: 1rem 1rem 0 1rem;
    text-align: left;
    background: #fff;
    border-radius: 8px;
    user-select: none;

    .date-timer{
        position: absolute;
        transform: translate(-50%, -50%);
        box-shadow: 0px 0px 100px 49px rgba(0,0,0,0.1),0px 10px 15px -3px rgba(0,0,0,0.1);
        border-radius: 1rem;
        z-index: 99;
    }
`
export const FormAddPeopleMassive = styled.form`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    flex-direction: column;
    max-width: 464px;
    padding: .5rem .5rem 0 .5rem;
    text-align: center;
    background: #fff;
    border-radius: 8px;
`;

export const MapsModalContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
    height: 562px;
    justify-content: space-evenly;

    .map{
        width: 70%;
        height: 100%;
        border-radius: 2%;
    }

    @media (max-width: 1768px){
        width: 60%;
    }

    @media (max-width: 1367px){
        width: 85%;
    }

    @media (max-width: 899px){
        flex-direction: column-reverse;
        width: 90%;
    }

    @media (max-width: 650px){
        .map{
            width: 95%;
        }
    }
`;

export const SideMapStyle = styled.aside`
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    width: 29%;
    height: 100%;
    padding: .5rem;
    border-radius: 10px;
    background-color: azure;

    .list-clients{
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 98%;
        height: 70%;
        margin-top: 1rem;
        font-size: .8rem;
        overflow: auto;

        li{
            margin: .5rem;
        }
    }

    @media (max-width: 899px){
        width: 70%;
        height: 180px;

        .list-clients{
            align-items: center;
            margin-top: 0;
        }
    }

    @media (max-width: 650px){
        width: 95%;
    }
`;

//------------------------CARD-PAINEL------------------------//

export const CardPanel = styled.div<IOffCard>`
    position: relative;
    flex-direction: column;
    width: inherit;
    height: inherit;
    padding: 0 .5rem;
    background-color: ${(props) =>
        props.readyToFinish && props.rule === 19 ||
            props.readyToFinish && props.rule === 17 ||
                props.readyToFinish && props.rule === 16 ||
                    props.readyToFinish && props.rule === 14 ? '#22b35279' : '#CCE5FF'
    };
    border-radius: 1.5rem;
    overflow: hidden;

    .header{
        font-family: "Itim", cursive !important;
        flex-direction: column;
        width: 100%;
        height: 20%;

        h2,p{
            font-family: "Itim", cursive !important;
            font-size: 1.6rem;
        }
    }
    .content{
        width: 100%;
        height: 100%;
        padding-top: .5rem;

        p{
            font-family: "Itim", cursive !important;
            font-size: .9rem;
        }

        .basic-info{
            align-items: flex-start;
            justify-content: flex-start;
            height: 30%;
            overflow: auto;
        }

        .description{
            align-items: flex-start;
            justify-content: flex-start;
            height: 45%;
            overflow: auto;
        }

        .acknowledge{
            height: 25%;
            flex-direction: column;
            p{
                font-size: 1.3rem;
            }
        }
    }
`;