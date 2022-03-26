import React, { useState, useEffect, useMemo } from "react";
import * as Store from "./Store";
import styled, { keyframes, css } from "styled-components";
import Stepper from "./Stepper";

const UI = styled.div`

display: flex;
flex-direction: column;
gap: 15px 5px;

dl, dt, dd
{
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    margin: 0;
    padding: 0;
}

dl
{
    display: flex;
    flex-direction: column;
    gap: 0;

    border-radius: 5px;

    overflow: hidden;
    background: #eee;
    background: rgb(172,172,172);
    background: linear-gradient(159deg, #ececec 0%, #e9e9e9 36%, #dfdfdf 37%, #ececec 100%);
    
    box-shadow: 0px 2px 5px #969696;

    text-align: center;

    dt
    {
        padding: 5px;
        border-top: 1px solid white;
        border-bottom: 1px solid #ccc;

        background: rgb(0 0 0 / 7%);

        color: #444444;
        font-weight: 900;
        text-transform: uppercase;
    }

    dl
    {
        flex-direction: row;
        align-items: center;
        gap: 5px;

        border-left: none;
        border-right: none;
        border-top: 1px solid white;
        border-bottom: 1px solid #ccc;

        border-radius: 3px;
        background: none;
        box-shadow: none;

        color: #333333;
        font-weight: 500;
        text-align: left;

        dt
        {
            width: 100%;

            padding: 10px;
            border: none;

            background: none;

            color: #666666;
            font-weight: 500;
            text-transform: none;
        }

        dd
        {
            display: flex;
            flex-direction: row;
            gap: 5px;
            padding: 5px;
        }
    }
}
`;


const Select = styled.select`
    padding: 7px;
    color: #556b7e;
    border-radius: 6px;
    border: none;
    cursor: pointer;
`;
const _Button = ( props:any ) =>
{
    const [showGet, showSet] = useState(-1);
    useEffect(()=>
    {
        let timer:number = showGet ? -1 : setTimeout(()=>{showSet(1)});
        return ()=>clearInterval(timer);
    }
    , [showGet]);

    return <button
        className={ props.className }
        data-active={ props.active }
        disabled={ props.disabled || false }
        onClick={ (inEvent:any)=>{showSet(0);props.onClick(inEvent);}}>
        { props.children }
        { showGet > 0 && <span className="blink"/> }
    </button>;
};
const Button = styled(_Button)`

    box-shadow: rgb(0 0 0 / 33%) 0px -3px 0px inset, rgb(255 255 255 / 38%) 0px 3px 7px inset;
    position: relative;
    display: inline-block;
    appearance: none;
    min-height: 30px;
    padding: 5px 10px 5px 10px;
    border: none;
    border-radius: 10px;
    background: #49b378;
    cursor: pointer;
    color: white;
    font-weight: 600;
    transition: all 0.4s;

&[disabled], &[disabled]:hover
{
    cursor: default;
    transform: scale(0.95);
    background: #aaa;
}
&:hover
{
    background: black;
}

&[data-active]
{
    width:100%;
    padding-top: 8px;
    padding-bottom: 8px;
}
&[data-active]::before
{
    content: " ";
    display: block;
    position: absolute;
    z-index: 20;
    top: 0;
    left: 50%;
    width: 20px;
    height: 0px;
    border-radius: 10px;
    background: #ffa600;
    outline: 2px solid transparent;
    box-shadow: 0px 0px 0px #ffa600;
    transform: translate(-50%, -50%);
    transition: all 0.4s;
}
&[data-active='true']::before
{
    height: 5px;
    outline: 2px solid white;
    box-shadow: 0px 0px 5px white;
    opacity: 1;
}
/*
&[disabled][data-active='true'], &[disabled][data-active='true']:hover
{
    cursor: default;
    transform: scale(1);
    background: black;
}
*/

& span.blink
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
    stroke: #dddddd;
    stroke-width: 2px;
}
`;

const IconMinus = () => <svg>
    <line x1="0%" y1="50%" x2="100%" y2="50%"/>
</svg>;

const IconPlus = () => <svg>
    <line x1="0%" y1="50%" x2="100%" y2="50%"/>
    <line y1="0%" x1="50%" y2="100%" x2="50%"/>
</svg>;

const IconTriangle = () => <svg>
    <polygon points="0,0 10,5 0,10" fill="#ffffff" stroke="none" />
</svg>;

const Blink = styled.circle`
    animation: ${keyframes`
        0% { opacity: 0;}
        5% { opacity: 1;}
       50% { opacity: 1;}
      100% { opacity: 0;}`} 2s linear;
    animation-fill-mode: both;
`;
const Light = ( { on }:{ on:boolean } ) => <svg width="80" height="80" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle  fill="url(#metal)" cx="39" cy="40" r="35"/>
    <circle  fill="url(#metal)" cx="39.5" cy="39.5" r="29.5" transform="rotate(180 39.5 39.5)"/>
    <circle  fill="url(#metal)" cx="39" cy="40" r="27"/>
    <circle  fill="url(#backwall)"cx="39" cy="40" r="25"/>
    <ellipse fill="url(#clearcoat)" cx="39" cy="33" rx="20" ry="16"/>
    { on && <Blink fill="url(#light)" cx="39.5" cy="39.5" r="39.5"/> }
    <defs>
        <linearGradient id="metal" x1="39.5" y1="1" x2="39.5" y2="78" gradientUnits="userSpaceOnUse">
            <stop stop-color="#C4C4C4"/>
            <stop offset="1" stop-color="#F2F2F2"/>
        </linearGradient>
        <radialGradient id="backwall" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39 56) rotate(-90) scale(45.5 74.4907)">
            <stop stop-color="#AAAAAA"/>
            <stop offset="1"/>
        </radialGradient>
        <radialGradient id="clearcoat" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39 38.5) rotate(90) scale(50.5 71.9394)">
            <stop offset="0.0729167" stop-color="white" stop-opacity="0"/>
            <stop offset="0.78125" stop-color="white"/>
        </radialGradient>
        <radialGradient id="light" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39.5 39.5) rotate(90) scale(39.5)">
            <stop offset="0.234375" stop-color="white"/>
            <stop offset="0.5" stop-color="#80FF00" stop-opacity="0.662983"/>
            <stop offset="0.927083" stop-color="white" stop-opacity="0"/>
        </radialGradient>
    </defs>
</svg>
;


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
            timer = setTimeout(()=>{askSet(2);}, 1500 + Math.random()*1000);
        }
        return () => clearTimeout(timer);
    }, [askGet])

    return <UI>
        <dl>
            <dt>Session</dt>
            <dd>
                <dl>
                    <dt>Condition:</dt>
                    <dd>
                        <Select onChange={ Handler(Store.Actions.Test) } value={State.Test}>
                            { State.List.map( (t:Store.Test, i:number)=> <option value={i}>{ t.Name }</option> ) }
                        </Select>
                    </dd>
                </dl>
            </dd>
        </dl>

        <dl>
            <dt>Sound</dt>
            <dl>
                <dt>Channel:</dt>
                <dd>
                    <Button disabled={ State.Chan == 0 } active={State.Chan == 0} onClick={()=>Dispatch(Store.Actions.Chan, 0)}>Left</Button>
                    <Button disabled={ State.Chan == 1 } active={State.Chan == 1} onClick={()=>Dispatch(Store.Actions.Chan, 1)}>Right</Button>
                </dd>
            </dl>
            <dl>
                <dt>Frequency:</dt>
                <dd><strong>{ currentFreq.Hz }</strong> Hz</dd>
                <dd>
                    <Button disabled={State.Freq == 0} onClick={()=>Dispatch(Store.Actions.Freq, State.Freq-1)}>
                        <IconMinus/>
                    </Button>
                    <Button disabled={State.Freq == currentTest.Plot.length-1} onClick={()=>Dispatch(Store.Actions.Freq, State.Freq+1)}>
                        <IconPlus/>
                    </Button>
                </dd>
            </dl>
            <dl>
                <dt>Stimulus:</dt>
                <dd><strong>{ State.dBHL }</strong> dBHL</dd>
                <dd>
                    <Button disabled={State.dBHL == currentTest.Clip[0]} onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL-5)}>
                        <IconMinus/>
                    </Button >
                    <Button disabled={State.dBHL == currentTest.Clip[1]} onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL+5)}>
                        <IconPlus/>
                    </Button>
                </dd>
            </dl>
        </dl>

        <dl>
            <dt>Tone</dt>
            <dl>
                <dt>Response:</dt>
                <dd><Light on={ (askGet == 2) && (responseGet >= 0) }/></dd>
                <dd>
                    <Button onClick={()=>askSet(1)} disabled={askGet == 1}><IconTriangle/><br/>Present</Button>
                </dd>
            </dl>
            <dl>
                <dt>Method:</dt>
                <dd>
                    <Button disabled={State.Tone == 0} active={State.Tone == 0} onClick={()=>Dispatch(Store.Actions.Tone, 0)}>Pulsed</Button>
                    <Button disabled={State.Tone == 1} active={State.Tone == 1} onClick={()=>Dispatch(Store.Actions.Tone, 1)}>Continuous</Button>
                </dd>
            </dl>
        </dl>


        <dl>
            <dt>Mark:</dt>
            <dd><span><strong>{ State.Chan == 1 ? "Right" : "Left" }</strong> ear</span> / <span><strong>{ currentFreq.Hz }</strong> Hz</span> / <span><strong>{ State.dBHL }</strong> dBHL</span></dd>
            <dd>
                <Button disabled={State.Show == 1} onClick={()=>Dispatch(Store.Actions.Mark, 1)}>Accept</Button>
                <Button disabled={State.Show == 1} onClick={()=>Dispatch(Store.Actions.Mark, 0)}>No Response</Button>
            </dd>
            <dd>
                <Button onClick={()=>{Dispatch(Store.Actions.Mark, -1)}} disabled={!currentChan.Sample || State.Show == 1 }>Clear Threshold</Button>
            </dd>
        </dl>

        <dl>
            <dt>Display:</dt>
            <dd>
                <Button disabled={State.Show == 0} active={State.Show == 0} onClick={()=>Dispatch(Store.Actions.Show, 0)}>Your&nbsp;Samples</Button>
                <Button disabled={State.Show == 1} active={State.Show == 1} onClick={()=>Dispatch(Store.Actions.Show, 1)}>Test&nbsp;Answers</Button>
            </dd>
        </dl>
    </UI>;
}