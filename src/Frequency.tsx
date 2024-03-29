import React from "react";
import styled from "styled-components";
import * as Store from "./Store";
import Mark from "./Mark";
import { Perc } from "./Util";

const Column = styled.div`
  position: relative;
  flex: 1 1;
  ${({half}:{half:boolean}) => half ? `border-right: 1px dashed #aaa` : null };
  &::before
  {
    content: " ";
    display: block;
    position: absolute;
    width: 0px;
    height: 100%;
    left: 50%;
    border-left: 1px solid #aaa;
  }
`;

const Label = styled.div`
  position: absolute;
  bottom: 100%;
  width: 100%;
  padding-bottom: 10px;

  color: black;
  font-size: 13px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  text-align: center;
`;

const Preview = styled.div`
position: absolute;
   width: 20px;
  height: 20px;
    left: 50%;
  border: 1px solid black;
`;

export default ( { freq, clip, mode, active, chan }:{freq:Store.Frequency, clip:Store.Range, mode:number, active:boolean, chan:number} ) =>
{

  return <Column half={freq.Hz >= 1000 && freq.Hz <= 6000}>
    <Label>{ freq.Hz }</Label>

    { (mode == 1 && freq.AL.Answer) && <Mark active={false}                 channel={0} response={freq.AL.Answer[2]} style={{left:"50%", strokeWidth:"4px", stroke:"blue", opacity:0.3, top:Perc(freq.AL.Answer[0], ...clip)}}></Mark> }
    { (mode == 1 && freq.AR.Answer) && <Mark active={false}                 channel={1} response={freq.AR.Answer[2]} style={{left:"50%", strokeWidth:"4px", stroke:"red",  opacity:0.3, top:Perc(freq.AR.Answer[0], ...clip)}}></Mark> }

    { (freq.AL.Sample) && <Mark active={active && (chan == 0)} channel={0} response={freq.AL.Sample[2]} style={{left:"50%", stroke:"blue", top:Perc(freq.AL.Sample[0], ...clip)}}></Mark> }
    { (freq.AR.Sample) && <Mark active={active && (chan == 1)} channel={1} response={freq.AR.Sample[2]} style={{left:"50%", stroke:"red",  top:Perc(freq.AR.Sample[0], ...clip)}}></Mark> }
  
  </Column>;
}
