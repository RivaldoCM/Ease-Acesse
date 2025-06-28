import styled from "styled-components";

export const Filter = styled.form`
    flex-direction: column;
    justify-content: start;
    width: 100%;
    height: auto;
    padding: 1rem;
`

export const FormFilter = styled.div`
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    > div { margin: 0 .3rem; }
`

export const DateOptions = styled.div`
    padding-bottom: 8px; //ISSO EXISTE POIS OS DATE FIELDS TEM ESSE VALOR HERDADO DO MUI

`
export const ResponsiveTable = styled.div`
    overflow-x: auto;
`

export const FilterButtons = styled.div`

    > button {
        margin: .3rem;
    }
`

export const TableInsideTable = styled.div`
    margin: 1rem;

    table {
        width: 30%;
        border-collapse: collapse;
        background-color: #ffffff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    thead { background-color: #e0e0e0; }

    th, td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    tbody tr:nth-child(even) { background-color: #f9f9f9; }
    tbody tr:hover{ background-color: #f1f1f1; }
    th { color: #333; font-weight: bold; }
`