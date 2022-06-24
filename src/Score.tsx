import React, { useMemo, useEffect } from "react";
import * as Store from "./Store";

const ScoreChannel = (inTest:Store.Test,  inKey:"AL"|"AR"):Array<number|boolean> =>
{
    return inTest.Plot.map((f) =>
    {
        let sample = f[inKey].Sample;
        let answer = f[inKey].Answer;
        if(sample)
        {
            let error = Math.abs(answer[0] - sample[0]);
            if(error == 0)
            {
                return 7;
            }
            else if(error <= 5) 
            {
                return 5;
            }
            else
            {
                return 0;
            }
        }
        else
        {
            return false;
        }
    });
};

export default () =>
{
    const {State} = Store.Consume();
    const currentTest = State.List[State.Test];

    const scoresLeft  = ScoreChannel(currentTest, "AL");
    const scoresRight = ScoreChannel(currentTest, "AR");

    return <div>
        <div>{scoresLeft.join(" _ ")}</div>
        <div>{scoresRight.join(" _ ")}</div>
    </div>
}