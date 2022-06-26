import React, { useMemo, useEffect } from "react";
import * as Store from "./Store";
import styled, { keyframes } from "styled-components";
import Mark from "./Mark";

//// Mapping
// X-Axis: maps enumerated frequencies to screen position
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
// Y-Axis: maps dBHL to screen position
const MapdBHL = (inValue:number):number => (inValue+10)/130;
// converts a mapped position to a css percent string that has an adjusted 5% inset
const MapPercent = (inValue:number):string => `${((inValue*0.9)+0.05) * 100}%`;
// combines the above mappers to convert a frequency and dBHL into a tuple of css strings
const MapPercentCoords = (inFreq:number, indBHL:number):[string, string] =>
{
    return [
        MapPercent( MapFreq[inFreq] ),
        MapPercent( MapdBHL(indBHL) )
    ];
};

//// Plots
type ChartMark = {Freq:number, dBHL:number, Chan:number, Resp:boolean, Type:string, Perc:[string, string]};
type ChartLine = {From:ChartMark, To:ChartMark};
const ChartGetMarks = (test:Store.Test, pairKey:"AL"|"AR", sampleKey:"Sample"|"Answer"):Array<ChartMark> =>
{
    /* reduce the list of frequencies to only those with marked responses for requested SamplePair */
    const marks:Array<ChartMark> = [];
    test.Plot.forEach( (p:Store.Frequency) =>
    {
        let sample = p[pairKey][sampleKey];
        if(sample)
        {
            marks.push({
                Freq:p.Hz,
                dBHL: sample[0],
                Resp: sample[2],
                Chan: pairKey == "AR" ? 1 : 0,
                Type: sampleKey,
                Perc: MapPercentCoords(p.Hz, sample[0])
            });
        }
    });
    return marks;
};
const ChartGetLines = (marks:Array<ChartMark>):Array<ChartLine> =>
{
    /* output a list of *adjacent* of marks with *positive* responses */
    const lines:Array<ChartLine> = [];
    for(let i=0; i<marks.length-1; i++)
    {
        const line:ChartLine = {From:marks[i], To:marks[i+1]};
        if(line.From.Resp && line.To.Resp)
        {
            lines.push(line);
        }
    }
    return lines;
};

// components
const Grid = styled.div`
    position: relative;
    left: 40px;
    width: calc(100% - 40px);
    top: 72px;
    height: calc(100% - 72px);
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
        background: rgba(0, 0, 0, 0.05);
    }
`;
const GridYLabel = styled.div`
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
    font-size: 14px;
    line-height: 14px;
`;
const GridXLabel = styled.div`
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
    font-size: 14px;
    line-height: 14px;
`;
const GridYRule = styled.div`
    position: absolute;
    width: 100%;
    height: 0px;
    top: ${props => MapPercent( MapdBHL(props.value) )};
    border-top: ${props => props.bold ? `2px solid black` : `1px solid #c4c4c4`};
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
        font-family: sans-serif;
        font-size: 10px;
        line-height: 10px;
        text-align: right;
    }
`;
const GridXRule = styled.div`
    position: absolute;
    height: 100%;
    width: 0px;
    left: ${props => MapPercent( MapFreq[props.value] )};
    border-right: ${props =>
    {
        const color = props.fade ? `#ccc` : `#999`;
        const style = props.dash ? `1px dashed` : `1px solid`;
        return color + " " + style;
    }};
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
        line-height: 10px;
        text-align: center;
    }
`;
const GridLayer = styled.svg`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    stroke-width: 3px;
    ${ (props:any):any => props.style }

    &:not(:root){ overflow:visible; }
`;
const GridCursor = styled.svg`
    position: absolute;
    width: 20px;
    height: 20px;
    ${ props => `top:${props.coords[1]}; left:${props.coords[0]};`}
    overflow: visible;
    transition: all 0.4s;
    transform-origin: 0 0;

    &:not(:root){ overflow:visible; }
`;

// main
export default () =>
{
    const {State} = Store.Consume();
    const current = Store.useCurrent(State);

    const  leftAnswerMarks = ChartGetMarks(current.Test, "AL", "Answer");
    const  leftAnswerLines = ChartGetLines( leftAnswerMarks);
    const rightAnswerMarks = ChartGetMarks(current.Test, "AR", "Answer");
    const rightAnswerLines = ChartGetLines(rightAnswerMarks);

    const  leftSampleMarks = ChartGetMarks(current.Test, "AL", "Sample");
    const  leftSampleLines = ChartGetLines( leftSampleMarks);
    const rightSampleMarks = ChartGetMarks(current.Test, "AR", "Sample");
    const rightSampleLines = ChartGetLines(rightSampleMarks);

    const iterMarks = (m:ChartMark) =>
    {
        let style:any = {};
        if ( State.Chan == m.Chan && m.Type == "Sample" && current.Freq.Hz == m.Freq )
        {
            style.strokeWidth = "4px";
        }
        return <Mark channel={m.Chan} response={m.Resp} style={style} coords={m.Perc}  />;
    };
    const iterLines = (l:ChartLine) => <line x1={l.From.Perc[0]} y1={l.From.Perc[1]} x2={l.To.Perc[0]} y2={l.To.Perc[1]} />;

    return <Grid>

        <GridXLabel>Frequency in Hz</GridXLabel>
        <GridXRule value={ 125} fade />
        <GridXRule value={ 250} fade />
        <GridXRule value={ 500} />
        <GridXRule value={1000} />
        <GridXRule value={2000} />
        <GridXRule value={3000} dash/>
        <GridXRule value={4000} />
        <GridXRule value={6000} dash/>
        <GridXRule value={8000} />

        <GridYLabel>Hearing Level (dBHL)</GridYLabel>
        <GridYRule value={-10}/>
        <GridYRule value={  0} bold/>
        <GridYRule value={ 10}/>
        <GridYRule value={ 20}/>
        <GridYRule value={ 30}/>
        <GridYRule value={ 40}/>
        <GridYRule value={ 50}/>
        <GridYRule value={ 60}/>
        <GridYRule value={ 70}/>
        <GridYRule value={ 80}/>
        <GridYRule value={ 90}/>
        <GridYRule value={100}/>
        <GridYRule value={110}/>
        <GridYRule value={120}/>

        { State.Show == 1 && <><GridLayer key={"1"+State.Draw} style={{stroke:"blue", strokeWidth:"5px", opacity:0.3}}>{  leftAnswerLines.map( iterLines ) }</GridLayer> 
                               <GridLayer key={"2"+State.Draw} style={{stroke:"blue", strokeWidth:"4px", opacity:0.3}}>{  leftAnswerMarks.map( iterMarks ) }</GridLayer> 
                               <GridLayer key={"3"+State.Draw} style={{stroke:"red",  strokeWidth:"5px", opacity:0.3}}>{ rightAnswerLines.map( iterLines ) }</GridLayer> 
                               <GridLayer key={"4"+State.Draw} style={{stroke:"red",  strokeWidth:"4px", opacity:0.3}}>{ rightAnswerMarks.map( iterMarks ) }</GridLayer></> }

        <GridLayer key={"5"+State.Draw} style={{stroke:"blue", strokeWidth:"2px", opacity:0.6}}>{  leftSampleLines.map( iterLines ) }</GridLayer>
        <GridLayer key={"6"+State.Draw} style={{stroke:"blue", strokeWidth:"2px", opacity:1.0}}>{  leftSampleMarks.map( iterMarks ) }</GridLayer>
        <GridLayer key={"7"+State.Draw} style={{stroke:"red",  strokeWidth:"2px", opacity:0.6}}>{ rightSampleLines.map( iterLines ) }</GridLayer>
        <GridLayer key={"8"+State.Draw} style={{stroke:"red",  strokeWidth:"2px", opacity:1.0}}>{ rightSampleMarks.map( iterMarks ) }</GridLayer>

        { State.View == 1 && <GridCursor coords={MapPercentCoords(current.Freq.Hz, State.dBHL)}>
            <ellipse cx="0" cy="0" rx="5" ry="30" fill="url(#glow)"/>
            <ellipse cx="0" cy="0" rx="30" ry="5" fill="url(#glow)"/>
            <defs>
                <radialGradient id="glow">
                    <stop stop-color={ State.Chan == 0 ? "blue" : "red" } stop-opacity="0.6" offset="0.0"/>
                    <stop stop-color={ State.Chan == 0 ? "blue" : "red" } stop-opacity="0.3" offset="0.2"/>
                    <stop stop-color={ State.Chan == 0 ? "blue" : "red" } stop-opacity="0.0" offset="1.0"/>
                </radialGradient>
            </defs>
        </GridCursor> }


    </Grid>;
}