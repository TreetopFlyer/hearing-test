import React from "react";
import { render } from "react-dom";
import styled from "styled-components";
import Controls from "./Controls";
import Chart from "./Chart";
import * as Store from "./Store";

const Layout = styled.div`
display: flex;
`;

const ColumnLeft = styled.div`
width: 400px;
box-sizing: border-box;
padding: 20px;
`;

const ColumnRight = styled.div`
flex: 1 1;
box-sizing: border-box;
padding: 20px;
`;

const Header = styled.div`
padding: 20px;
background: black;
color: white;
font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
`;

render(
<Store.Provide>
    <Header>Hearing Test</Header>
    <Layout>
        <ColumnLeft>
            <Controls/>
        </ColumnLeft>
        <ColumnRight>
            <Chart/>
        </ColumnRight>
    </Layout>
</Store.Provide>, document.querySelector("#app"));