import styled from "styled-components";


export const Thead = styled.thead`
    background-color: #e4f2f5;
    font-family: "Roboto", sans-serif;
    color: grey;
    padding: 1%;
    width: 20%;
    height: 100%;
`;  

export const WidgetWrapper = styled.div`
  padding: 1%;
  height: 100%;
  width: 70%;
  background-color: #FFFFFF;
  margin: 0 auto;
  top: 10%;
`;

export const TD = styled.td`
 padding: 1%;
 justify-content: center;
 align-items: center;
 width: 150px;
 text-align: center;
`;

export const TR = styled.tr`
  border-bottom: 1px solid #CCCCCC;
  height: 10px;
`;

export const Table = styled.table`
  border-collapse: collapse;
  padding: 1%;
  font-size: 15px;
  height: 400px;
  mid-width: 400px;

  width: 100%;
`;

export const PagingWrapper = styled.div`
  display: flex;
  float: right;
  margin-right: 3%;
  align-items: flex-end;
  height: 20px;

`;