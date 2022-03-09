import React, { ReactElement } from "react";
import * as Au from "./types";
import Store, { Actions } from "./store";

const perc = (min: number, val: number, max: number): string =>
  `${((val - min) / (max - min)) * 100}%`;

export default ({ frequency }: { frequency: Au.Frequency }): ReactElement => {
  const { Dispatch, State } = Store.Consume();

  
  return (
    <div style={{ display: "inline-block" }}>
      <h2
        onClick={() => {
          Dispatch(Actions.SetFrequency, frequency.Hz);
        }}
      >
        {frequency.Hz}
      </h2>
      <h3>{State.Freq}</h3>
      <div
        style={{
          position: "relative",
          height: "500px",
          width: "50px",
          border: "1px solid black"
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: perc(-10, frequency.AL.Sample[0] || 0, 130)
          }}
        >
          AL
        </div>
      </div>
    </div>
  );
};
