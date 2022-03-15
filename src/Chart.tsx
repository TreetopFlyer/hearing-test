import React, { useMemo } from "react";
import Frequency from "./Frequency";
import * as Store from "./Store";
import styled from "styled-components";

enum DrawStyle { Light, Normal, Intense };
const Rule = styled.div`
    position: absolute;
    left: 0;
    width: 100%;
    height: 0;
    border-top: 1px dashed black;
    border-top: ${ (props:{look:DrawStyle}):string =>
    {
        switch(props.look)
        {
            case DrawStyle.Light:
                return "1px solid #ddd";
            case DrawStyle.Normal:
                return "1px solid black";
            case DrawStyle.Intense:
                return "2px solid red";
        }
    }
    };
`;

const Label = styled.div`
    position: absolute;
    right: 100%;
    text-align: right;
    line-height: 0;
    font-size: 10px;
`;

type Marked = {index:number, sample:Store.Sample}
type PercentCoords = {x1:string, y1:string, x2:string, y2:string}
const Contiguous = (test:Store.Test, pairKey:"AL"|"AR", sampleKey:"Sample"|"Answer"):Array<PercentCoords> =>
{
    /* reduce the list of frequencies to only those with marked responses for requested SamplePair */
    let points:Array<Marked> = [];
    test.Plot.forEach( (p:Store.Frequency, index:number) =>
    {
        let pair = p[pairKey];
        if(pair)
        {
            let sample = pair[sampleKey]
            if(sample)
            {
                points.push({index:index, sample:sample});
            }
        }
    });

    /* output a list of *adjacent* of marks with *positive* responses */
    let output:Array<PercentCoords> = [];
    for(let i=0; i<points.length-1; i++)
    {
        let from:Marked = points[i];
        let to:Marked = points[i+1];
        if(from.sample[2] && to.sample[2])
        {
            output.push({
                x1: from.index/test.Plot.length * 100 + "%",
                y1: (from.sample[0]-test.Clip[0])/(test.Clip[1]-test.Clip[0]) * 100 + "%",
                x2: to.index/test.Plot.length * 100 + "%",
                y2: (to.sample[0]-test.Clip[0])/(test.Clip[1]-test.Clip[0]) * 100 + "%",
            });
        }
    }

    console.log(output);
    return output;
};

export default ( ) =>
{
    const {State, Dispatch, Handler}:Store.Binding = Store.Consume();
    const currentTest:Store.Test = State.List[State.Test];
    const currentFreq:Store.Frequency = currentTest.Plot[State.Freq];
    const currentPair:Store.SamplePair = State.Chan == 0 ? currentFreq.AL : currentFreq.AR;

    const lines:Array<React.ReactElement> = useMemo(()=>{
        let stride:number = 10;
        let start:number = Math.floor(currentTest.Clip[0]/stride)*stride;
        let stop:number = Math.floor(currentTest.Clip[1]/stride)*stride;
        let lines = [];
        for(let i=start; i<=stop; i+=stride)
        {
            lines.push(<Rule style={{top: `${(i-start)/(stop-start)*100}%`}} look={ i==0 ? DrawStyle.Normal : DrawStyle.Light}><Label>{i}</Label></Rule>)
        }
        return lines;
    }, [State.Test]);

    const path:{Left:Array<PercentCoords>, Right:Array<PercentCoords>} = useMemo(() =>
    {
        let mode:"Sample" | "Answer" = State.Show ? "Answer" : "Sample";

        return {
             Left: Contiguous(currentTest, "AL", mode),
            Right: Contiguous(currentTest, "AR", mode)
        };
    },
    [State.Draw, State.Show]);

    return <div style={{ display:"flex", position:"relative", width:"500px", height:"300px", margin:"20px"}}>
        { lines }
        { <Rule look={DrawStyle.Intense} style={{top: `${(State.dBHL - currentTest.Clip[0])/(currentTest.Clip[1] - currentTest.Clip[0])*100 }%`}}/> }
        { currentTest.Plot.map( (f:Store.Frequency, i:number)=><Frequency freq={f} clip={currentTest.Clip} active={f == currentFreq} mode={State.Show} /> )}
        <svg style={{position: "absolute", top:0, left:"16%", width:"100%", height:"100%"}} preserveAspectRatio="none" key={State.Draw}>
            {  path.Left.map( (m:PercentCoords) => <line {...m}  style={{stroke:'#777', strokeWidth:1}}/> ) }
            { path.Right.map( (m:PercentCoords) => <line {...m}  style={{stroke:'#777', strokeWidth:1}}/> ) }
        </svg>
    </div>;
}
