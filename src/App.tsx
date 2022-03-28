import React, { useRef } from "react";
import { render } from "react-dom";
import styled from "styled-components";
import Controls from "./Controls";
import Chart from "./Chart";
import * as Store from "./Store";
import { Button, Select } from "./Controls";

const Columns = styled.div`
display: flex;
background: rgb(255,255,255);
background: linear-gradient(0deg, rgba(255,255,255,1) 87%, #e2e2e2 100%);
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
display: flex;
justify-content: space-between;
padding: 20px;
border-bottom: 1px solid #dfdfdf;
color: #555;
font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
`;

const App = () =>
{
    const {State, Dispatch, Handler}:Store.Binding = Store.Consume();

    const refSave = useRef(null);
    const handleSave = () =>
    {
        refSave.current.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(JSON.stringify(State)));
        refSave.current.setAttribute('download', "aud.json");
        refSave.current.click();
    };

    const refLoad = useRef(null);
    const handleLoad = () =>
    {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            Dispatch(Store.Actions.Load, JSON.parse(reader.result.toString()));
        });
        reader.readAsText(refLoad.current.files[0]);
    };

    return <div>
        <Header>
            <strong>EarmarkHC Audiogram</strong>
            <Select onChange={ Handler(Store.Actions.Test) } value={State.Test}>
                { State.List.map( (t:Store.Test, i:number)=> <option value={i}>{ t.Name }</option> ) }
            </Select>
            <div>
                <a     ref={refSave} style={{display:"none"}}  />
                <input ref={refLoad} style={{display:"none"}} onInput={()=>handleLoad()}type="file"></input>
                <Button onClick={()=>handleSave()}>Save Session</Button>&nbsp;
                <Button onClick={()=>refLoad.current.click()}>Load Session</Button>
            </div>
        </Header>
        <Columns>
            <ColumnLeft>
                <Controls/>
            </ColumnLeft>
            <ColumnRight>
                <Chart/>
            </ColumnRight>
        </Columns>
    </div>
}

render(<Store.Provide><App/></Store.Provide>, document.querySelector("#app"));