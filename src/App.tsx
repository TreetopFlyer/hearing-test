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
width: 300px;
box-sizing: border-box;
padding: 20px;
`;

const ColumnRight = styled.div`
flex: 1 1;
box-sizing: border-box;
padding: 20px;
`;

import Mark from "./Mark";

render(
<Store.Provide>
    <Layout>
        <ColumnLeft>
            <Controls/>
        </ColumnLeft>
        <ColumnRight>
            <Chart/>
        </ColumnRight>
    </Layout>
</Store.Provide>, document.querySelector("#app"));