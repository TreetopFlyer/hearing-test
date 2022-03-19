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
            <Mark style={{marginLeft:100, stroke:"blue"}} channel={0} response={false} />
            <Mark style={{marginLeft:100, stroke:"blue"}} channel={1} response={false} />
            <Mark style={{marginLeft:100, stroke:"red"}} channel={1} response={true} />
            <Mark style={{marginLeft:100, stroke:"red"}} channel={0} response={true} />
            <Controls/>
        </ColumnLeft>
        <ColumnRight>
            <Chart/>
        </ColumnRight>
    </Layout>
</Store.Provide>, document.querySelector("#app"));