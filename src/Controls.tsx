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
    gap: 5px 5px;
    padding: 5px;
    border-radius: 10px;
    color: #333333;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

    dt
    {
        
    }

    dd
    {
        margin: 0;
        text-align: right;
    }
    .Wide
    {
        width: 100%;
    }

    button
    {
        position: relative;
        display: inline-block;
        appearance: none;
        min-width: 30px;
        min-height: 30px;
        padding: 5px 10px 5px 10px;
        border: none;
        border-radius: 10px;
        background: #2a88f3;
        cursor: pointer;
        color: white;
        font-weight: 600;
        transition: all 0.4s;
    }
    button[disabled], button[disabled]:hover
    {
        cursor: default;
        transform: scale(0.8);
        background: #aaa;
    }
    button:hover
    {
        background: black;
    }

    button[data-active]
    {
        width:100%;
        padding-top: 8px;
        padding-bottom: 8px;
    }
    button[data-active]::before
    {
        content: " ";
        display: block;
        position: absolute;
        z-index: 20;
        top: 0;
        left: 50%;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        transform: translate(-5px, -10px);
        outline: 2px solid white;
        background: #555;
        opacity: 0;
        transition: all 0.4s;
    }
    button[data-active='true']::before
    {
        transform: translate(-5px, -6px);
        background: #ffa600ff;
        opacity: 1;
    }

    button span.blink
    {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        animation: ${ keyframes`
            0% { background: #ffa600ff; }
          100% { background: #ffa60000; }
        `} 0.4s linear;
        animation-fill-mode: both;
    }

    svg
    {
        z-index: 10;
        position: relative;
        width: 10px;
        height: 10px;
    }
    line
    {
        stroke: #dddddd;
        stroke-width: 2px;
    }
`,
Button: ( props:any ) =>
{
    const [showGet, showSet] = useState(-1);
    useEffect(()=>
    {
        let timer:number = showGet ? -1 : setTimeout(()=>{showSet(1)});
        return ()=>clearInterval(timer);
    }
    , [showGet]);

    return <button
        data-active={ props.active }
        disabled={ props.disabled || false }
        onClick={ (inEvent:any)=>{showSet(0);props.onClick(inEvent);}}>
        { props.children }
        { showGet > 0 && <span className="blink"/> }
    </button>;
}
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
        <dl.Step>
            <dt className="Wide">Channel</dt>
            <dd>
                <dl.Button active={State.Chan == 0} onClick={()=>Dispatch(Store.Actions.Chan, 0)}>Left</dl.Button>
            </dd>
            <dd>
                <dl.Button active={State.Chan == 1} onClick={()=>Dispatch(Store.Actions.Chan, 1)}>Right</dl.Button>
            </dd>
        </dl.Step>
        <dl.Step>
            <dt>Frequency</dt>
            <dd className="Wide"><strong>{ currentFreq.Hz }</strong> <span>Hz</span></dd>
            <dd>
                <dl.Button disabled={State.Freq == 0} onClick={()=>Dispatch(Store.Actions.Freq, State.Freq-1)}>
                    <svg>
                        <line x1="0%" y1="50%" x2="100%" y2="50%"/>
                    </svg>
                </dl.Button>
            </dd>
            <dd>
                <dl.Button disabled={State.Freq == currentTest.Plot.length-1} onClick={()=>Dispatch(Store.Actions.Freq, State.Freq+1)}>
                    <svg>
                        <line x1="0%" y1="50%" x2="100%" y2="50%"/>
                        <line y1="0%" x1="50%" y2="100%" x2="50%"/>
                    </svg>
                </dl.Button>
            </dd>
        </dl.Step>
        <dl.Step>
            <dt>Stimulus</dt>
            <dd className="Wide"><strong>{ State.dBHL }</strong> <span>dBHL</span></dd>
            <dd>
                <dl.Button disabled={State.dBHL == currentTest.Clip[0]} onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL-5)}>
                    <svg>
                        <line x1="0%" y1="50%" x2="100%" y2="50%"/>
                    </svg>
                </dl.Button >
            </dd>
            <dd>
                <dl.Button disabled={State.dBHL == currentTest.Clip[1]} onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL+5)}>
                    <svg>
                        <line x1="0%" y1="50%" x2="100%" y2="50%"/>
                        <line y1="0%" x1="50%" y2="100%" x2="50%"/>
                    </svg>
                </dl.Button>
            </dd>
        </dl.Step>
        <dl.Step>
            <dt>Tone</dt>
            <dd class="Wide">
                { (askGet == 1) && <span>Playing...</span>}
                { (askGet == 2) && <Blink>{responseGet > 0 ? "👍 Response!" : "👎 No Response."}</Blink>}
            </dd>
            <dd>
                <dl.Button onClick={()=>askSet(1)} disabled={askGet == 1}> Play</dl.Button>
            </dd>
        </dl.Step>
        <dl.Step>
            <dt>Mark</dt>
            <dd><span>{ State.Chan == 1 ? "Right" : "Left" } ear</span> / <span>{ currentFreq.Hz } Hz</span> / <span>{ State.dBHL } dBHL</span></dd>
        </dl.Step>
        <dl.Step>
            <dd>
                <dl.Button onClick={()=>{Dispatch(Store.Actions.Mark, 1)}}>Accept</dl.Button>
            </dd>
            <dd>
                <dl.Button onClick={()=>{Dispatch(Store.Actions.Mark, 0)}}>No Response</dl.Button>
            </dd>
            <dd>
                <dl.Button onClick={()=>{Dispatch(Store.Actions.Mark, -1)}} disabled={!currentChan.Sample}>Erase</dl.Button>
            </dd>
        </dl.Step>
        <dl.Step>
            <dt>Display</dt>
            <dd>
                <dl.Button active={State.Show == 0} onClick={()=>{Dispatch(Store.Actions.Show, 0)}}>Your Samples</dl.Button>
            </dd>
            <dd>
                <dl.Button active={State.Show == 1} onClick={()=>{Dispatch(Store.Actions.Show, 1)}}>Test Answers</dl.Button>
            </dd>
        </dl.Step>
    </div>;
}