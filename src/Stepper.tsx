import React from "react";
import styled from "styled-components";

const dl = {
Step: styled.dl`
    display: flex;
    align-items: center;
    gap: 5px;

    color: #333333;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

    dt
    {
        
    }

    dd
    {
        margin: 0;
    }
    dd.Label
    {
        width: 100%;
        text-align: right;
        padding-right: 5px;
    }

    button
    {
        appearance: none;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 30px;
        background: #333333;
    }
    svg
    {
         width: 10px;
        height: 10px;
    }
    line
    {
        stroke: #dddddd;
        stroke-width: 2px;
    }
`
};

export default () =>
{
    return <dl.Step>
        <dt>Frequency</dt>
        <dd className="Label"><strong>500</strong> <span>Hz</span></dd>
        <dd>
            <button>
                <svg>
                    <line x1="0%" y1="50%" x2="100%" y2="50%"/>
                </svg>
            </button>
        </dd>
        <dd>
            <button>
                <svg>
                    <line x1="0%" y1="50%" x2="100%" y2="50%"/>
                    <line y1="0%" x1="50%" y2="100%" x2="50%"/>
                </svg>
            </button>
        </dd>
    </dl.Step>
};