/** Pure learning calculations, not clinical decision support. */
export function bayesPositivePosterior(prevalence:number,sensitivity:number,falsePositiveRate:number):number|null{
 if(![prevalence,sensitivity,falsePositiveRate].every(x=>Number.isFinite(x)&&x>=0&&x<=1))return null;
 const truePositive=prevalence*sensitivity;
 const falsePositive=(1-prevalence)*falsePositiveRate;
 return truePositive+falsePositive===0?null:truePositive/(truePositive+falsePositive);
}
export function expectedValue(probability:number,payoff:number,otherwise=0):number|null{
 if(![probability,payoff,otherwise].every(Number.isFinite)||probability<0||probability>1)return null;
 if([payoff,otherwise].some(x=>Math.abs(x)>100000000))return null;
 return probability*payoff+(1-probability)*otherwise;
}
