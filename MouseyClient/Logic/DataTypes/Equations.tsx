
//-----------------------------------------------Types------------------------------------------
export type Equation = LinearEquation3 | LinearEquation5 | PolmiyalEquation5;
export type Equation5 = LinearEquation5 | PolmiyalEquation5; //for mainHandler GetSpeedX and Y

export interface LinearEquation3 {
  tag: 'LinearEquation3',
  b0:number,
  b1:number,
  b2:number,
  b3:number,
  mse:number,
  solve: (a:number,b:number,c:number)=>number;
}

export interface LinearEquation5  {
  tag: 'LinearEquation5',
  b0:number,
  b1:number,
  b2:number,
  b3:number,
  b4:number,
  b5:number,
  mse:number,
  solve: (a:number,b:number,c:number,d:number,e:number)=>number;
}

export interface PolmiyalEquation5 {
  tag: 'PolmiyalEquation5',
  ex: LinearEquation3,
  ey: LinearEquation3,
  eg: LinearEquation3,
  exx: LinearEquation3,
  eyy: LinearEquation3,
  multi: LinearEquation5,
  mse:number,
  solve: (a:number,b:number,c:number,d:number,e:number)=>number;
}

//-----------------------------------------------constructors-----------------------------------
export const makeLinearEquation3 = (_b0:number, _b1:number, _b2:number, _b3:number, _mse:number):LinearEquation3 => {
  var solveLinear3 = (a:number,b:number,c:number):number => {
    return _b0 + a * _b1 + b * _b2 + c * _b3;
  }
  return {tag:'LinearEquation3', b0:_b0, b1:_b1 , b2:_b2, b3:_b3 , mse:_mse,solve:solveLinear3};
}

export const makeLinearEquation5 = (_b0:number, _b1:number, _b2:number, _b3:number, _b4:number, _b5:number, _mse:number):LinearEquation5 => {
  var solveLinear5 = (a:number,b:number,c:number, d:number, e:number):number => {
    return _b0 + a * _b1 + b * _b2 + c * _b3 + d * _b4 + e* _b5;
  }
  return {tag:'LinearEquation5', b0:_b0, b1:_b1 , b2:_b2, b3:_b3, b4:_b4, b5:_b5 ,mse:_mse, solve:solveLinear5};
}

export const makePolmiyalEquation5 = ( _ex: LinearEquation3, _ey: LinearEquation3, _eg: LinearEquation3, _exx: LinearEquation3,
                                       _eyy: LinearEquation3, _multi: LinearEquation5, _mse:number) : PolmiyalEquation5 => {
  var solvePolmiyalEquation5 = (a1:number,a2:number,a3:number, a4:number, a5:number):number => {
      var y1:number = _ex.solve(a1, Math.pow(a1,2), Math.pow(a1,3));
      var y2:number = _ey.solve(a2, Math.pow(a2,2), Math.pow(a2,3));
      var y3:number = _eg.solve(a3, Math.pow(a3,2), Math.pow(a3,3));
      var y4:number = _exx.solve(a4, Math.pow(a4,2), Math.pow(a4,3));
      var y5:number = _eyy.solve(a5, Math.pow(a5,2), Math.pow(a5,3));
      return _multi.solve(y1,y2,y3,y3,y5);
  }
  return {tag:"PolmiyalEquation5", ex:_ex, ey:_ey, eg:_eg, exx:_exx, eyy:_eyy, multi:_multi, mse:_mse, solve:solvePolmiyalEquation5};
}

//---------------------------------------------type predicat-------------------------------------

export const isEquation5 = (x:any):x is Equation5 =>
  isLinearEquation5(x) || isPolmiyalEquation5(x);

export const isLinearEquation3 = (x:any):x is LinearEquation3 => x.tag ==='LinearEquation3';

export const isLinearEquation5 = (x:any):x is LinearEquation5 => x.tag ==='LinearEquation5';

export const isPolmiyalEquation5 = (x:any):x is PolmiyalEquation5 => x.tag ==='PolmiyalEquation5';