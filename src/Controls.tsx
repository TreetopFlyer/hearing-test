import React, { useState, useEffect, useMemo } from "react";
import * as Store from "./Store";
import styled, { keyframes } from "styled-components";
import Stepper from "./Stepper";

const BlinkAnim = keyframes`
    0% { opacity: 0;}
   10% { opacity: 1;}
  100% { opacity: 0;}
`;

const Blink = styled.div`
    animation: ${BlinkAnim} 4s linear;
    animation-fill-mode: both;
`;

const DL = styled.dl`
position: relative;
text-align: center;
font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
margin: 20px 0 30px 0;
user-select: none;
dt
{
    text-align: center;
    font-weight: 900;
}
dd
{
    display: flex;
    margin: 0;
    text-align: center;
    justify-content: center;
}
button
{
    flex: 1;
}
input[type='range']
{
    width:100%;
}
`;


const dl = {
Step: styled.dl`
    display: flex;
    align-items: center;
    gap: 5px;

    color: #333333;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

    dt
    {
        
    }

    dd
    {
        margin: 0;
    }
    dd.Label
    {
        width: 100%;
        text-align: right;
        padding-right: 5px;
    }

    button
    {
        appearance: none;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 30px;
        background: #333333;
    }
    svg
    {
            width: 10px;
        height: 10px;
    }
    line
    {
        stroke: #dddddd;
        stroke-width: 2px;
    }
`
};
    
export default () =>
{
    const {State, Dispatch, Handler}:Store.Binding = Store.Consume();
    const currentTest:Store.Test = State.List[State.Test];
    const currentFreq:Store.Frequency = currentTest.Plot[State.Freq];
    const currentChan:Store.SamplePair = State.Chan == 0 ? currentFreq.AL : currentFreq.AR;

    const [askGet, askSet] = useState(0);
    const [responseGet, responseSet] = useState(0);

    useEffect(()=>{
        let timer:number | undefined = undefined;
        if(askGet == 1)
        {
            responseSet(State.dBHL - currentChan.Answer[0]);
            timer = setTimeout(()=>{askSet(2);}, 1000);
        }
        return () => clearTimeout(timer);
    }, [askGet])

    return <div>
        <DL>
            <dt>Hearing Condition</dt>
            <dd>
                <select onChange={ Handler(Store.Actions.Test) } value={State.Test}>
                    { State.List.map( (t:Store.Test, i:number)=> <option value={i}>{ t.Name }</option> ) }
                </select>
            </dd>
        </DL>
        <DL>
            <dt><span>⮂</span> Channel</dt>
            <dd><span>{ State.Chan == 1 ? "Right" : "Left" }</span></dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.Chan, State.Chan-1)}>L</button>
                <input type="range" min={0} max={1} value={State.Chan} onChange={Handler(Store.Actions.Chan)}/>
                <button onClick={()=>Dispatch(Store.Actions.Chan, State.Chan+1)}>R</button>
            </dd>
        </DL>
        <dl.Step>
            <dt>Stimulus</dt>
            <dd className="Label"><strong>{ State.dBHL }</strong> <span>dBHL</span></dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL-5)}>
                    <svg>
                        <line x1="0%" y1="50%" x2="100%" y2="50%"/>
                    </svg>
                </button>
            </dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL+5)}>
                    <svg>
                        <line x1="0%" y1="50%" x2="100%" y2="50%"/>
                        <line y1="0%" x1="50%" y2="100%" x2="50%"/>
                    </svg>
                </button>
            </dd>
        </dl.Step>
        <dl.Step>
            <dt>Frequency</dt>
            <dd className="Label"><strong>{ currentFreq.Hz }</strong> <span>Hz</span></dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.Freq, State.Freq-1)}>
                    <svg>
                        <line x1="0%" y1="50%" x2="100%" y2="50%"/>
                    </svg>
                </button>
            </dd>
            <dd>
                <button onClick={()=>Dispatch(Store.Actions.Freq, State.Freq+1)}>
                    <svg>
                        <line x1="0%" y1="50%" x2="100%" y2="50%"/>
                        <line y1="0%" x1="50%" y2="100%" x2="50%"/>
                    </svg>
                </button>
            </dd>
        </dl.Step>
        <DL>
            <dt>🎧 Play Tone</dt>
            <dd>
                { (askGet == 1) && <span>Playing...</span>}
                { (askGet == 2) && <Blink>{responseGet > 0 ? "👍 Response!" : "👎 No Response."}</Blink>}
            </dd>
            <dd>
                <button onClick={()=>askSet(1)} disabled={askGet == 1}> Pulse</button>
                <button onClick={()=>askSet(1)} disabled={askGet == 1}> Continuous</button>
            </dd>
        </DL>
        <DL>
            <dt>✍ Mark Chart</dt>
            <dd><span>{ State.Chan == 1 ? "Right" : "Left" } ear</span> / <span>{ currentFreq.Hz } Hz</span> / <span>{ State.dBHL } dBHL</span></dd>
            <dd>
                <button onClick={()=>{Dispatch(Store.Actions.Mark, 1)}}>Accept</button>
                <button onClick={()=>{Dispatch(Store.Actions.Mark, 0)}}>No Response</button>
                <button onClick={()=>{Dispatch(Store.Actions.Mark, -1)}} disabled={!currentChan.Sample}>Erase</button>
            </dd>
        </DL>
        <DL>
            <dt>Show on Chart</dt>
            <dd>
                <button onClick={()=>{Dispatch(Store.Actions.Show, 0)}}>
                    <input type="radio" name="display" id="show-samples" value={0} checked={State.Show == 0} onChange={Handler(Store.Actions.Show)}/>
                    Your Samples
                </button>
                <button onClick={()=>{Dispatch(Store.Actions.Show, 1)}}>
                    <input type="radio" name="display" id="show-answers" value={1} checked={State.Show == 1} onChange={Handler(Store.Actions.Show)}/>
                    Test Answers
                </button>
            </dd>
            <dd>
                <p>
                    <input type="checkbox" value={1-State.VisX} checked={State.VisX == 1} onChange={Handler(Store.Actions.VisX)} id="show-x"/><label for="show-x">Stimulus Line</label>
                </p>
            </dd>
            <dd>
                <p>
                    <input type="checkbox" value={1-State.VisY} checked={State.VisY == 1} onChange={Handler(Store.Actions.VisY)} id="show-y"/><label for="show-y">Frequency Line</label>
                </p>
            </dd>
        </DL>
    </div>;
}