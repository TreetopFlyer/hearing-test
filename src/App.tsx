import React, { useRef, useState } from "react";
import { render } from "react-dom";
import styled from "styled-components";
import Controls from "./Controls";
import * as Store from "./Store";
import { Button, } from "./Controls";
import Logo from "./logo.png";

import ChartFixed from "./Chart";

export const Select = styled.select`
    max-width: 500px;
    max-height: 30px;
    width:100%;
    box-shadow: inset 0px 3px 5px lightgrey;
    padding: 7px;
    color: #556b7e;
    border-radius: 6px;
    border: none;
    cursor: pointer;
`;

const Columns = styled.div`
display: flex;
justify-content: center;
background: rgb(255,255,255);
background: linear-gradient(0deg, rgba(255,255,255,1) 87%, #e2e2e2 100%);
font-size: 14px;
@media( max-width:1024px )
{
    flex-wrap: wrap;
}
`;

const ColumnLeft = styled.div`
width: 400px;
box-sizing: border-box;
padding: 20px;
@media( max-width:1024px )
{
    width:100%;
}
`;

const ColumnRight = styled.div`
flex: 1 1;
box-sizing: border-box;
max-width: 900px;
@media( max-width:1024px )
{
    min-height: 500px;
}
`;

const Header = styled.div`
display: flex;
justify-content: space-between;
align-items: baseline;
padding: 20px;
border-bottom: 1px solid #dfdfdf;
color: #555;
font-size: 14px;
font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
@media(max-width:1024px)
{
    justify-content: center;
    flex-direction: column;
    gap: 15px;

    select
    {
        order: 3;
    }
}
`;

const TestOverview = ({test, active, open, toggle}:{test:Store.Test, active:boolean, open:boolean, toggle:()=>void}) =>
{
    const {State} = Store.Consume();
    const score = Store.useScore(State, test);
    const hasStarted = score.Total.Complete != 0;
    const label = active&&!open ? "Change" : (hasStarted ? "Continue" : "Start");
    return <div>
        <h3>{test.Name}</h3>
        { hasStarted && <>
            <p>Progress: {score.Total.Complete} of {score.Total.Total}</p>
            <p>Accuracy: {score.Total.Points} out of 100</p>
        </>}
        <button onClick={toggle}>{ label } Test</button>
    </div>;
}

const App = () =>
{
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

    const {State, Dispatch}:Store.Binding = Store.Consume();
    const current = Store.useCurrent(State);
    const [menuGet, menuSet] = useState(false);

    return <div>
        <Header>
            <span><img style={{maxWidth:"200px"}} src={Logo}/></span>
            <Select onChange={ e=>{ Dispatch(Store.Actions.Test, parseInt(e.target.value)); e.target.blur(); } } value={State.Test}>
                { State.List.map( (t:Store.Test, i:number)=> <option value={i}>{ t.Name }</option> ) }
            </Select>
            <div>
                <a     ref={refSave} style={{display:"none"}}  />
                <input ref={refLoad} style={{display:"none"}} onInput={()=>handleLoad()}type="file"></input>
                <Button onClick={()=>handleSave()}>Save Session</Button>&nbsp;
                <Button onClick={()=>refLoad.current.click()}>Load Session</Button>
            </div>
        </Header>
        {
            menuGet && <>
                <h3>Select Test:</h3>
                {
                    State.List.map( (t, i)=><TestOverview test={t} active={t==current.Test} open={menuGet} toggle=
                    {
                        ()=>
                        {
                            Dispatch(Store.Actions.Test, i);
                            menuSet(false);
                        }
                    }
                    />)
                }
            </>
        }
        {
            !menuGet && <>
                <h3>Current Test:</h3>
                <TestOverview test={current.Test} active={true} open={menuGet} toggle={()=>menuSet(true)}/>
            </>
        }
        <Columns>
            <ColumnLeft>
                <Controls/>
            </ColumnLeft>
            <ColumnRight>
                <ChartFixed/>
            </ColumnRight>
        </Columns>
    </div>
}

render(<Store.Provide><App/></Store.Provide>, document.querySelector("#app"));