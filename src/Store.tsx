import React, { createContext, useContext, useReducer } from "react";
import { Clip } from "./Util";

const CTX:React.Context<any> = createContext("default value"); 

export enum Actions { Test, Freq, dBHL, Chan, Tone, Show, Mark, View, Load };
export type Action = 
{ Type:Actions.Test, Payload:number } |
{ Type:Actions.Freq, Payload:number } |
{ Type:Actions.dBHL, Payload:number } |
{ Type:Actions.Chan, Payload:number } |
{ Type:Actions.Tone, Payload:number } |
{ Type:Actions.Show, Payload:number } |
{ Type:Actions.Mark, Payload:number } |
{ Type:Actions.View, Payload:number } |
{ Type:Actions.Load, Payload:Session }


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
  Sample: Sample,
  Answer: Sample
};

export type Range = [ number, number];
export type Sample = [ number | null, number | null, boolean ] | null; /* [ stim, mask, resp ] */


const reducer = (state:Session, action:Action):Session =>
{
  switch(action.Type)
  {
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
  dBHL: 50,
  Freq: 0,
  Test: 0,
  Draw: 0,
  Show: 0,
  View: 1,
  List:
  [
    {
      Name:"CHL / Flat / Mid / Symmetric",
      Clip:[-10, 120],
      Plot:
      [
        {
          Hz: 125,
          AL: {Answer:[35, null, true], Sample:null},
          AR: {Answer:[35, null, true], Sample:null},
        },
        {
          Hz: 250,
          AL: {Answer:[35, null, true], Sample:null},
          AR: {Answer:[35, null, true], Sample:null},
        },
        {
          Hz: 500,
          AL: {Answer:[40, null, true], Sample:null},
          AR: {Answer:[30, null, true], Sample:null},
        },
        {
          Hz: 1000,
          AL: {Answer:[30, null, true], Sample:null},
          AR: {Answer:[35, null, true], Sample:null},
        },
        {
          Hz: 2000,
          AL: {Answer:[35, null, true], Sample:null},
          AR: {Answer:[30, null, true], Sample:null},
        },
        {
          Hz: 4000,
          AL: {Answer:[30, null, true], Sample:null},
          AR: {Answer:[30, null, true], Sample:null},
        },
        {
          Hz: 8000,
          AL: {Answer:[40, null, true], Sample:null},
          AR: {Answer:[30, null, true], Sample:null},
        }
      ]
    },
    {
      Name:"MHL / Sloping / Mod-Sev / Symmetric",
      Clip:[-10, 120],
      Plot:
      [
        {
          Hz: 125,
          AL: {Answer:[40, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 250,
          AL: {Answer:[45, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 500,
          AL: {Answer:[45, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 1000,
          AL: {Answer:[50, null, true], Sample:null},
          AR: {Answer:[55, null, true], Sample:null},
        },
        {
          Hz: 2000,
          AL: {Answer:[55, null, true], Sample:null},
          AR: {Answer:[55, null, true], Sample:null},
        },
        {
          Hz: 4000,
          AL: {Answer:[80, null, true], Sample:null},
          AR: {Answer:[75, null, true], Sample:null},
        },
        {
          Hz: 8000,
          AL: {Answer:[85, null, true], Sample:null},
          AR: {Answer:[90, null, true], Sample:null},
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