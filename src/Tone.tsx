// setup audio context
const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
const Context = new AudioContextConstructor();

// create audio nodes
const Oscillator = Context.createOscillator();
const GainVolume = Context.createGain();
const GainBeep = Context.createGain();
const GainLeft = Context.createGain();
const GainRight = Context.createGain();
const ChannelMerge = Context.createChannelMerger(2);

// wire up audio nodes
Oscillator.connect(GainVolume);
GainVolume.connect(GainBeep);
GainBeep.connect(GainLeft);
GainBeep.connect(GainRight);
GainLeft.connect(ChannelMerge, 0, 0);
GainRight.connect(ChannelMerge, 0, 1);
ChannelMerge.connect(Context.destination);

// start
GainBeep.gain.value = 0;
GainLeft.gain.value = 0;
GainRight.gain.value = 0;
GainVolume.gain.value = 0;
Oscillator.start(Context.currentTime+0.0);

const beep = [ 0.0, 1.0, 0.1, 0.0, 1.0, 0.1, 0.0, 1.0, 0.1, 0.0, 0.0, 0.0 ];
const hold = [ 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.1, 0.0, 0.0 ];

const change = (inNode, inValue, inDelay) => inNode.linearRampToValueAtTime(inValue, Context.currentTime+inDelay);

const Start = (inDuration:number, inContinuous:number, inChannel:number, inFreq:number, indBHL:number):void =>
{
    Context.resume();
    GainBeep.gain.cancelScheduledValues(Context.currentTime);
    GainBeep.gain.setValueAtTime(0, Context.currentTime);

    const pad = 0.01;
    change(GainLeft.gain,        1-inChannel, pad);
    change(GainRight.gain,       inChannel,   pad);
    change(Oscillator.frequency, inFreq,      pad);
    change(GainVolume.gain,      indBHL,      pad);

    const pattern = inContinuous == 1 ? hold : beep;
    const slice = inDuration/(pattern.length-1);
    pattern.forEach( (item, i)=> change(GainBeep.gain, item, (i*slice)+pad) )
};

export default Start;