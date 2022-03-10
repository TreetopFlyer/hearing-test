import React from "react";
import { render } from "react-dom";
import Component from "./Component";
import * as Store from "./Store";

render(<div>
    <h1>hey</h1>
    <Store.Provide>
        <Component/>
    </Store.Provide>
</div>, document.querySelector("#app"));