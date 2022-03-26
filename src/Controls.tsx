import React, { useState, useEffect, useMemo } from "react";
import * as Store from "./Store";
import styled, { keyframes, css } from "styled-components";
import Stepper from "./Stepper";


const Frame = styled.dl`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 5px 5px;
    padding: 5px 10px 5px 10px;
    border-radius: 10px;
    background: #ededed;
    color: #333333;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

    dl
    {
        margin: 0;
        padding: 0;
    }
`;
const FrameStack = styled(Frame)`
    flex-direction: column;
    & > dt
    {
        text-align: center;
        font-weight: 900;
    }
    & > dd
    {
        margin-bottom: 8px;
    }
`;

const Label = styled.dt`
`;

const Item = styled.dd`
    display: flex;
    justify-content: space-between;
    gap: 5px 5px;
    margin: 0;
    padding: 0;
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
    min-width: 30px;
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
    transform: scale(0.8);
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
    width: 10px;
    height: 10px;
    border-radius: 10px;
    transform: translate(-5px, -10px);
    outline: 2px solid white;
    background: #555;
    opacity: 0;
    transition: all 0.4s;
}
&[data-active='true']::before
{
    transform: translate(-5px, -6px);
    background: #ffa600ff;
    opacity: 1;
}

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

    return <div>
        <Frame>
            <Label>Test:</Label>
            <Item>
                <Select onChange={ Handler(Store.Actions.Test) } value={State.Test}>
                    { State.List.map( (t:Store.Test, i:number)=> <option value={i}>{ t.Name }</option> ) }
                </Select>
            </Item>
        </Frame>
        <Frame>
            <Label>Channel:</Label>
            <Item>
                <Button active={State.Chan == 0} onClick={()=>Dispatch(Store.Actions.Chan, 0)}>Left</Button>
                <Button active={State.Chan == 1} onClick={()=>Dispatch(Store.Actions.Chan, 1)}>Right</Button>
            </Item>
        </Frame>
        <Frame>
            <Label>Frequency:</Label>
            <Item><strong>{ currentFreq.Hz }</strong> Hz</Item>
            <Item>
                <Button disabled={State.Freq == 0} onClick={()=>Dispatch(Store.Actions.Freq, State.Freq-1)}>
                    <IconMinus/>
                </Button>
                <Button disabled={State.Freq == currentTest.Plot.length-1} onClick={()=>Dispatch(Store.Actions.Freq, State.Freq+1)}>
                    <IconPlus/>
                </Button>
            </Item>
        </Frame>
        <Frame>
            <Label>Stimulus:</Label>
            <Item><strong>{ State.dBHL }</strong> dBHL</Item>
            <Item>
                <Button disabled={State.dBHL == currentTest.Clip[0]} onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL-5)}>
                    <IconMinus/>
                </Button >
                <Button disabled={State.dBHL == currentTest.Clip[1]} onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL+5)}>
                    <IconPlus/>
                </Button>
            </Item>
        </Frame>

        <Frame>
            <Label>Response:</Label>
            <Item><Light on={ (askGet == 2) && (responseGet >= 0) }/></Item>
            <Item>
                <Button onClick={()=>askSet(1)} disabled={askGet == 1}><IconTriangle/><br/>Present</Button>
            </Item>
        </Frame>
        <Frame>
            <Label>Method:</Label>
            <Item>
                <Button onClick={()=>{}}>Pulsed</Button>
                <Button onClick={()=>{}}>Continuous</Button>
            </Item>
        </Frame>

        <FrameStack>
            <Label>Mark:</Label>
            <Item><span><strong>{ State.Chan == 1 ? "Right" : "Left" }</strong> ear</span> / <span><strong>{ currentFreq.Hz }</strong> Hz</span> / <span><strong>{ State.dBHL }</strong> dBHL</span></Item>
            <Item>
                <Button disabled={State.Show == 1} onClick={()=>{Dispatch(Store.Actions.Mark, 1)}}>Accept</Button>
                <Button disabled={State.Show == 1} onClick={()=>{Dispatch(Store.Actions.Mark, 0)}}>No Response</Button>
            </Item>
            <Item>
                <Button onClick={()=>{Dispatch(Store.Actions.Mark, -1)}} disabled={!currentChan.Sample || State.Show == 1 }>Clear Threshold</Button>
            </Item>
        </FrameStack>
        <FrameStack>
            <Label>Display:</Label>
            <Item>
                <Button active={State.Show == 0} onClick={()=>{Dispatch(Store.Actions.Show, 0)}}>Your&nbsp;Samples</Button>
                <Button active={State.Show == 1} onClick={()=>{Dispatch(Store.Actions.Show, 1)}}>Test&nbsp;Answers</Button>
            </Item>
        </FrameStack>
    </div>;
}