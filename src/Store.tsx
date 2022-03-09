import React, { createContext, useContext, useReducer } from "react";
import * as Au from "./Types";

const CTX:React.Context<any> = createContext("default value"); 

export enum Actions { Test, Frequency, Volume, Channel, Record };
export type Action =
{
  Type:Actions,
  Payload?:any
};

const limitToArray = (index:number, array:Array):number =>
{
    if(index < 0){ return 0; }
    if(index > array.length-1){ return array.length-1; }
    return index;
}

const reducer = (state:Au.Session, action:Action) =>
{
  switch(action.Type)
  {

    case Actions.Test :

        return {...state, Test: action.Payload};

    case Actions.Frequency :
        return {...state, Freq: action.Payload};

    case Action.Volume :
        return {...state, dBHL: action.Payload};

    case Action.Channel :
        return {...state, Left: action.Payload};

    

    default:
      return state;
  }
};

const model:Au.Session =
{
  Left: false,
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

export default {
  Provide(props:any)
  {
    const binding = useReducer(reducer, model);
    return <CTX.Provider value={binding} children={props.children}/>;
  },
  Consume()
  {
    const [state, dispatch] = useContext(CTX);

    return {
      State:state,
      Dispatch(inType:Actions, inPayload?:any)
      {
        dispatch({Type:inType, Payload:inPayload});
      }
    };
  }
}