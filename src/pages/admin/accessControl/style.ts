import styled from "styled-components";

interface isSelected{
    isSelected?: boolean;
    isExpanded: boolean;
}

interface Status{
    color: string
}

interface Teste {
    action: string
}

export const Container = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 11fr;
	grid-template-areas:
		"nav header  header  header"
		"nav    view    view    view"
	;
    gap: .5rem;
    width: calc(100vw - var(--nav-aside-size));
    max-height: calc(100vh - var(--top-menu-size));
    padding: .5rem;
    font-family: "Itim", cursive !important;
`;

export const Header = styled.div`
    grid-area: header;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 1rem;
`;

export const Nav = styled.aside`
    grid-area: nav;
    width: 100%;
    background: #fff7f2;
    border-radius: 1rem;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    overflow: auto;
    ::-webkit-scrollbar { display: none; }

    header{
        position: sticky;
        top: 0;
        width: 100%;
        height: 8%;
        border-bottom: 2px solid grey;
    }
    > div {
        flex-direction: column;
        width: 100%;
        padding: .5rem;
    }
`;

export const View = styled.section`
    grid-area: view;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    grid-template-rows: 1.5fr 1fr;
	grid-template-areas:
		"config pages"
		"table table"
	;
    gap: 1rem;
    max-height: inherit;
    padding: 1rem 2rem;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 1rem;
    overflow: auto;

    > div:nth-child(1){
        grid-area: config;

        h3{
            margin: 1rem 0;
            color: #1a1a1a;
            font-family: "Itim", cursive !important;
        }

        label{
            color: #333333;
            font-family: "Itim", cursive !important;
        }
    }
    
    > div:nth-child(2){
        grid-area: pages;
        width: 100%;

        h3{
            margin: 1rem 0;
            color: #1a1a1a;
            font-family: "Itim", cursive !important;
        }
        
        > div:first-of-type{
            justify-content: space-between;
            width: 100%;
            max-height: inherit;
            flex-wrap: wrap;

            > div{
                //CADA PAGINA INDIVIDUAL
                justify-content: space-between;
                width: 304px;
                height: 96px;
                margin: .5rem 0;
                border: 2px solid #d9d9d9;
                border-radius: .8rem;

                > div:first-of-type{
                    flex-direction: column;
                    width: 80%;
                    height: 100%;

                    padding: .2rem 0;

                    > div:first-of-type{
                        width: 100%;
                        height: 70%;
                        margin-left: .5rem;
                        justify-content: start;
                    }

                    > div:last-of-type{
                        width: 100%;
                        height: 30%;
                        justify-content: start;
                    }
                }

                > div:last-of-type{
                    flex-direction: column;
                    justify-content: space-around;
                    width: 20%;
                    height: 100%;
                    border-left: 2px solid #d9d9d9;
                }

            }
        }


    }
    
    > div:nth-child(3){
        grid-area: table;
        
        > div:last-of-type{
            overflow: scroll;
        }
    }
`;

export const CardDepartment = styled.div<isSelected>`
    position: relative;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-radius: .5rem;
    margin: .5rem 0;

    .header{
        justify-content: space-around;
        width: 100%;
        min-height: 60px;
        padding: 0 .5rem;
        border-radius: ${(props) => props.isExpanded ? '.5rem .5rem 0 0' : '.5rem'};

        > div:nth-of-type(1){ 
            width: 15%; 
        }

        > div:nth-of-type(2){
            justify-content: space-between;
            width: 70%;

            p{ font-family: "Itim", cursive !important; }

            > div:first-of-type{
                max-width: 70%;
            }

            > div:last-of-type{
                
                p{
                    padding: 2px .5rem;
                    font-size: 12px;
                    color: white;
                    border-radius: 1rem;
                    background: #4d4d4dff;
                }
            } 

        }

        > div:nth-of-type(3){
            display: flex;
            justify-content: space-around;
            width: 20%; 
        }

    }

    .accordion{
        display: ${(props) => props.isExpanded ? 'flex' : 'none'};
        flex-direction: column;
        align-items: end;
        width: 100%;
        
        > div {

            width: 86%;
            height: 36px;
            justify-content: start;

            p{
                text-align: start;
                font-family: "Itim", cursive !important;
            }

        }
    }
`;

export const Status = styled.span<Status>`
    display: inline-block;
    background-color:  ${(props) => props.color};
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    padding: 4px 12px;
    border-radius: 999px;
    text-align: center;
    line-height: 1.2;
    user-select: none;
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