import React from "react";
import * as Store from "./Store";

export default () =>
{
    const {State, Dispatch} = Store.Consume();

    return <div>
        <dl>
            <dt>volume</dt>
            <dd>{ State.dBHL }</dd>
            <dd><button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL+5)}>+</button></dd>
            <dd><button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL-5)}>-</button></dd>
        </dl>
        
        <hr/>
        <a href="/">Le Link?</a>
    </div>;
}