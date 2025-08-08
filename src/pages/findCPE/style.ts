import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .cpe{
        ul{
            width: 100%;

            li{
                width: inherit;
                display: flex;
                margin: 1rem;
            }
        }
    }
`;

export const CPE = styled.div`
    display: flex;
    flex-direction: column;
    width: inherit;
    background-color:aliceblue;
    padding: 1rem;
    border-radius: .5rem;
    box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.2);
    
    div{
        justify-content: space-between;
        margin-top: .5rem;
    }
`;