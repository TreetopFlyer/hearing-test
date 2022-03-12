import React from "react";
import * as Store from "./Store";
import styled from "styled-components";
import Frequency from "./Frequency";

export default () =>
{
    const {State, Dispatch, Handler}:Store.Binding = Store.Consume();
    const currentTest:Store.Test = State.List[State.Test];
    const currentFreq:Store.Frequency = currentTest.Plot[State.Freq];

    return <div>

        <dl>
            <dt>test select</dt>
            <select onChange={ Handler(Store.Actions.Test) } value={State.Test}>
                { State.List.map( (t:Store.Test, i:number)=> <option value={i}>{ t.Name }</option> ) }
            </select>
        </dl>

        <div style={{ display:"flex", width:"500px", height:"200px", border:"1px solid black"}}>
            { currentTest.Plot.map( f=><Frequency freq={f} clip={currentTest.Clip} sample={false} answer={true} /> )}
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