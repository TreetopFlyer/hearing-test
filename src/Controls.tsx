import React, { useState, useEffect, useMemo } from "react";
import * as Store from "./Store";
import styled, { keyframes } from "styled-components";
import Chart from "./Chart";


const BlinkAnim = keyframes`
from { opacity: 1; }
  to { opacity: 0; }
`;

const Blink = styled.div`
    animation: ${BlinkAnim} 4s linear;
    animation-fill-mode: both;
`;

export default () =>
{
    const {State, Dispatch, Handler}:Store.Binding = Store.Consume();
    const currentTest:Store.Test = State.List[State.Test];
    const currentFreq:Store.Frequency = currentTest.Plot[State.Freq];
    const currentPair:Store.SamplePair = State.Chan == 0 ? currentFreq.AL : currentFreq.AR;

    const [askGet, askSet] = useState(0);
    const [responseGet, responseSet] = useState(0);

    useEffect(()=>{
        let timer:number | undefined = undefined;
        if(askGet == 1)
        {
            responseSet(State.dBHL - currentPair.Answer[0]);
            timer = setTimeout(()=>{askSet(2);}, 1000);
        }
        return () => clearTimeout(timer);
    }, [askGet])

    return <div>

        <Chart/>

        <dl>
            <dt>test select</dt>
            <select onChange={ Handler(Store.Actions.Test) } value={State.Test}>
                { State.List.map( (t:Store.Test, i:number)=> <option value={i}>{ t.Name }</option> ) }
            </select>
        </dl>

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
            <dt>Stimulus</dt>
            <dd>{ State.dBHL } dBHL</dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL-5)}>-</button>
                <input type="range" min={currentTest.Clip[0]} max={currentTest.Clip[1]} value={State.dBHL} onChange={Handler(Store.Actions.dBHL)}/>
                <button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL+5)}>+</button>
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
            <dt>Play Tone</dt>
            <dd>
                { (askGet != 1) && <button onClick={()=>askSet(1)}>ask</button>}
                { (askGet == 1) && <p>waiting...</p>}
                { (askGet == 2) && <Blink>{responseGet > 0 ? "Heard it" : "Can't hear it"}</Blink>}
            </dd>
        </dl>
        <dl>
            <dt>Mark Chart</dt>
            <dd>
                <button onClick={()=>{Dispatch(Store.Actions.Mark, 1)}}>Accept</button>
                <button onClick={()=>{Dispatch(Store.Actions.Mark, 0)}}>No Response</button>
            </dd>
        </dl>
        <dl>
            <dt>Display</dt>
            <dd>{ State.Show }</dd>
            <dd>
                <button onClick={()=>{Dispatch(Store.Actions.Show, 0)}}>Your Samples</button>
                <button onClick={()=>{Dispatch(Store.Actions.Show, 1)}}>Test Answers</button>
            </dd>
        </dl>

    </div>;
}