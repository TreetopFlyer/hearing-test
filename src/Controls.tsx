import React, { useState, useEffect, useRef } from "react";
import * as Store from "./Store";
import styled, { keyframes, css } from "styled-components";
import Marker from "./Mark";

const UI = styled.div`

display: flex;
flex-direction: column;
gap: 30px 5px;
@media(max-width:1024px)
{
    justify-content: center;
    flex-direction: row;
    gap: 20px;
}
@media(max-width:720px)
{
    flex-direction: column;
}


dl, dt, dd
{
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    margin: 0;
    padding: 0;
}

dl
{
    display: flex;
    flex-direction: column;
    gap: 0;

    border-radius: 5px;

    overflow: hidden;
    background: #eee;
    background: rgb(172,172,172);
    background: linear-gradient(159deg, #ececec 0%, #e9e9e9 36%, #dfdfdf 37%, #ececec 100%);
    
    box-shadow: 0px 2px 5px #969696;

    text-align: center;

    dt
    {
        padding: 5px;
        border-top: 1px solid white;
        border-bottom: 1px solid #ccc;

        background: rgb(0 0 0 / 7%);

        color: #444444;
        font-weight: 900;
        text-transform: uppercase;
    }

    dl
    {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 5px;

        border-left: none;
        border-right: none;
        border-top: 1px solid white;
        border-bottom: 1px solid #ccc;

        border-radius: 3px;
        background: none;
        box-shadow: none;

        color: #333333;
        font-weight: 500;
        text-align: left;

        dt
        {
            flex: 1 1;

            padding: 10px;
            border: none;

            background: none;

            color: #666666;
            font-weight: 500;
            text-transform: none;
        }

        dd
        {
            display: flex;
            flex-direction: row;
            gap: 5px;
            padding: 5px;
        }
    }
}
`;

export const Select = styled.select`
    max-width: 500px;
    max-height: 30px;
    width:100%;
    box-shadow: inset 0px 3px 5px lightgrey;
    padding: 7px;
    color: #556b7e;
    border-radius: 6px;
    border: none;
    cursor: pointer;
`;
const _Button = ( props:any ) =>
{
    const [showGet, showSet] = useState(-1);
    useEffect(()=>
    {
        let timer:number = showGet ? -1 : setTimeout(()=>{showSet(1)});
        return ()=>clearInterval(timer);
    }
    , [showGet]);

    return <button
        className={ props.className }
        data-active={ props.active }
        disabled={ props.disabled || false }
        onClick={ (inEvent:any)=>{showSet(0);props.onClick(inEvent);}}>
        { props.children }
        { showGet > 0 && <span className="blink"/> }
    </button>;
};
export const Button = styled(_Button)`

    flex: 1 1;
    box-shadow: rgb(0 0 0 / 33%) 0px -3px 0px inset, rgb(255 255 255 / 38%) 0px 3px 7px inset;
    position: relative;
    display: inline-block;
    appearance: none;
    min-height: 30px;
    padding: 5px 10px 5px 10px;
    border: none;
    border-radius: 10px;
    background: #49b378;
    cursor: pointer;
    color: white;
    font-weight: 600;
    transition: all 0.4s;

&[disabled], &[disabled]:hover
{
    cursor: default;
    transform: scale(0.95);
    background: #aaa;
}
&:hover
{
    background: black;
}

&[data-active]
{
    width:100%;
    padding-top: 8px;
    padding-bottom: 8px;
}
&[data-active]::after
{
    content: " ";
    display: block;
    position: absolute;
    z-index: 20;
    top: 0;
    left: 50%;
    width: 20px;
    height: 0px;
    border-radius: 10px;
    background: #ffa600;
    outline: 2px solid transparent;
    box-shadow: 0px 0px 0px #ffa600;
    transform: translate(-50%, -50%);
    transition: all 0.4s;
}
&[data-active='true']::after
{
    height: 5px;
    outline: 2px solid white;
    box-shadow: 0px 0px 5px white;
    opacity: 1;
}

&[disabled][data-active='true'], &[disabled][data-active='true']:hover
{
    cursor: default;
    transform: scale(1);
    background: #49b378;
}

& span.blink
{
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    animation: ${ keyframes`
        0% { background: #ffa600ff; }
      100% { background: #ffa60000; }
    `} 0.4s linear;
    animation-fill-mode: both;
}

svg
{
    z-index: 10;
    position: relative;
    width: 10px;
    height: 10px;
    stroke: #dddddd;
    stroke-width: 2px;
    fill: #dddddd;
}
svg.large
{
    width: 16px;
    height: 16px;
}
`;

const ButtonMajor = styled(Button)`

    display: flex;
    align-items: stretch;
    width: 50%;
    min-height: 50px;
    max-height: 70px;
    padding: 0;
    margin: 7px 0 7px 0;

    .dark, .text
    {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px 0 10px;
    }

    .dark
    {
        background: rgba(0,0,0,0.3);
        border-bottom-left-radius: 10px;
           border-top-left-radius: 10px;
    }

`;

const IconMinus = () => <svg>
    <line x1="0%" y1="50%" x2="100%" y2="50%"/>
</svg>;

const IconPlus = () => <svg>
    <line x1="0%" y1="50%" x2="100%" y2="50%"/>
    <line y1="0%" x1="50%" y2="100%" x2="50%"/>
</svg>;

const IconTriangle = () => <svg>
    <polygon points="0,0 10,5 0,10" fill="#ffffff" stroke="none" />
</svg>;

const IconAccept = () => <svg className="large" viewBox="0 0 80 80">
    <path fill="white" d="M40 10.1818C23.5319 10.1818 10.1818 23.5319 10.1818 40C10.1818 56.4681 23.5319 69.8182 40 69.8182C56.4681 69.8182 69.8182 56.4681 69.8182 40C69.8182 38.2644 69.6699 36.5634 69.3853 34.9091L77.549 26.1818C79.1344 30.4885 80 35.1431 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40C0 17.9086 17.9086 0 40 0C50.7198 0 60.4547 4.21685 67.6364 11.0822L60.3248 18.1818C54.9991 13.2185 47.8542 10.1818 40 10.1818Z"/>
    <path fill="white" d="M82.6114 15.458L40.6981 59.2295L17.3886 34.8866L24.6114 27.9705L40.6981 44.7705L75.3886 8.54195L82.6114 15.458Z"/>
</svg>;

const IconNoResponse = () => <svg className="large" viewBox="0 0 80 80">
    <path fill="white" d="M33.004 42.3686V40.656C33.0401 37.2233 33.4002 34.3817 34.1396 32.1946C34.8678 30.041 35.9247 28.2334 37.3413 26.8243C38.6691 25.5036 40.2453 24.3034 42.0579 23.2177C43.001 22.6449 43.8439 21.9721 44.5902 21.1991C45.3031 20.4435 45.8655 19.5749 46.279 18.5847L46.2861 18.5679C46.6975 17.6179 46.9142 16.543 46.9142 15.3225C46.9142 13.8273 46.5646 12.6018 45.9142 11.5892C45.2356 10.5327 44.3336 9.72006 43.1829 9.14039C42.0246 8.55683 40.7204 8.25403 39.2458 8.25403C37.9841 8.25403 36.771 8.51297 35.5954 9.03606C34.4878 9.5289 33.5532 10.3046 32.7845 11.399C32.0673 12.42 31.5976 13.8333 31.468 15.7349L31.3804 17.0203H22L22.0685 15.573C22.22 12.37 23.0591 9.55427 24.636 7.18205L24.6403 7.17544C26.2122 4.8399 28.2845 3.05215 30.8333 1.82297L30.8369 1.82125C33.3892 0.599635 36.1997 0 39.2458 0C42.5367 0 45.4691 0.651571 47.9994 2.0063C50.5235 3.34827 52.5025 5.20947 53.8956 7.58907C55.308 9.97117 56 12.6679 56 15.6394C56 17.7193 55.6769 19.6425 55.0069 21.3898C54.3622 23.1169 53.423 24.6641 52.194 26.0233C50.9998 27.3636 49.5684 28.5364 47.913 29.5474C46.4406 30.4632 45.3077 31.4005 44.4812 32.3466L44.4738 32.3551C43.6815 33.2472 43.0955 34.3197 42.7242 35.5967C42.3464 36.8962 42.1245 38.5806 42.0897 40.6822V42.3686H33.004ZM40.8434 57.1715L40.8352 57.1765C39.9028 57.7329 38.866 58 37.7592 58C36.0943 58 34.6301 57.3918 33.439 56.2071C32.247 55.0215 31.6236 53.5507 31.6236 51.8662C31.6236 50.1818 32.247 48.711 33.439 47.5254C34.6301 46.3407 36.0943 45.7325 37.7592 45.7325C39.4242 45.7325 40.8884 46.3407 42.0795 47.5254C43.2715 48.711 43.8949 50.1818 43.8949 51.8662C43.8949 52.9797 43.6063 54.0224 43.0313 54.9642C42.4893 55.8807 41.7535 56.6196 40.8434 57.1715Z"/>
    <path fill="white" d="M15.0985 24.4273C6.70541 37.721 10.6025 55.3496 23.803 63.8019C37.0034 72.2543 54.5084 68.3297 62.9015 55.036C69.8215 44.0756 68.3868 30.1683 60.2716 20.8868C61.1356 18.0246 61.6326 14.6531 61.1063 11.208C60.9385 10.1099 60.6414 9.04066 60.2466 8.0095C77.2611 19.5542 82.1375 42.7212 71.063 60.2619C59.8039 78.0948 36.3216 83.3596 18.6137 72.0211C0.905831 60.6825 -4.32201 37.0344 6.93702 19.2015C9.83435 14.6124 13.5411 10.8557 17.7506 8C16.896 12.6276 16.6158 17.6549 16.8241 21.9837C16.2137 22.7591 15.6373 23.5739 15.0985 24.4273Z"/>
</svg>;

const IconClear = () => <svg className="large" viewBox="0 0 80 80">
    <path fill="white" d="M77 40.5C77 61.2107 60.2107 78 39.5 78C18.7893 78 2 61.2107 2 40.5C2 19.7893 18.7893 3 39.5 3C60.2107 3 77 19.7893 77 40.5ZM39.5 67.4737C54.3972 67.4737 66.4737 55.3972 66.4737 40.5C66.4737 25.6028 54.3972 13.5263 39.5 13.5263C24.6028 13.5263 12.5263 25.6028 12.5263 40.5C12.5263 55.3972 24.6028 67.4737 39.5 67.4737Z"/>
    <rect fill="white" x="14.3791" y="57.7923" width="61.8421" height="9.21053" transform="rotate(-45 14.3791 57.7923)"/>
</svg>;


const LightBlink = styled.circle`
    animation: ${keyframes`
        0% { opacity: 0.0;}
        5% { opacity: 0.0;}
       10% { opacity: 1.0;}
       80% { opacity: 1.0;}
       90% { opacity: 0.2;}
      100% { opacity: 0.0;}`} 2.2s linear;
    animation-fill-mode: both;
`;
const Light = ( { on }:{ on:boolean } ) => <svg width="60" height="60" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle  fill="url(#metal)" cx="39" cy="40" r="35"/>
    <circle  fill="url(#metal)" cx="39.5" cy="39.5" r="29.5" transform="rotate(180 39.5 39.5)"/>
    <circle  fill="url(#metal)" cx="39" cy="40" r="27"/>
    <circle  fill="url(#backwall)"cx="39" cy="40" r="25"/>
    <ellipse fill="url(#clearcoat)" cx="39" cy="33" rx="20" ry="16"/>
    { on && <LightBlink fill="url(#light)" cx="39.5" cy="39.5" r="36"/> }
    <defs>
        <linearGradient id="metal" x1="39.5" y1="1" x2="39.5" y2="78" gradientUnits="userSpaceOnUse">
            <stop offset="0.0" stop-color="#C4C4C4" stop-opacity="1.0"/>
            <stop offset="1.0" stop-color="#F2F2F2" stop-opacity="1.0"/>
        </linearGradient>
        <radialGradient id="backwall" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39 56) rotate(-90) scale(45.5 74.4907)">
            <stop offset="0.0" stop-color="#AAAAAA" stop-opacity="1.0"/>
            <stop offset="1.0" stop-color="#333333" stop-opacity="1.0"/>
        </radialGradient>
        <radialGradient id="clearcoat" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39 38.5) rotate(90) scale(50.5 71.9394)">
            <stop offset="0.0" stop-color="#ffffff" stop-opacity="0.0"/>
            <stop offset="0.7" stop-color="#ffffff" stop-opacity="1.0"/>
        </radialGradient>
        <radialGradient id="light" cx="0" cy="0" r="1.0" gradientUnits="userSpaceOnUse" gradientTransform="translate(39.5 39.5) rotate(90) scale(39.5)">
            <stop offset="0.2" stop-color="#ffffff" stop-opacity="1.0"/>
            <stop offset="0.5" stop-color="#ff8800" stop-opacity="1.6"/>
            <stop offset="0.9" stop-color="#ffffff" stop-opacity="0.0"/>
        </radialGradient>
    </defs>
</svg>
;


export default () =>
{
    const {State, Dispatch}:Store.Binding = Store.Consume();
    const currentTest:Store.Test = State.List[State.Test];
    const currentFreq:Store.Frequency = currentTest.Plot[State.Freq];
    const currentChan:Store.SamplePair = State.Chan == 0 ? currentFreq.AL : currentFreq.AR;

    const [askGet, askSet] = useState(0);
    const [responseGet, responseSet] = useState(0);

    useEffect(()=>{
        let timer:number | undefined = undefined;
        if(askGet == 1)
        {
            responseSet(State.dBHL - currentChan.Answer[0]);
            timer = setTimeout(()=>{askSet(2);}, 300 + Math.random()*1000);
        }
        return () => clearTimeout(timer);
    }, [askGet]);

    const refSave = useRef(null);
    const handleSave = () =>
    {
        refSave.current.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(JSON.stringify(State)));
        refSave.current.setAttribute('download', "aud.json");
        refSave.current.click();
    };

    const refLoad = useRef(null);
    const handleLoad = () =>
    {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            Dispatch(Store.Actions.Load, JSON.parse(reader.result.toString()));
        });
        reader.readAsText(refLoad.current.files[0]);
    };

    return <UI>

        <dl>
            <dt>Controls</dt>
            <dl>
                <dt>Channel:</dt>
                <dd>
                    <Button disabled={ State.Chan == 0 } active={State.Chan == 0} onClick={()=>Dispatch(Store.Actions.Chan, 0)}>Left</Button>
                    <Button disabled={ State.Chan == 1 } active={State.Chan == 1} onClick={()=>Dispatch(Store.Actions.Chan, 1)}>Right</Button>
                </dd>
            </dl>
            <dl>
                <dt>Frequency:</dt>
                <dd><strong>{ currentFreq.Hz }</strong> Hz</dd>
                <dd>
                    <Button disabled={State.Freq == 0} onClick={()=>Dispatch(Store.Actions.Freq, State.Freq-1)}>
                        <IconMinus/>
                    </Button>
                    <Button disabled={State.Freq == currentTest.Plot.length-1} onClick={()=>Dispatch(Store.Actions.Freq, State.Freq+1)}>
                        <IconPlus/>
                    </Button>
                </dd>
            </dl>
            <dl>
                <dt>Stimulus:</dt>
                <dd><strong>{ State.dBHL }</strong> dBHL</dd>
                <dd>
                    <Button disabled={State.dBHL == currentTest.Clip[0]} onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL-5)}>
                        <IconMinus/>
                    </Button >
                    <Button disabled={State.dBHL == currentTest.Clip[1]} onClick={()=>Dispatch(Store.Actions.dBHL, State.dBHL+5)}>
                        <IconPlus/>
                    </Button>
                </dd>
            </dl>
            <dl>
                <dt>Response:</dt>
                <dd><Light on={ (askGet == 2) && (responseGet >= 0) }/></dd>
                <dd>
                    <ButtonMajor onClick={()=>askSet(1)} disabled={askGet == 1}>
                        <span className="dark"><IconTriangle/></span>
                        <span className="text">Present Tone</span>
                    </ButtonMajor>
                </dd>
            </dl>
            <dl>
                <dt>Method:</dt>
                <dd>
                    <Button disabled={State.Tone == 0} active={State.Tone == 0} onClick={()=>Dispatch(Store.Actions.Tone, 0)}>Pulsed</Button>
                    <Button disabled={State.Tone == 1} active={State.Tone == 1} onClick={()=>Dispatch(Store.Actions.Tone, 1)}>Continuous</Button>
                </dd>
            </dl>
        </dl>


        <dl>
            <dt>Thresholds</dt>
            <dl>
                <dt>Mark:</dt>
                <dd>
                    <span><strong>{ State.Chan == 1 ? "Right" : "Left" }</strong> ear</span> /
                    <span><strong>{ currentFreq.Hz }</strong> Hz</span> /
                    <span><strong>{ State.dBHL }</strong> dBHL</span>
                </dd>
            </dl>
            <dl>
                <dd>
                    <ButtonMajor onClick={()=>Dispatch(Store.Actions.Mark, 1)}>
                        <span className="dark">
                            <Marker style={{left:"5px", top:"5px", fill:"none"}} channel={State.Chan} response={true} active={false}/>
                        </span><span className="text">Accept</span>
                    </ButtonMajor>
                    <ButtonMajor onClick={()=>Dispatch(Store.Actions.Mark, 0)}>
                        <span className="dark">NR</span><span className="text">No Response</span>
                    </ButtonMajor>
                    <ButtonMajor onClick={()=>{Dispatch(Store.Actions.Mark, -1)}} disabled={!currentChan.Sample}>
                        <span className="dark"><IconClear/></span><span className="text">Clear Threshold</span>
                    </ButtonMajor>
                </dd>
            </dl>
            <dl>
                <dt>Answer Key:</dt>
                <dd>
                    <Button disabled={State.Show == 0} active={State.Show == 0} onClick={()=>Dispatch(Store.Actions.Show, 0)}>Hide</Button>
                    <Button disabled={State.Show == 1} active={State.Show == 1} onClick={()=>Dispatch(Store.Actions.Show, 1)}>Show</Button>
                </dd>
            </dl>
            <dl>
                <dt>Placement Preview:</dt>
                <dd>
                    <Button disabled={State.View == 0} active={State.View == 0} onClick={()=>Dispatch(Store.Actions.View, 0)}>Hide</Button>
                    <Button disabled={State.View == 1} active={State.View == 1} onClick={()=>Dispatch(Store.Actions.View, 1)}>Show</Button>
                </dd>
            </dl>
        </dl>
    </UI>;
}