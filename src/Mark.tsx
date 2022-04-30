import styled, { css, keyframes } from "styled-components";
import React, {useMemo} from "react";

export const MarkerArrow = ({x, y, r}:{x:string, y:string, r:string}) => <g style={{transform:`translate(${x}, ${y}) rotate(${r}) scale(0.5)`}}>
    <line vector-effect="non-scaling-stroke" x1="100%" y1="100%" x2="0%"  y2="0%" />
    <line vector-effect="non-scaling-stroke" x1="100%" y1="100%" x2="50%" y2="100%" />
    <line vector-effect="non-scaling-stroke" x1="100%" y1="100%" x2="100%"  y2="50%" />
</g>;

export const MarkerCircle = ({response}:{response:boolean}) => <>
    <ellipse rx="50%" ry="50%" />
    { !response && <MarkerArrow x="-35.35%" y="35.35%" r="96deg" /> }
</>;

export const MarkerX = ({response}:{response:boolean}) => <>
    <line x1="-50%" y1="-50%" x2="50%" y2="50%" />
    <line x1="-50%" y1="50%" x2="50%" y2="-50%" />
    { !response && <MarkerArrow x="50%" y="50%" r="-15deg" /> }
</>

export const Marker = styled.svg`
    position: absolute;
    width: 20px;
    height: 20px;
    overflow: visible;
    stroke-linecap: square;
    fill: none;
    transform-origin: 0 0;
    ${ (props:any):any => props.style }

    &:not(:root){ overflow:visible; }
`;

export default ( { style, channel, response, active, coords }:{ style?:any, channel:number, response:boolean, active:boolean, coords?:[string, string]} ) =>
{
    if(!coords)
        coords = ["0%", "0%"];

    return <Marker active={active} style={style} x={ coords[0] } y={ coords[1]} width="20" height="20">
        { channel == 0 ? <MarkerX response={response} /> : <MarkerCircle response={response}/> }
    </Marker>;
};
