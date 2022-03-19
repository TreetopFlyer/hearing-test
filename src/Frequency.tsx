import React from "react";
import styled from "styled-components";
import { Frequency, Range } from "./Store";

const perc = (min: number, val: number, max: number): string => `${(val - min) / (max - min) * 100}%`;

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

const Plot = styled.div`
  position: absolute;
  left: 50%;
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

  return <Column active={active} half={freq.Hz >= 1000 && freq.Hz <= 6000}>
    <Label>{ freq.Hz }</Label>
    { (mode == 0 && freq.AL.Sample) && <Plot style={{top:perc(clip[0], freq.AL.Sample[0], clip[1])}}>{iconAL}{ freq.AL.Sample[2] == false && iconNL }</Plot> }
    { (mode == 0 && freq.AR.Sample) && <Plot style={{top:perc(clip[0], freq.AR.Sample[0], clip[1])}}>{iconAR}{ freq.AR.Sample[2] == false && iconNR }</Plot> }
    { (mode == 1 && freq.AL.Answer) && <Plot style={{top:perc(clip[0], freq.AL.Answer[0], clip[1])}}>{iconAL}{ freq.AL.Answer[2] == false && iconNL }</Plot> }
    { (mode == 1 && freq.AR.Answer) && <Plot style={{top:perc(clip[0], freq.AR.Answer[0], clip[1])}}>{iconAR}{ freq.AR.Answer[2] == false && iconNR }</Plot> }
  </Column>;
}
