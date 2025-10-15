import styled from "styled-components";

interface isSelected{
    isSelected?: boolean;
    isExpanded: boolean;
}


export const Container = styled.div`
    display: grid;
    width: calc(100vw - var(--nav-aside-size));
    height: calc(100vh - var(--top-menu-size));
    gap: .5rem;
    padding: .5rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 8fr;
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
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 1rem;
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
        padding: 0 1rem;
        background-color: #;
        border-radius: ${(props) => props.isExpanded ? '.5rem .5rem 0 0' : '.5rem'};

        > div:nth-of-type(1){ 
            width: 10%; 
        }

        > div:nth-of-type(2){
            justify-content: space-between;
            width: 70%;

            p{ font-family: "Itim", cursive !important; }

            > p:last-of-type{
                padding: 2px .5rem;
                font-size: 12px;
                color: white;
                border-radius:1rem;
                background: #4d4d4dff;
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
