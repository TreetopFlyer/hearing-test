import React from "react";
import styled from "styled-components";
import { Frequency, Range } from "./Store";

const perc = (min: number, val: number, max: number): string => `${(val - min) / (max - min) * 100}%`;

const Column = styled.div`
  position: relative;
  width:1px;
  &::before
  {
    content: " ";
    display: block;
    position: absolute;
    width: 0px;
    height: 100%;
    left: 50%;
    border-left: ${ (props:{active:Boolean}):string => props.active ? `2px solid red` : `1px solid #aaa`};
    box-shadow: ${ (props:{active:Boolean}):string => props.active ? `0px 0px 10px red` : `none`};
  }
`;

const Label = styled.div`
  position: absolute;
  top: 100%;
  left: -25px;
  width: 50px;
  padding-top: 10px;
  text-align: center;
  font-size: 13px;
`;

const Plot = styled.div`
  position: absolute;
  left: 50%;
  border: 1px solid red;
  line-height: 0;
  letter-spacing: 0;
  font-weight: 900;
  font-size: 20px;
`;

export default ( { freq, clip, mode, active }:{freq:Frequency, clip:Range, mode:number, active:Boolean} ) =>
{

  const iconAL = "✕";
  const iconAR = "◯";

  const iconNL = "🡦";
  const iconNR = "🡧";

  return <Column active={active}>
    <Label>{ freq.Hz }</Label>
    { (mode == 0 && freq.AL.Sample) && <Plot style={{top:perc(clip[0], freq.AL.Sample[0], clip[1])}}>{iconAL}{ freq.AL.Sample[2] == false && iconNL }</Plot> }
    { (mode == 0 && freq.AR.Sample) && <Plot style={{top:perc(clip[0], freq.AR.Sample[0], clip[1])}}>{iconAR}{ freq.AR.Sample[2] == false && iconNR }</Plot> }
    { (mode == 1 && freq.AL.Answer) && <Plot style={{top:perc(clip[0], freq.AL.Answer[0], clip[1])}}>{iconAL}{ freq.AL.Answer[2] == false && iconNL }</Plot> }
    { (mode == 1 && freq.AR.Answer) && <Plot style={{top:perc(clip[0], freq.AR.Answer[0], clip[1])}}>{iconAR}{ freq.AR.Answer[2] == false && iconNR }</Plot> }
  </Column>;
}
