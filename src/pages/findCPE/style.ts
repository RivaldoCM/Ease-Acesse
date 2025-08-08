import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .cpe{
        li{
            display: flex;
            gap: 1rem;
            width: 100%;
            background-color:aliceblue;
            padding: 1rem;
            border-radius: .5rem;
            box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.2);        
        }
    }
`;