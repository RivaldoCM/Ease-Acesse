import styled from "styled-components";

export const Container = styled.div`
    display: grid;
    width: calc(100vw - 65px);
    height: calc(100vh - var(--top-menu-size));
    gap: .5rem;
    padding: .5rem;
	grid-template-areas:
		"header header  header"
		"nav    view    view"
	;
`;

export const Header = styled.div`
    height: 100px;
    border: 1px solid blue;
    grid-area: header;

`;

export const Nav = styled.aside`
    height: calc(100vh - var(--top-menu-size) - 100px - 1rem);
    grid-area: nav;
    border: 5px solid black;
`;

export const View = styled.section`

    grid-area: view;
    border: 5px solid green;
`;
