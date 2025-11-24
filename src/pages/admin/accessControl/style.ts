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

interface AccordionProps {
    open: boolean;
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
  background: #fffaf5;
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  overflow: auto;

  ::-webkit-scrollbar {
    display: none;
  }

  header {
    position: sticky;
    top: 0;
    width: 100%;
    height: 8%;
    border-bottom: 2px solid grey;
    background: inherit;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    font-family: "Itim", cursive !important;
    font-weight: 600;
    color: #1a1a1a;
    z-index: 10;
  }

  > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0.5rem;
  }
`;

/* ---------------- MAIN ---------------- */
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
    border-radius: .8rem;
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
        }
    }
    
    > div:nth-child(3){
        grid-area: table;
        
        > div:last-of-type{
            overflow: scroll;
        }
    }
`;

/* ---------------- CARD DEPARTMENT ---------------- */
export const CardDepartment = styled.div<isSelected>`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    background: ${({ isSelected }) => (isSelected ? "#fff2eb" : "#ffffff")};
    border: 2px solid ${({ isSelected }) => (isSelected ? "#ff9f68" : "#d9d9d9")};
    border-radius: 0.8rem;
    margin: 0.5rem 0;
    box-shadow: ${({ isSelected }) =>
        isSelected
        ? "rgba(0,0,0,0.15) 0px 4px 10px"
        : "rgba(0,0,0,0.08) 0px 2px 6px"};
    transition: all 0.25s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 10px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        min-height: 60px;
        padding: 0.6rem 1rem;
        border-radius: ${({ isExpanded }) =>
        isExpanded ? "0.8rem 0.8rem 0 0" : "0.8rem"};
        background: ${({ isSelected }) => (isSelected ? "#fffaf5" : "#fefefe")};
        border-bottom: ${({ isExpanded }) =>
        isExpanded ? "1px solid #ddd" : "none"};
        transition: background 0.25s ease;

        > div:nth-of-type(1) {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 70%;

            > div:first-of-type p {
                font-family: "Itim", cursive !important;
                font-size: 1rem;
                font-weight: 600;
                color: #333;
            }

            > div:last-of-type p {
                padding: 3px 10px;
                font-size: 12px;
                font-weight: 500;
                color: white;
                border-radius: 1rem;
                background: #4d4d4d;
            }
        }

        > div:nth-of-type(2) {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 20%;

            button {
                margin-left: 0.3rem;
                color: #4d4d4d;
                transition: all 0.2s;

                &:hover {
                    color: #ff7a2f;
                }
            }
        }
    }

    .accordion {
        overflow: hidden;
        max-height: ${({ isExpanded }) => (isExpanded ? "1000px" : "0")};
        transition: max-height 0.4s ease-in-out;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        padding: ${({ isExpanded }) => (isExpanded ? "0.8rem 1rem" : "0 1rem")};
        background: #fffdfb;
        border-top: 1px solid #eee;
        border-radius: 0 0 0.8rem 0.8rem;

        .node {
            position: relative;
            display: flex;
            align-items: center;
            margin-left: 24px;
            margin-bottom: 8px;

            .line-vertical {
                position: absolute;
                left: -12px;
                width: 2px;
                height: 100%;
                background-color: #ffd4b8;
            }

            .line-down {
                position: absolute;
                left: -12px;
                bottom: -16px;
                width: 2px;
                height: 16px;
                background-color: #ffd4b8;
            }

            .box {
                position: relative;
                background: #ffe8d6;
                color: #a34a00;
                font-weight: 600;
                border-radius: 8px;
                padding: 6px 12px;
                margin: 4px 0;
                transition: background 0.25s ease, color 0.25s ease;

                &:hover {
                    background: #ffd7b8;
                    color: #7a3500;
                }

                &::before {
                content: "";
                position: absolute;
                left: -12px;
                top: 50%;
                transform: translateY(-50%);
                width: 12px;
                height: 2px;
                background-color: #ffd4b8;
                }
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

/* ---------------- MODALS ---------------- */
export const EditUserModal = styled.div`
    width: 650px;
    > div:first-child {
        width: inherit;
        text-align: end;
    }

    div:nth-child(2) {
        > div{
            justify-content: space-between;
            width: 100%;
            margin-bottom: .2rem;
        }

        > div:nth-child(4){
            padding: .5rem;
            border-radius: 12px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
        }
    }
`

export const AddPageModal = styled.div`
    width: 400px;
    margin: 20px auto;
    font-family: Arial, sans-serif;

    //CADA ITEM
    > div {
        border: 1px solid #e0e0e0;
        margin-bottom: 12px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        transition: all 0.3s ease;

        > div:first-child {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #ffffff;
            padding: 14px 18px;
            cursor: pointer;
            font-weight: 600;
            color: #333;

            &:hover {
                background: #f9f9f9;
            }

            > div {
                display: flex;
                align-items: center;
                font-size: 20px;
                color: #666;
            }
        }

    }
`;

// Conteúdo do accordion
export const AccordionContent = styled.div<AccordionProps>`
    max-height: ${({ open }) => (open ? "300px" : "0")};
    overflow: hidden;
    transition: max-height 0.35s ease, padding 0.35s ease;
    padding: ${({ open }) => (open ? "12px 18px" : "0 18px")};
    background: #fafafa;

    > label {
        display: flex;
        align-items: center;
        margin: 8px 0;
        font-size: 14px;
        color: #444;

        input {
            margin-right: 10px;
            accent-color: #4a90e2;
        }
    }
`;

