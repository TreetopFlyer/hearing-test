import React from "react";
import * as Store from "./Store";
import styled from "styled-components";
import Frequency from "./Frequency";

export default () =>
{
    const {State, Dispatch}:Store.Binding = Store.Consume();

    const currentTest:Store.Test = State.List[State.Test];
    const currentFreq:Store.Frequency = currentTest.Freq[State.Freq];

    const handleSelect = (event:any) =>
    {
        let index:number = parseInt(event.target.value) || 0;
        Dispatch(Store.Actions.Test, index);
    };

    const inputNumber = (e:{target:{value:"string" | "number"}}):number => parseInt(e.target.value) || 0;

    return <div>

        <dl>
            <dt>test select</dt>
            <select onChange={ handleSelect } value={State.Test}>
                { State.List.map( (t:Store.Test, i:number)=> <option value={i}>{ t.Name }</option> ) }
            </select>
        </dl>

        <div style={{ display:"flex", width:"500px", height:"200px", border:"1px solid black"}}>
            { currentTest.Freq.map( f=><Frequency freq={f} sample={false} answer={true} /> )}
        </div>

        <dl>
            <dt>Channel</dt>
            <dd>{ State.Chan == 1 ? "Right" : "Left" }</dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.Chan, State.Chan-1)}>L</button>
                <input type="range" min={0} max={1} value={State.Chan} onChange={(e)=>{Dispatch(Store.Actions.Chan, inputNumber(e));}}/>
                <button onClick={()=>Dispatch(Store.Actions.Chan, State.Chan+1)}>R</button>
            </dd>
        </dl>
        <dl>
            <dt>Frequency</dt>
            <dd>{ currentFreq.Hz }</dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.Freq, State.Freq-1)}>-</button>
                <input type="range" min="0" max={currentTest.Freq.length-1} value={State.Freq} onChange={(e)=>Dispatch(Store.Actions.Freq, inputNumber(e))}/>
                <button onClick={()=>Dispatch(Store.Actions.Freq, State.Freq+1)}>+</button>
            </dd>
        </dl>
        <dl>
            <dt>Stimulus</dt>
            <dd>{ State.dBHL }</dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL-5)}>-</button>
                <input type="range" min={-10} max={130} step={10} value={State.dBHL} onChange={(e)=>Dispatch(Store.Actions.dBHL, inputNumber(e))}/>
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