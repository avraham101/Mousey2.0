
//-----------------------------------------------Types------------------------------------------
export type Feature = Identity | Atan | Divide | Sin | Tan | Mul | WithOutZGyro;
type Featured = (x:number, y:number, g:number, xx:number, yy:number) => {x:number, y:number, g:number, xx:number, yy:number};

export interface Identity  {
  tag: 'Identity',
  featured: Featured;
}

export interface Atan {
  tag: 'Atan',
  featured: Featured;
}

export interface Divide  {
  tag: 'Divide',
  DIVISOR: number,
  featured: Featured;
}

export interface Mul  {
  tag: 'Mul',
  MULSOR: number,
  featured: Featured;
}

export interface Sin  {
  tag: 'Sin',
  featured: Featured;
}

export interface Tan  {
  tag: 'Tan',
  featured: Featured,
}

//TODO Abs

export interface WithOutZGyro {
  tag: 'WithOutZGyro',
  featured: Featured,
}

//-----------------------------------------------constructors-----------------------------------
export const makeIdentity = ():Identity => {
  var f = (x:number, y:number, g:number, xx:number, yy:number):{x:number, y:number, g:number, xx:number, yy:number} => {
    return {x:x, y:y, g:g, xx:xx, yy:yy};
  }
  return {tag:'Identity', featured:f};
}

export const makeAtan = ():Atan => {
  var f = (a:number):number => {
    return Math.atan(a);
  }
  var ff = (x:number, y:number, g:number, xx:number, yy:number): {x:number, y:number, g:number, xx:number, yy:number} => {
    return {x:f(x), y:f(y), g:f(g), xx:f(xx), yy:f(yy)}
  }
  return {tag:'Atan', featured:ff};
}

export const makeDivide = (_DIVISOR:number):Divide => {
  var f = (a:number):number => {
    return a/_DIVISOR;
  }
  var ff = (x:number, y:number, g:number, xx:number, yy:number): {x:number, y:number, g:number, xx:number, yy:number} => {
    return {x:f(x), y:f(y), g:f(g), xx:f(xx), yy:f(yy)}
  }
  return {tag:'Divide', DIVISOR:_DIVISOR, featured:ff};
}

export const makeMul = (_MULSOR:number):Mul => {
  var f = (a:number):number => {
    return a*_MULSOR;
  }
  var ff = (x:number, y:number, g:number, xx:number, yy:number): {x:number, y:number, g:number, xx:number, yy:number} => {
    return {x:f(x), y:f(y), g:f(g), xx:f(xx), yy:f(yy)}
  }
  return {tag:'Mul', MULSOR:_MULSOR, featured:ff};
}

export const makeSin = ():Sin => {
  var f = (a:number):number => {
    return Math.sin(a);
  }
  var ff = (x:number, y:number, g:number, xx:number, yy:number): {x:number, y:number, g:number, xx:number, yy:number} => {
    return {x:f(x), y:f(y), g:f(g), xx:f(xx), yy:f(yy)}
  }
  return {tag:'Sin', featured:ff};
}

export const makeTan = ():Tan => {
  var f = (a:number):number => {
    return Math.tan(a);
  }
  var ff = (x:number, y:number, g:number, xx:number, yy:number): {x:number, y:number, g:number, xx:number, yy:number} => {
    return {x:f(x), y:f(y), g:f(g), xx:f(xx), yy:f(yy)}
  }
  return {tag:'Tan', featured:ff};
}

export const makeWithOutZGyro = (): WithOutZGyro => {
  var ff = (x:number, y:number, g:number, xx:number, yy:number): {x:number, y:number, g:number, xx:number, yy:number} => {
    return {x:x, y:y, g:0, xx:xx, yy:yy}
  }
  return {tag:'WithOutZGyro', featured:ff};
}

//---------------------------------------------type predicat-------------------------------------

export const isIdentity = (x:any):x is Identity => x.tag ==='Identity';

export const isAtan = (x:any):x is Atan => x.tag ==='Atan';

export const isDivide = (x:any):x is Divide => x.tag ==='Divide';

export const isMul = (x:any):x is Mul => x.tag ==='Mul';

export const isSin = (x:any): x is Sin => x.tag === 'Sin';

export const isTan = (x:any): x is Tan => x.tag === 'Tan';

export const isWithOutZGyro = (x:any): x is WithOutZGyro => x.tag ==='WithOutZGyro';
