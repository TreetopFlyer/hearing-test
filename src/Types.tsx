export type Session =
{
  Chan: boolean,
  dBHL: number,
  Freq: number,
  Test: number,
  List: Array<Test>
};

export type Test =
{
  Name: string,
  Freq: Array<Frequency>
};

export type Frequency = 
{
  Hz: number;
  AL: SamplePair,
  AR: SamplePair
};

export type SamplePair =
{
  Sample: Sample,
  Answer: Sample | null
};

export type Sample = [ number | null, number | null, boolean ];