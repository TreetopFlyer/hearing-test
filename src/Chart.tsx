import React, { useMemo } from "react";
import Frequency from "./Frequency";
import * as Store from "./Store";
import styled from "styled-components";

const ChartGap = styled.div`
margin: 0 0 60px 60px;
box-sizing: border-box;
`;

const ChartOuter = styled.div`
position: relative;
width: 100%;
box-sizing: border-box;
padding-bottom: 56%;
border: 1px solid #ddd;
`;

const ChartInner = styled.div`
display: flex;
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
`;

const ChartSVG = styled.svg`
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
`;

const ChartLabel = styled.div`
position: absolute;
width: 100%;
text-align: center;

color: black;
font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
font-size: 16px;
font-weight: 900;
line-height: 0;
`;
const ChartLabelX = styled(ChartLabel)`
top: 100%;
left: 0%;
transform: translateY(40px);
`;
const ChartLabelY = styled(ChartLabel)`
top: 50%;
left: -50%;
transform: rotate(-90deg) translateY(-40px);
`;

const Rule = styled.div`
position: absolute;
left: 0;
width: 100%;
height: 0;
border-top: 1px dashed black;
border-top: ${ ({dark}:{dark:boolean}):string => dark ? "1px solid black" : "1px solid #ddd" };
`;

const Label = styled.div`
position: absolute;
right: 100%;
padding-right: 10px;

color: black;
font-size: 10px;
font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
text-align: right;
line-height: 0;
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
                x1: from.index/(test.Plot.length-1) * 100 + "%",
                y1: (from.sample[0]-test.Clip[0])/(test.Clip[1]-test.Clip[0]) * 100 + "%",
                x2: to.index/(test.Plot.length-1) * 100 + "%",
                y2: (to.sample[0]-test.Clip[0])/(test.Clip[1]-test.Clip[0]) * 100 + "%",
            });
        }
    }
    return output;
};

export default ( ) =>
{
    const {State, Dispatch, Handler}:Store.Binding = Store.Consume();
    const currentTest:Store.Test = State.List[State.Test];
    const currentFreq:Store.Frequency = currentTest.Plot[State.Freq];

    const lines:Array<React.ReactElement> = useMemo(()=>{
        let stride:number = 10;
        let start:number = Math.floor(currentTest.Clip[0]/stride)*stride;
        let stop:number = Math.floor(currentTest.Clip[1]/stride)*stride;
        let lines = [];
        for(let i=start; i<=stop; i+=stride)
        {
            lines.push(<Rule style={{top: `${(i-start)/(stop-start)*100}%`}} dark={ i==0 }><Label>{i}</Label></Rule>)
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

    const SVGCSS:{left:string, width:string} = useMemo(() =>
    {
        const scalar = 100 / currentTest.Plot.length;
        return {
            left: scalar/2 + "%",
            width: (100 - scalar) + "%" 
        };
    },
    [State.Draw, State.Show]);

    const frequencies:Array<typeof Frequency> = currentTest.Plot.map( (f:Store.Frequency, i:number)=>
    {
        return <Frequency freq={f} clip={currentTest.Clip} active={(f == currentFreq) && (State.VisY == 1)} mode={State.Show} />;
    });
    


    return <ChartGap>
        <ChartOuter>
            { lines }
            <ChartInner>
                { frequencies }
                <ChartSVG style={SVGCSS} preserveAspectRatio="none" key={State.Draw}>
                    {  path.Left.map( (m:PercentCoords) => <line {...m}  style={{stroke:'#777', strokeWidth:1}}/> ) }
                    { path.Right.map( (m:PercentCoords) => <line {...m}  style={{stroke:'#777', strokeWidth:1}}/> ) }
                </ChartSVG>
            </ChartInner>
            <ChartLabelX>Frequency in (H)z</ChartLabelX>
            <ChartLabelY>Hearing Level (dB HL)</ChartLabelY>
        </ChartOuter>
    </ChartGap>;
}