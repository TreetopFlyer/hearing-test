import React from "react";
import styled from "styled-components";
import { Frequency, Sample } from "./Store";

const perc = (min: number, val: number, max: number): string => `${(val - min) / (max - min) * 100}%`;

const Column = styled.div`
  position: relative;
  flex-grow: 1;
`;

const Label = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
  text-align: center;
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

export default ( { freq, sample, answer }:{freq:Frequency, sample:Boolean, answer:Boolean} ):React.ReactElement =>
{

  const iconAL = "✕";
  const iconAR = "◯";

  const iconNL = "🡦";
  const iconNR = "🡧";

  return <Column>
    <Label>{ freq.Hz }</Label>
    { (sample && freq.AL.Sample) && <Plot style={{top:perc(-10, freq.AL.Sample[0], 130)}}>{iconAL}{ freq.AL.Sample[2] == false && iconNL }</Plot> }
    { (sample && freq.AR.Sample) && <Plot style={{top:perc(-10, freq.AR.Sample[0], 130)}}>{iconAR}{ freq.AR.Sample[2] == false && iconNR }</Plot> }
    { (answer && freq.AL.Answer) && <Plot style={{top:perc(-10, freq.AL.Answer[0], 130)}}>{iconAL}{ freq.AL.Answer[2] == false && iconNL }</Plot> }
    { (answer && freq.AR.Answer) && <Plot style={{top:perc(-10, freq.AR.Answer[0], 130)}}>{iconAR}{ freq.AR.Answer[2] == false && iconNR }</Plot> }
  </Column>;
}
