import { RowInMap } from './DataTypes/Sensors'
import * as E from './DataTypes/Equations';
import { Feature, makeAtan, makeDivide, makeSin, makeTan, isAtan, isDivide, isSin, isTan, 
  isMul, makeMul, isIdentity, makeIdentity, isWithOutZGyro, makeWithOutZGyro} from './DataTypes/Features'
//-----------------------------------------------Types------------------------------------------
export type Msg = GenerationMsg | EquationMsg |SpeedMsg | RClickMsg | LClickMsg | RollerMsg | FileMsg;

export interface GenerationMsg  {
  tag: 'GenerationMsg',
  opCode:0,
  map: RowInMap[],
}

export interface SpeedMsg {
  tag: 'SpeedMsg',
  opCode: 1,
  vx: number,
  vy: number,
}

interface RClickMsg {
  tag: 'RClickMsg',
  opCode: 2,
  click: boolean // click = true => down, click=false => up
}

interface LClickMsg {
  tag: 'LClickMsg',
  opCode: 3,
  click: boolean // click = true => down, click=false => up
}

interface RollerMsg {
  tag: 'RollerMsg',
  opCode: 4,
  speed: number // up = true => roll up, up=false => roll douwn
}

interface FileMsg {
  tag: 'FileMsg',
  opCode: 5,
  //TODO - nice to have this feature
}

export interface EquationMsg {
  tag: 'EquationMsg',
  opCode: 100,
  x: E.Equation,
  y: E.Equation,
  fx: Feature[],
  fy: Feature[],
  lenFx: number,
  lenFy:number,
}

//-----------------------------------------------constructors-----------------------------------
export const makeGenerationMsg = (_map:RowInMap[]):GenerationMsg => {
  return {tag:'GenerationMsg', opCode:0, map:_map};
}

export const makeEquationMsg = (_x:E.Equation, _y:E.Equation, _fx:Feature[], _fy:Feature[],_lenFx:number, _lenFy:number):EquationMsg => {
  return {tag:'EquationMsg', opCode:100, x:_x, y:_y, fx: _fx, fy:_fy, lenFx:_lenFx, lenFy:_lenFy};
}

export const makeSpeedMsg = (_vx:number, _vy:number):SpeedMsg => {
  return {tag:'SpeedMsg', opCode:1, vx:_vx, vy:_vy};
} 

export const makeRClickMsg = (_click:boolean):RClickMsg => {
  return {tag:'RClickMsg', opCode:2, click:_click};
}

export const makeLClickMsg = (_click:boolean):LClickMsg => {
  return {tag:'LClickMsg', opCode:3, click:_click};
}

export const makeRollerMsg = (_speed:number):RollerMsg => {
  return {tag:'RollerMsg', opCode:4, speed:_speed};
}

//TODO makeFileMsg

//---------------------------------------------type predicat-------------------------------------

export const isMsg = (x:any):x is Msg => {
  return isGenerationMsg(x) || isEquationMsg(x) || isSpeedMsg(x) || isRClickMsg(x) || isLClickMsg(x) || isRollerMsg(x); 
}

export const isGenerationMsg = (x:any):x is GenerationMsg => x.tag ==='GenerationMsg';

export const isEquationMsg = (x:any):x is EquationMsg => x.tag === 'EquationMsg';

export const isSpeedMsg = (x:any): x is SpeedMsg => x.tag === 'SpeedMsg';

export const isRClickMsg = (x:any): x is RClickMsg => x.tag === 'RClickMsg';

export const isLClickMsg = (x:any): x is LClickMsg => x.tag === 'LClickMsg';

export const isRollerMsg = (x:any): x is RollerMsg => x.tag === 'RollerMsg';

//TODO fileMsg predicat

//---------------------------------------------Encoder Functions---------------------------------
export var encode = (msg:Msg):{}|Error => 
    isGenerationMsg(msg)? encodeGenerationMsg(msg):
    isSpeedMsg(msg)? encodeSpeedMsg(msg):
    isRClickMsg(msg)? encodeRClickMsg(msg):
    isLClickMsg(msg)? encodeLClickMsg(msg):
    isRollerMsg(msg)? encodeRollerMsg(msg):
    Error('This isnt correct msg');

var seperator = 0;
var end       = 0;

//the function fix a number from float to int
var fixNumber = (n:number):number => {
  return Math.floor(n * 10000) / 10000;
}

var encodeGenerationMsg = (msg:GenerationMsg): {}|Error => {
  return {opCode:msg.opCode, generation:msg.map};
}

//The function encode SpeedMsg
var encodeSpeedMsg = (msg:SpeedMsg): {}|Error => {
  return { opCode:msg.opCode, vx: fixNumber(msg.vx), vy:fixNumber(msg.vy)};
} 

//The function encode Right Click Msg
var encodeRClickMsg = (msg:RClickMsg): {}|Error => { 
  return {opCode:msg.opCode, press:msg.click};
}

//The function encode Left Click Msg
var encodeLClickMsg = (msg:LClickMsg): {}|Error => { 
  return {opCode:msg.opCode, press:msg.click}; 
}

var encodeRollerMsg = (msg:RollerMsg): {}|Error => {
  console.log('Encode Roller Msg');
  return {opCode:msg.opCode, speed:msg.speed};
}

//TODO EquationMsg encoder
//TODO fileMsg encoder

//---------------------------------------------Decoder Functions--------------------------------
export var decode = (msg:string) : Msg | Error => {
  //console.log('start parse');
  let recived = JSON.parse(msg);
  console.log(msg);
  //console.log('start making');
  return (recived.opCode === 100)? decodeEquationMsg(recived): 
          Error('Not a compatible Msg');
}

//The function Responseble for decoding Equation Msg
var decodeEquationMsg = (msg:{x: any, y:any ,fx:any, fy:any, lenFx:any, lenFy:any}): EquationMsg| Error => {
  let x = msg.x;
  let y = msg.y;
  let ex = decodeEquation(x);
  let ey = decodeEquation(y);
  let lenFx = msg.lenFx;
  let lenFy = msg.lenFy;
  let fx = decodeFeaters(msg.fx, lenFx);
  let fy = decodeFeaters(msg.fy, lenFy);
  return makeEquationMsg(ex,ey, fx, fy, lenFx, lenFy);
}

//The function responseble for decode the Equations from Equation Msg
var decodeEquation = (eq:{tag:string}):E.Equation => {
  if(E.isLinearEquation3(eq))
    return E.makeLinearEquation3(eq.b0,eq.b1,eq.b2,eq.b3,eq.mse);
  else if(E.isLinearEquation5(eq))
    return E.makeLinearEquation5(eq.b0,eq.b1,eq.b2,eq.b3,eq.b4, eq.b5, eq.mse);
  else if(E.isPolmiyalEquation5(eq)) {
    let tmp = eq.ex;
    let y1 = E.makeLinearEquation3(tmp.b0,tmp.b1,tmp.b2,tmp.b3,tmp.mse);
    tmp = eq.ey 
    let y2 = E.makeLinearEquation3(tmp.b0,tmp.b1,tmp.b2,tmp.b3,tmp.mse);
    tmp = eq.eg;
    let y3 = E.makeLinearEquation3(tmp.b0,tmp.b1,tmp.b2,tmp.b3,tmp.mse);
    tmp = eq.exx;
    let y4 = E.makeLinearEquation3(tmp.b0,tmp.b1,tmp.b2,tmp.b3,tmp.mse);
    tmp = eq.eyy;
    let y5 = E.makeLinearEquation3(tmp.b0,tmp.b1,tmp.b2,tmp.b3,tmp.mse);
    let tmp2 = eq.multi;
    let y = E.makeLinearEquation5(tmp2.b0,tmp2.b1,tmp2.b2,tmp2.b3,tmp2.b4,tmp2.b5,tmp2.mse);
    return E.makePolmiyalEquation5(y1,y2,y3,y4,y5,y,eq.mse);
  }
  else {
    console.error('Cant decode Equation');
    return null;
  }
}

//The function Responseble for decode the Featuers from Equation Msg
var decodeFeaters = (arr:any[], len:number):Feature[] => {
  var out = [];
  for(let i=0;i< len; i++) {
    if(arr[i]!=undefined)
      out.push(decodeFeature(arr[i]));
  }
  return out;
}

//The function decode 1 feature for the EquationMsg
var decodeFeature = (f:{}): Feature => {
  if(isIdentity(f)) 
    return makeIdentity();
  else if(isAtan(f)) 
    return makeAtan();
  else if(isDivide(f)) 
    return makeDivide(f.DIVISOR);
  else if(isMul(f)) 
    return makeMul(f.MULSOR);
  else if(isSin(f))
    return makeSin();
  else if(isTan(f))
    return makeTan();
  else if(isWithOutZGyro(f))
    return makeWithOutZGyro();
  else {
    console.error("Cant decode Feature");
    return undefined;
  }
}
//TODO for all decoders