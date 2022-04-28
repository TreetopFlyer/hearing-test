import React, { useMemo } from "react";
import * as Store from "./Store";
import styled, { keyframes } from "styled-components";
import { Perc, Clip } from "./Util";

const MapFreqScalar = 1/6;
const MapFreq =
{
    125: MapFreqScalar*0,
    250: MapFreqScalar*1,
    500: MapFreqScalar*2,
   1000: MapFreqScalar*3,
   2000: MapFreqScalar*4,
   3000: MapFreqScalar*4.5,
   4000: MapFreqScalar*5,
   6000: MapFreqScalar*5.5,
   8000: MapFreqScalar*6
};
const MapdBHL = (inValue:number):number => (inValue+10)/130;
const MapPercent = (inValue:number):string => `${((inValue*0.9)+0.05) * 100}%`;
const MapPercentCoords = (inFreq:number, indBHL:number):[string, string] =>
{
    return [
        MapPercent( MapFreq[inFreq] ),
        MapPercent( MapdBHL(indBHL) )
    ];
};

const Chart = styled.div`
    position: relative;
    width: 800px;
    height: 500px;
    box-sizing: border-box;
    border: 1px solid #aaa;
    &::before
    {
        content: " ";
        position: absolute;
        top: ${MapPercent(MapdBHL(-10))};
        left: 0;
        width: 100%;
        height: ${ parseFloat(MapPercent(MapdBHL(25))) - parseFloat(MapPercent(MapdBHL(-10))) }%;
        background: rgba(0, 0, 0, 0.1);
    }
`;

const LabeldBHL = styled.div`
    position: absolute;
    width: 200px;
    height: 0px;
    top: 50%;
    left: -140px;
    transform: rotate(-90deg);
    white-space: nowrap;
    text-align: center;
    color: black;
    font-family: sans-serif;
    font-weight: 600;
`;
const LabelFreq = styled.div`
    position: absolute;
    width: 200px;
    height: 0px;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    text-align: center;
    color: black;
    font-family: sans-serif;
    font-weight: 600;
`;

const RuledBHL = styled.div`
    position: absolute;
    width: 100%;
    height: 0px;
    top: ${props => MapPercent( MapdBHL(props.value) )};
    border-top: ${props => props.bold ? `2px solid black` : `1px solid #aaa`};
    &::before
    {
        content: "${props => props.value}";
        display: block;
        width: 20px;
        height: 0px;
        position: absolute;
        left: -25px;
        top: -5px;
        color: black;
        font-size: 10px;
        font-family: sans-serif;
        text-align: right;
    }
`;

const RuleFreq = styled.div`
    position: absolute;
    height: 100%;
    width: 0px;
    left: ${props => MapPercent( MapFreq[props.value] )};
    border-right: ${props => props.bold ? `1px solid black` : `1px dashed #aaa`};
    &::before
    {
        content: "${props => props.value}";
        display: block;
        width: 100px;
        height: 10px;
        position: absolute;
        left: -50px;
        top: ${props => props.bold ? -25 : -15}px;
        color: black;
        font-family: sans-serif;
        font-size: 10px;
        text-align: center;
    }
`;

export default () =>
{
    return <Chart>

        <LabeldBHL>Hearing Level (dBHL)</LabeldBHL>
        <RuledBHL value={-10}/>
        <RuledBHL value={  0} bold/>
        <RuledBHL value={ 10}/>
        <RuledBHL value={ 20}/>
        <RuledBHL value={ 30}/>
        <RuledBHL value={ 40}/>
        <RuledBHL value={ 50}/>
        <RuledBHL value={ 60}/>
        <RuledBHL value={ 70}/>
        <RuledBHL value={ 80}/>
        <RuledBHL value={ 90}/>
        <RuledBHL value={100}/>
        <RuledBHL value={110}/>
        <RuledBHL value={120}/>

        <LabelFreq>Frequency in Hz</LabelFreq>
        <RuleFreq value={ 125} bold/>
        <RuleFreq value={ 250} bold/>
        <RuleFreq value={ 500} bold/>
        <RuleFreq value={1000} bold/>
        <RuleFreq value={2000} bold/>
        <RuleFreq value={3000} />
        <RuleFreq value={4000} bold/>
        <RuleFreq value={6000} />
        <RuleFreq value={8000} bold/>

    </Chart>;
}