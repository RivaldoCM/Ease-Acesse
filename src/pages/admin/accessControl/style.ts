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
        padding: .5rem;
    }
`;

export const View = styled.section`
    grid-area: view;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 1rem;
`;

export const CardDepartment = styled.button<isSelected>`
    width: 92%;
    height: 60px;
    border-radius: 1rem;
    margin: .5rem 0;
    background-color: ${(props) =>
        props.isSelected ? 'green' : '#636B74'
    };
`;
