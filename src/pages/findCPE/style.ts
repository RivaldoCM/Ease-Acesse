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
    padding: 1rem;
    border: 1px solid grey;
    border-radius: 1rem;

    div{
        justify-content: space-between;
        margin-top: .5rem;
    }

    div:last-child(){
        flex-direction: column;
    }
`;