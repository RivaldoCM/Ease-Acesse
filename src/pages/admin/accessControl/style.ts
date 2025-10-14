import styled from "styled-components";

interface isSelected{
    isSelected?: boolean;
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
    justify-content: space-between;
    width: 100%;
    height: 60px;
    border-radius: .5rem;
    margin: .5rem 0;
    background-color: ${(props) =>
        props.isSelected ? 'green' : '#F0F4F8'
    };

    .header{
        width: 100%;
        justify-content: space-around;
        div:nth-child(2){
            width: 50%;
        }
        div:nth-last-of-type(){
            button {
                margin: 0 5px;
            }
        }

    }
`;
