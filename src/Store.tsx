import React, { createContext, useContext, useReducer, useMemo } from "react";

const CTX:React.Context<any> = createContext("default value"); 

export enum Actions { Test, Freq, dBHL, Chan, Tone, Show, Mark, View, Load, Play };
export type Action = 
{ Type:Actions.Test, Payload:number } |
{ Type:Actions.Freq, Payload:number } |
{ Type:Actions.dBHL, Payload:number } |
{ Type:Actions.Chan, Payload:number } |
{ Type:Actions.Tone, Payload:number } |
{ Type:Actions.Show, Payload:number } |
{ Type:Actions.Mark, Payload:number } |
{ Type:Actions.View, Payload:number } |
{ Type:Actions.Load, Payload:Session } |
{ Type:Actions.Play, Payload: 0 | 1 | 2 }


export type Session =
{
  Test: number, // test index 
  Chan: number, // left | right index
  Freq: number, // frequency index
  dBHL: number, // dbhl value
  Tone: number, // pulsed | continuous index
  Draw: number, // svg update rand
  Show: number, // sample | answer ,
  View: number, // preview crosshairs
  Play: number, // tone play state
  List: Array<Test>
};
export type Test =
{
  Name: string,
  Clip: Range,
  Plot: Array<Frequency>
};
export type Frequency = 
{
  Hz: number;
  AL: SamplePair,
  AR: SamplePair
};
export type SamplePair =
{
  Sample?: Sample,
  Answer: Sample
};

export type Range = [ number, number];
export type Sample = [ stim:number | null, mask: number | null, resp: boolean ]; /* [ stim, mask, resp ] */

export const Clip = (val:number, min:number, max:number):number =>
{
    if(val < min) { return min; }
    if(val > max) { return max; }
    return val;
};

const reducer = (state:Session, action:Action):Session =>
{
  switch(action.Type)
  {
    case Actions.Play :
      return { ...state, Play:action.Payload}

    case Actions.Load :
      return action.Payload;

    case Actions.View :
      return { ...state, View:action.Payload};

    case Actions.Tone :
      return { ...state, Tone:action.Payload};

    case Actions.Test :
      let clipTest:number = Clip(action.Payload, 0, state.List.length-1);
      let nextTest:Test = state.List[clipTest];
      let clipFreq:number = Clip(state.Freq, 0, nextTest.Plot.length-1);
      let clipdBHL = Clip(state.dBHL, ...nextTest.Clip);
      return { ...state, Test: clipTest, Freq: clipFreq, dBHL: clipdBHL, Draw:state.Draw+1 };

    case Actions.Freq :
      let maxFreq = state.List[state.Test].Plot.length-1;
      return {...state, Freq: Clip(action.Payload, 0, maxFreq) };

    case Actions.dBHL :
      return {...state, dBHL: Clip(action.Payload, ...state.List[state.Test].Clip) };

    case Actions.Chan :
      return {...state, Chan: Clip(action.Payload, 0, 1) };

    case Actions.Mark :
      let clone = {...state, Draw:state.Draw+1 };
      let currFreq:Frequency = clone.List[state.Test].Plot[state.Freq];
      let currChan:SamplePair = state.Chan == 0 ? currFreq.AL: currFreq.AR; 
      if(action.Payload == -1)
      {
        currChan.Sample = null;
      }
      else
      {
        currChan.Sample =  [ state.dBHL, null, action.Payload == 1 ];
      }
      return clone;

    case Actions.Show :
      return {...state, Show:action.Payload, Draw:state.Draw+1 };

    default:
      return state;
  }
};

const model:Session =
{
  Tone: 0,
  Chan: 0,
  dBHL: 30,
  Freq: 1,
  Test: 0,
  Draw: 0,
  Show: 0,
  View: 1,
  Play: 0,
  List:
  [
    {
      Name: "Patient A  Asymmetric Notch",
      Clip: [-10, 120],
      Plot:
      [
        {
          "Hz": 500,
          "AL": { Answer: [15, null, true] },
          "AR": { Answer: [10, null, true] }
        },
        {
          "Hz": 1000,
          "AL": { Answer: [10, null, true] },
          "AR": { Answer: [10, null, true] }
        },
        {
          "Hz": 2000,
          "AL": { Answer: [15, null, true] },
          "AR": { Answer: [20, null, true] }
        },
        {
          "Hz": 3000,
          "AL": { Answer: [30, null, true] },
          "AR": { Answer: [40, null, true] }
        },
        {
          "Hz": 4000,
          "AL": { Answer: [40, null, true] },
          "AR": { Answer: [55, null, true] }
        },
        {
          "Hz": 6000,
          "AL": { Answer: [35, null, true] },
          "AR": { Answer: [40, null, true] }
        },
        {
          "Hz": 8000,
          "AL": { Answer: [20, null, true] },
          "AR": { Answer: [15, null, true] }
        }
      ]
    },
    {
      Name: "Patient B High Freq Hearing Loss",
      Clip:[-10, 120],
      Plot:
      [
        {
          "Hz": 500,
          "AL": {Answer: [10, null, true] },
          "AR": {Answer: [10, null, true] }
        },
        {
          "Hz": 1000,
          "AL": { Answer: [15, null, true] },
          "AR": { Answer: [10, null, true] }
        },
        {
          "Hz": 2000,
          "AL": { Answer: [10, null, true] },
          "AR": { Answer: [15, null, true] }
        },
        {
          "Hz": 3000,
          "AL": { Answer: [25, null, true] },
          "AR": { Answer: [20, null, true] }
        },
        {
          "Hz": 4000,
          "AL": { Answer: [35, null, true] },
          "AR": { Answer: [35, null, true] }
        },
        {
          "Hz": 6000,
          "AL": { Answer: [50, null, true] },
          "AR": { Answer: [55, null, true] }
        },
        {
          "Hz": 8000,
          "AL": { Answer: [80, null, true] },
          "AR": { Answer: [75, null, true] }
        }
      ]
    },
    {
      Name: "Patient C Unilateral Hearing Loss",
      Clip:[-10, 120],
      Plot:
      [
        {
          "Hz": 500,
          "AL": { Answer: [15, null, true] },
          "AR": { Answer: [40, null, true] }
        },
        {
          "Hz": 1000,
          "AL": { Answer: [15, null, true] },
          "AR": { Answer: [50, null, true] }
        },
        {
          "Hz": 2000,
          "AL": { Answer: [20, null, true] },
          "AR": { Answer: [65, null, true] }
        },
        {
          "Hz": 3000,
          "AL": { Answer: [15, null, true] },
          "AR": { Answer: [70, null, true] }
        },
        {
          "Hz": 4000,
          "AL": { Answer: [20, null, true] },
          "AR": { Answer: [65, null, true] }
        },
        {
          "Hz": 6000,
          "AL": { Answer: [25, null, true] },
          "AR": { Answer: [60, null, true] }
        },
        {
          "Hz": 8000,
          "AL": { Answer: [20, null, true] },
          "AR": { Answer: [45, null, true] }
        }
      ]
    },
    {
      Name:"Patient D Normal Hearing",
      Clip:[-10, 120],
      Plot:
      [
        {
          "Hz": 500,
          "AL": { Answer: [5, null, true] },
          "AR": { Answer: [10, null, true] }
        },
        {
          "Hz": 1000,
          "AL": { Answer: [0, null, true] },
          "AR": { Answer: [5, null, true] }
        },
        {
          "Hz": 2000,
          "AL": { Answer: [5, null, true] },
          "AR": { Answer: [5, null, true] }
        },
        {
          "Hz": 3000,
          "AL": { Answer: [15, null, true] },
          "AR": { Answer: [10, null, true] }
        },
        {
          "Hz": 4000,
          "AL": { Answer: [15, null, true] },
          "AR": { Answer: [15, null, true] }
        },
        {
          "Hz": 6000,
          "AL": { Answer: [5, null, true] },
          "AR": { Answer: [10, null, true] }
        },
        {
          "Hz": 8000,
          "AL": { Answer: [0, null, true] },
          "AR": { Answer: [5, null, true] }
        }
      ]
    }
  ]
};

export type Binding =
{
  State:Session,
  Dispatch:(inType:Actions, inPayload:any) => void
};

export const Provide = (props:any) =>
{
    const binding = useReducer(reducer, model);
    return <CTX.Provider value={binding} children={props.children}/>;
}
export const Consume = ():Binding =>
{
    const [state, dispatch]:[Session, (a:Action)=>void] = useContext(CTX);
    return {
        State:state,
        Dispatch(inType:Actions, inPayload:any)
        {
          dispatch({Type:inType, Payload:inPayload});
        }
    };
}

export type ScoreMark = number | false;
export type ScoreTally = {
    AnswerTotal:number,
    AnswerComplete:number,
    PointsTotal:number,
    PointsComplete:number,
    List:Array<ScoreMark>
};
const ScoreChannel = (inTest:Test,  inKey:"AL"|"AR"):ScoreTally =>
{
    let scores:ScoreTally = {
        AnswerTotal:0,
        AnswerComplete:0,
        PointsTotal:0,
        PointsComplete:0,
        List:[]
    };

    inTest.Plot.forEach((f) =>
    {
        scores.AnswerTotal++;

        let sample = f[inKey].Sample;
        let answer = f[inKey].Answer;
        let score:ScoreMark;

        if(sample)
        {
            scores.AnswerComplete++;

            const stimSample = sample[0]??0;
            const stimAnswer = answer[0]??0;

            let error = Math.abs(stimAnswer - stimSample);
            if(error == 0)
            {
                score = 7;
            }
            else if(error <= 5) 
            {
                score = 5;
            }
            else
            {
                score = 0;
            }
            scores.PointsComplete += score;
        }
        else
        {
            score = false;
        }
        scores.PointsTotal += 7;
        scores.List.push(score);
    });

    return scores;
};
const ScoreConcat = (...scores:Array<ScoreTally>):ScoreTally =>
{
    let total:ScoreTally = {
        AnswerTotal:0,
        AnswerComplete:0,
        PointsTotal:0,
        PointsComplete:0,
        List:[]
    };

    scores.forEach(s =>
    {
        total.AnswerTotal += s.AnswerTotal;
        total.AnswerComplete += s.AnswerComplete;
        total.PointsTotal += s.PointsTotal,
        total.PointsComplete += s.PointsComplete,
        total.List = [...total.List, ...s.List];
    });

    return total;
};
export const useScore = (inState:Session, inTest:Test):{Left:ScoreTally, Right:ScoreTally, Total:ScoreTally} =>
{
    return useMemo(()=>
    {
        const Left  = ScoreChannel(inTest, "AL");
        const Right = ScoreChannel(inTest, "AR");
        const Total = ScoreConcat(Left, Right);
        return { Left, Right, Total };

    }, [inState.Draw]);
};

export const useCurrent = (inState:Session):{Test:Test, Freq:Frequency, Chan:SamplePair} =>
{
  const Test = inState.List[inState.Test];
  const Freq = Test.Plot[inState.Freq];
  const Chan = inState.Chan == 0 ? Freq.AL : Freq.AR
  return {Test, Freq, Chan};

}