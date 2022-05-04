
var Tone =
{
    Context:false,
    Oscillator:false,
    GainBeep:false,
    GainVolume:false,
    GainLeft:false,
    GainRight:false,
    ChannelMerge:false,

    Pattern:[0, 1, 0.1, 0, 1, 0.1, 0, 1, 0.1, 0, 0, 0],
    Duration:1,
    KeepBeeping:false,
    Timer:-1
};
Tone.Init = function()
{
    // setup audio context
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    Tone.Context = new AudioContext();

    // create audio nodes
    Tone.Oscillator = Tone.Context.createOscillator();
    Tone.GainVolume = Tone.Context.createGain();
    Tone.GainBeep = Tone.Context.createGain();
    Tone.GainLeft = Tone.Context.createGain();
    Tone.GainRight = Tone.Context.createGain();
    Tone.ChannelMerge = Tone.Context.createChannelMerger(2);

    // wire up audio nodes
    Tone.Oscillator.connect(Tone.GainVolume);
    Tone.GainVolume.connect(Tone.GainBeep);
    Tone.GainBeep.connect(Tone.GainLeft);
    Tone.GainBeep.connect(Tone.GainRight);
    Tone.GainLeft.connect(Tone.ChannelMerge, 0, 0);
    Tone.GainRight.connect(Tone.ChannelMerge, 0, 1);
    Tone.ChannelMerge.connect(Tone.Context.destination);

    // start
    Tone.GainBeep.gain.value = 0;
    Tone.GainLeft.gain.value = 0;
    Tone.GainRight.gain.value = 0;
    Tone.GainVolume.gain.value = 0;
    Tone.Oscillator.start(Tone.Context.currentTime+0.0);
};
Tone.Start = function()
{
    var i;
    var value, time;

    Tone.KeepBeeping = true;
    Tone.Context.resume();
    Tone.GainBeep.gain.cancelScheduledValues(Tone.Context.currentTime);
    Tone.GainBeep.gain.setValueAtTime(0, Tone.Context.currentTime);

    for(i=0; i<Tone.Pattern.length; i++)
    {
        value = Tone.Pattern[i];
        time =  (i*Tone.Duration/(Tone.Pattern.length-1));
        Tone.GainBeep.gain.linearRampToValueAtTime(value, Tone.Context.currentTime+time);
    }
    clearInterval(Tone.Timer);
    Tone.Timer = setTimeout(function()
    {
        if(Tone.KeepBeeping)
        {
            Tone.Start();
        }
    }, Tone.Duration*1000);
};
Tone.Stop = function()
{
    Tone.KeepBeeping = false;
}
Tone.SetFrequency = function(inHz)
{
    Tone.Oscillator.frequency.linearRampToValueAtTime(inHz, Tone.Context.currentTime+0.01);
};
Tone.SetStereo = function(inRight)
{
    Tone.GainLeft.gain.linearRampToValueAtTime(1-inRight, Tone.Context.currentTime+0.01);
    Tone.GainRight.gain.linearRampToValueAtTime(inRight, Tone.Context.currentTime+0.01);
};
Tone.SetVolume = function(inAmount)
{
    Tone.GainVolume.gain.linearRampToValueAtTime(inAmount, Tone.Context.currentTime+0.1);
}

Tone.Init();
