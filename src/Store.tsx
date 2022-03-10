import React, { createContext, useContext, useReducer } from "react";
import * as Au from "./Types";

const CTX:React.Context<any> = createContext("default value"); 

export enum Actions { Test, Freq, dBHL, Chan, Mark };

type Action =
{
  Type:Actions,
  Payload:number
};

const limit = (min:number, val:number, max:number):number =>
{
    if(val < min) { return min; }
    if(val > max) { return max; }
    return val;
};

const reducer = (state:Au.Session, action:Action):Au.Session =>
{

  var max;
  switch(action.Type)
  {
    case Actions.Test :
        max = state.List.length-1;
        return {...state, Test: limit(0, action.Payload, max)};

    case Actions.Freq :
        max = state.list[state.Test].Freq.length-1;
        return {...state, Freq: limit(0, action.Payload, max)};

    case Action.dBHL :
        return {...state, dBHL: limit(-10, action.Payload, 100)};

    case Action.Chan :
        return {...state, Left: limit(0, action.Payload, 1)};

    default:
      return state;
  }
};

const model:Au.Session =
{
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
          AL: {Sample:[50, null, true], Answer:null},
          AR: {Sample:[50, null, true], Answer:null},
        },
        {
          Hz: 500,
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

export const Provide = (props:any) =>
{
    const binding = useReducer(reducer, model);
    return <CTX.Provider value={binding} children={props.children}/>;
}
export const Consume = () =>
{
    const [state, dispatch] = useContext(CTX);
    return {
        State:state,
        Dispatch(inType:Actions, inPayload:number)
        {
            dispatch({Type:inType, Payload:inPayload});
        }
    };
}