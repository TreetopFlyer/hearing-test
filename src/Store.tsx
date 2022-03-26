import React, { createContext, useContext, useReducer } from "react";
import { Clip } from "./Util";

const CTX:React.Context<any> = createContext("default value"); 

export enum Actions { Test, Freq, dBHL, Chan, Show, Mark, VisX, VisY };
export type Action = { Type:Actions, Payload:number };
export type Session =
{
  VisX: number,
  VisY: number; 
  Tone: number,
  Chan: number,
  dBHL: number,
  Freq: number,
  Test: number,
  Draw: number,
  Show: number,
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
    case Actions.VisX :
      return { ...state, VisX: action.Payload};
    case Actions.VisY :
      return { ...state, VisY: action.Payload};

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
  VisX: 1,
  VisY: 1,
  Tone: 0,
  Chan: 0,
  dBHL: 50,
  Freq: 0,
  Test: 0,
  Draw: 0,
  Show: 0,
  List:
  [
    {
      Name:"CHL / Flat / Mid / Symmetric",
      Clip:[-10, 120],
      Plot:
      [
        {
          Hz: 125,
          AL: {Answer:[20, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 250,
          AL: {Answer:[50, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 500,
          AL: {Answer:[20, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 1000,
          AL: {Answer:[50, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 2000,
          AL: {Answer:[20, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 4000,
          AL: {Answer:[50, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 8000,
          AL: {Answer:[20, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        }
      ]
    },
    {
      Name:"SNHL / Sloping",
      Clip:[-50, 200],
      Plot:
      [
        {
          Hz: 250,
          AL: {Answer:[50, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 500,
          AL: {Answer:[50, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 1000,
          AL: {Answer:[50, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
        {
          Hz: 2000,
          AL: {Answer:[50, null, true], Sample:null},
          AR: {Answer:[50, null, true], Sample:null},
        },
      ]
    }
  ]
};

export type Binding =
{
  State:Session,
  Dispatch:(inType:Actions, inPayload:number) => void
  Handler:(inType:Actions) => (e:{target:{value:"string" | "number"}}) => void
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
        Dispatch(inType:Actions, inPayload:number)
        {
          dispatch({Type:inType, Payload:inPayload});
        },
        Handler(inType:Actions)
        {
          return (e) => dispatch({Type:inType, Payload:parseInt(e.target.value) || 0});
        },
    };
}