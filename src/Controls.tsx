import React from "react";
import * as Store from "./Store";

export default () =>
{
    const {State, Dispatch}:Store.Binding = Store.Consume();

    const currentTest:Store.Test = State.List[State.Test];
    const currentFreq:Store.Frequency = currentTest.Freq[State.Freq];

    const handleSelect = (event:any) =>
    {
        let index:number = parseInt(event.target.value) || 0;
        Dispatch(Store.Actions.Test, index);
    };

    return <div>

        <dl>
            <dt>test select</dt>
            <select onChange={ handleSelect } value={State.Test}>
                { State.List.map( (t:Store.Test, i:number)=> <option value={i}>{ t.Name }</option> ) }
            </select>
        </dl>

        <h3>{ currentTest.Name }</h3>
        <h4>{ currentFreq.Hz }</h4>
        <button onClick={()=>Dispatch(Store.Actions.Mark, 1)}>Mark this</button>
        <div>
            { currentTest.Freq.map( (f:Store.Frequency)=><div style={{display:"inline-block", margin:"10px"}} key={f.Hz}>
                {f.Hz}
                <br/>
                { f.AL.Answer ? f.AL.Answer[0] : "na"}
                </div> )
            }
        </div>

        <dl>
            <dt>Frequency</dt>
            <dd>{ State.Freq }</dd>
            <dd><button onClick={()=>Dispatch(Store.Actions.Freq, State.Freq+1)}>+</button></dd>
            <dd><button onClick={()=>Dispatch(Store.Actions.Freq, State.Freq-1)}>-</button></dd>
        </dl>

        <dl>
            <dt>Stimulus</dt>
            <dd>{ State.dBHL }</dd>
            <dd><button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL+5)}>+</button></dd>
            <dd><button onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL-5)}>-</button></dd>
        </dl>

    </div>;
}