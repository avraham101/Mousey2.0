//-------------------------------------------------------------Types-------------------------------------------

//Explanation about RowInMap:
//vx,vy -> its numbers i desided due to the step, represents velocety at X and velocety at Y
//x,y   -> its data from the accumoletor sensor
//g     -> its thz z data from the gyroscope
//xx,yy -> its the acceleration of x and y from motionSensors
export interface RowInMap {
  tag:'RowInMap',
  vx:number, 
  vy:number,
  x:number, 
  y:number, 
  g:number, 
  xx:number, 
  yy:number
}

//-------------------------------------------------------Constractor------------------------------------------
export var createRowInMap = (_vx:number, _vy:number, _x:number, _y:number, _g:number, _xx:number, _yy:number):RowInMap =>{
  return {tag:'RowInMap',vx:_vx, vy:_vy, x:_x, y:_y, g:_g, xx:_xx, yy:_yy};
};