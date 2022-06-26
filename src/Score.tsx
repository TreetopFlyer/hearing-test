import React from "react";
import * as Store from "./Store";

export default () =>
{
    const {State} = Store.Consume();
    const currentTest = State.List[State.Test];

    const scores = Store.useScore(State, currentTest);

    return <div>
        <div><strong>{scores.Total.Points}</strong>{scores.Total.List.join(" _ ")}</div>
        <div><strong>{scores.Left.Points }</strong>{ scores.Left.List.join(" _ ")}</div>
        <div><strong>{scores.Right.Points}</strong>{scores.Right.List.join(" _ ")}</div>
    </div>
};