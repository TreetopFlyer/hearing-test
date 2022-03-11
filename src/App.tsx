import React from "react";
import { render } from "react-dom";
import Component from "./Controls";
import * as Store from "./Store";

render(<Store.Provide><Component/></Store.Provide>, document.querySelector("#app"));