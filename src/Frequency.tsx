import React from "react";
import styled from "styled-components";
import { Frequency, Range } from "./Store";
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
  top: 100%;
  width: 100%;
  padding-top: 10px;

  color: black;
  font-size: 13px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  text-align: center;
  
`;


export default ( { freq, clip, mode, active }:{freq:Frequency, clip:Range, mode:number, active:Boolean} ) =>
{

  return <Column half={freq.Hz >= 1000 && freq.Hz <= 6000}>
    <Label>{ freq.Hz }</Label>
    { (mode == 0 && freq.AL.Sample) && <Mark channel={0} response={freq.AL.Sample[2]} style={{left:"50%", stroke:"blue", top:Perc(freq.AL.Sample[0], ...clip)}}></Mark> }
    { (mode == 0 && freq.AR.Sample) && <Mark channel={1} response={freq.AR.Sample[2]} style={{left:"50%", stroke:"red",  top:Perc(freq.AR.Sample[0], ...clip)}}></Mark> }
    { (mode == 1 && freq.AL.Answer) && <Mark channel={1} response={freq.AL.Answer[2]} style={{left:"50%", stroke:"blue", top:Perc(freq.AL.Answer[0], ...clip)}}></Mark> }
    { (mode == 1 && freq.AR.Answer) && <Mark channel={0} response={freq.AR.Answer[2]} style={{left:"50%", stroke:"red",  top:Perc(freq.AR.Answer[0], ...clip)}}></Mark> }
  </Column>;
}
