export const Perc = (val: number, min: number, max: number): string => `${(val - min) / (max - min) * 100}%`;

export const Clip = (val:number, min:number, max:number):number =>
{
    if(val < min) { return min; }
    if(val > max) { return max; }
    return val;
};
