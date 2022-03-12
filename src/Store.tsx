import React, { createContext, useContext, useReducer } from "react";

const CTX:React.Context<any> = createContext("default value"); 

export enum Actions { Test, Freq, dBHL, Chan, Mark };
export type Action = { Type:Actions, Payload:number };
export type Session =
{
  Tone: number,
  Chan: number,
  dBHL: number,
  Freq: number,
  Test: number,
  List: Array<Test>
};
export type Test =
{
  Name: string,
  Freq: Array<Frequency>
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
  Answer: Sample | null
};
export type Sample = [ number | null, number | null, boolean ]; /* [ stim, mask, resp ] */

const limit = (min:number, val:number, max:number):number =>
{
    if(val < min) { return min; }
    if(val > max) { return max; }
    return val;
};

const reducer = (state:Session, action:Action):Session =>
{
  switch(action.Type)
  {
    case Actions.Test :
      let clipTest = limit(0, action.Payload, state.List.length-1);
      let clipFreq = limit(0, state.Freq, state.List[clipTest].Freq.length-1);
      return { ...state, Test: clipTest, Freq: clipFreq };

    case Actions.Freq :
      let maxFreq = state.List[state.Test].Freq.length-1;
      return {...state, Freq: limit(0, action.Payload, maxFreq) };

    case Actions.dBHL :
      return {...state, dBHL: limit(-10, action.Payload, 130) };

    case Actions.Chan :
      return {...state, Chan: limit(0, action.Payload, 1) };

    case Actions.Mark :
      let clone = {...state };
      let currFreq:Frequency = clone.List[state.Test].Freq[state.Freq];
      let currChan:SamplePair = state.Chan == 0 ? currFreq.AL: currFreq.AR; 
      currChan.Answer =  [ state.dBHL, null, action.Payload == 1 ];

      return clone;

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
  List:
  [
    {
      Name:"CHL / Flat / Mid / Symmetric",
      Freq:
      [
        {
          Hz: 250,
          AL: {Sample:[20, null, true], Answer:null},
          AR: {Sample:[50, null, true], Answer:null},
        },
        {
          Hz: 500,
          AL: {Sample:[50, null, true], Answer:null},
          AR: {Sample:[50, null, true], Answer:null},
        },
        {
          Hz: 1000,
          AL: {Sample:[50, null, true], Answer:null},
          AR: {Sample:[50, null, true], Answer:null},
        },
      ]
    },
    {
      Name:"SNHL / Sloping",
      Freq:
      [
        {
          Hz: 250,
          AL: {Sample:[50, null, true], Answer:null},
          AR: {Sample:[50, null, true], Answer:null},
        },
        {
          Hz: 500,
          AL: {Sample:[50, null, true], Answer:null},
          AR: {Sample:[50, null, true], Answer:null},
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