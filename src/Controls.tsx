import React from "react";
import * as Store from "./Store";
import styled from "styled-components";
import Frequency from "./Frequency";

enum DrawStyle { Light, Normal, Intense };

const Rule = styled.div`
    position: absolute;
    left: 0;
    width: 100%;
    height: 0;
    border-top: 1px dashed black;
    border-top: ${ (props:{look:DrawStyle}):string =>
    {
        switch(props.look)
        {
            case DrawStyle.Light:
                return "1px solid #ddd";
            case DrawStyle.Normal:
                return "1px solid black";
            case DrawStyle.Intense:
                return "2px solid red";
        }
    }
    };
`;

const Label = styled.div`
    position: absolute;
    right: 100%;
    text-align: right;
    line-height: 0;
    font-size: 10px;
`;

export default () =>
{
    const {State, Dispatch, Handler}:Store.Binding = Store.Consume();
    const currentTest:Store.Test = State.List[State.Test];
    const currentFreq:Store.Frequency = currentTest.Plot[State.Freq];

    let stride:number = 10;
    let start:number = Math.floor(currentTest.Clip[0]/stride)*stride;
    let stop:number = Math.floor(currentTest.Clip[1]/stride)*stride;
    let lines = [];
    for(let i=start; i<=stop; i+=stride)
    {
        lines.push(<Rule style={{top: `${(i-start)/(stop-start)*100}%`}} look={ i==0 ? DrawStyle.Normal : DrawStyle.Light}><Label>{i}</Label></Rule>)
    }

    return <div>

        <dl>
            <dt>test select</dt>
            <select onChange={ Handler(Store.Actions.Test) } value={State.Test}>
                { State.List.map( (t:Store.Test, i:number)=> <option value={i}>{ t.Name }</option> ) }
            </select>
        </dl>

        <div style={{ display:"flex", position:"relative", width:"500px", height:"300px", margin:"20px"}}>
            { lines }
            { <Rule look={DrawStyle.Intense} style={{top: `${
                (State.dBHL - currentTest.Clip[0])/(currentTest.Clip[1] - currentTest.Clip[0])*100
            }%`}}/> }
            { currentTest.Plot.map( (f:Store.Frequency, i:number)=><Frequency freq={f} clip={currentTest.Clip} active={f == currentFreq} sample={false} answer={true} /> )}
        </div>

        <dl>
            <dt>Channel</dt>
            <dd>{ State.Chan == 1 ? "Right" : "Left" }</dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.Chan, State.Chan-1)}>L</button>
                <input type="range" min={0} max={1} value={State.Chan} onChange={Handler(Store.Actions.Chan)}/>
                <button onClick={()=>Dispatch(Store.Actions.Chan, State.Chan+1)}>R</button>
            </dd>
        </dl>
        <dl>
            <dt>Frequency</dt>
            <dd>{ currentFreq.Hz } Hz</dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.Freq, State.Freq-1)}>-</button>
                <input type="range" min="0" max={currentTest.Plot.length-1} value={State.Freq} onChange={Handler(Store.Actions.Freq)}/>
                <button onClick={()=>Dispatch(Store.Actions.Freq, State.Freq+1)}>+</button>
            </dd>
        </dl>
        <dl>
            <dt>Stimulus</dt>
            <dd>{ State.dBHL } dBHL</dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL-5)}>-</button>
                <input type="range" min={currentTest.Clip[0]} max={currentTest.Clip[1]} value={State.dBHL} onChange={Handler(Store.Actions.dBHL)}/>
                <button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL+5)}>+</button>
            </dd>
        </dl>
        <dl>
            <dt>Mark Chart</dt>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.Mark, 1)}>Accept</button>
                <button onClick={()=>Dispatch(Store.Actions.Mark, 0)}>No Response</button>
            </dd>
        </dl>
        

    </div>;
}