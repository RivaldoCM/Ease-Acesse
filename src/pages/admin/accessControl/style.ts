import styled from "styled-components";

interface isSelected{
    isSelected?: boolean;
    isExpanded: boolean;
}


export const Container = styled.div`
    display: grid;
    width: calc(100vw - var(--nav-aside-size));
    max-height: calc(100vh - var(--top-menu-size));
    gap: .5rem;
    padding: .5rem;
    grid-template-columns: 1.2fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 11fr;
	grid-template-areas:
		"nav header  header  header"
		"nav    view    view    view"
	;
    font-family: "Itim", cursive !important;
`;

export const Header = styled.div`
    grid-area: header;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 1rem;
`;

export const Nav = styled.aside`
    grid-area: nav;
    border-radius: 1rem;
    background: #fff7f2;
    width: 100%;
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
    gap: 1rem;
    padding: 1rem 2rem;
    max-height: inherit;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 1rem;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 2fr 1fr;
	grid-template-areas:
		"config pages"
		"table table"
	;

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
