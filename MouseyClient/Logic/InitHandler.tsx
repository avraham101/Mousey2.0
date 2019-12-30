import {RowInMap, createRowInMap} from './DataTypes/Sensors'

const SAMPLE_SIZE:number    = 8;
const NOT_MOVING_SAMPLE_SIZE:number = SAMPLE_SIZE*12;
const MIN_SPEED_X:number    = 0.1;
const MIN_SPEED_Y:number    = 1;
const MAX_SPEED_X:number    = 30;
const MAX_SPEED_Y:number    = 40;
const DEFAULT_VALUE:number  =-99;   //defualut init value for prev x and prev y
//The map for the sensors data
export var mapData:RowInMap[] = [];                        

//Interfaces
interface DataXY {
    tag:'DataXY',
    step: number,
    x:number,
    y:number
}

interface DataG {
    tag:'DataG',
    step:number,
    g:number
}

interface DataAcceleration {
    tag:'DataAcceleration',
    step:number,
    xx:number,
    yy:number,
}

//Constractors

var createDataXY = (_step:number, _x:number, _y:number):DataXY => { 
    return { tag:'DataXY', step: _step, x:_x, y: _y};
};
  
var createDataG = (_step:number,_g:number):DataG => { 
    return {tag:'DataG', step: _step, g:_g};
};

var createDataAcceleration = (_step:number,_xx:number, _yy:number):DataAcceleration => {
    return { tag:'DataAcceleration', step: _step, xx:_xx, yy:_yy};
};

//TODO TYPE PREDECATS

export class InitHandler {
  
  //Vars
  counterNotMoving:number = 0;              //The counter for the not moving movment
  step:number             = -1;             //the init step we are in          
  prevStep:number         = 0;              //the prev init step we are in
  pX:number               = DEFAULT_VALUE;  //the prev x point
  pY:number               = DEFAULT_VALUE;  //the prev y point
  collect_data:boolean    = false;          //if we are starting colleting data from movment
  //DATA MAPS
  mapDataXY:DataXY[] = [];                        //the map for X,Y data form Accelometer
  mapDataG:DataG[]   = [];                        //the map for G data from Gyroscope
  mapDataAcceleration:DataAcceleration[] = [];    //the map for X,Y data from Acceleration
  miniMapDataXY:DataXY[] = [];                    //the miniMap for X,Y data form Accelometer  --before adding it the map
  miniMapDataG:DataG[] = [];                      //the miniMap for G data from Gyroscope      --before adding it to the map 
  miniMapDataAcceleration:DataAcceleration[] =[]; //the miniMap for X,Y data from Acceleration --before adding it to the map 
  
  constructor() {
    this.counterNotMoving = 0;             
    this.step= -1;          
    this.prevStep= 0;             
    this.pX= DEFAULT_VALUE;  
    this.pY= DEFAULT_VALUE; 
    this.collect_data = false;
    mapData = [];                        
    this.mapDataXY = [];                        
    this.mapDataG  = [];                        
    this.mapDataAcceleration= []; 
    this.miniMapDataXY = [];                    
    this.miniMapDataG = [];                       
    this.miniMapDataAcceleration =[]; 
  }

  //The function return if the step is a Slow Step
  isSlow = ():Boolean => {
    return (this.step>=0 && this.step <=3); //|| (this.step
  }

  //The function return if the step is up or Down
  isDownUp = (step:number):boolean => {
    return (step==3) || (step==4); ///|| (step==7) || (step==8);
  }

  //The function return the current init step
  getInitStep = ():string => {
    switch(this.step) {
      case -1: return 'Start';
      case 0: return 'Right slow';
      case 1: return 'Left slow';
      case 2: return 'Up slow';
      case 3: return 'Down slow';
      case 4: return 'Right fast';
      case 5: return 'Left fast';
      case 6: return 'Up fast';
      case 7: return 'Down fast';
      case 8:  return 'Right Up';
      case 9:  return 'Left Down';
      case 10: return 'Right Down';
      case 11: return 'Left Up';
      case 12: return 'Not Moning';
      case 13: return 'End';
      case 14: return 'Remake';
      case 15: default: return 'Error';
    }
  };

  //The function return the name of the step
  getStepName = (step:number):string => {
    switch(step) {
      case -1: return 'Start';
      case 0:  return 'Right slow';
      case 1:  return 'Left slow';
      case 2:  return 'Up slow';
      case 3:  return 'Down slow';
      case 4:  return 'Right fast';
      case 5:  return 'Left fast';
      case 6:  return 'Up fast';
      case 7:  return 'Down fast';
      case 8:  return 'Right Up';
      case 9:  return 'Left Down';
      case 10: return 'Right Down';
      case 11: return 'Left Up';
      case 12: return 'Not Moning';
      case 13: return 'End';
      case 14: return 'Remake';
      case 15: default: return 'Error';
    }
  };

  //The function get the step number from str
  getNumStep = (str:string):number => {
    switch(str) {
      case 'Start':       return -1;
      case 'Right slow':  return 0;
      case 'Left slow':   return 1;
      case 'Up slow':     return 2;
      case 'Down slow':   return 3;
      case 'Right fast':  return 4;
      case 'Left fast':   return 5;
      case 'Up fast':     return 6;
      case 'Down fast':   return 7;
      case 'Right Up':    return 8;
      case 'Left Down':   return 9;
      case 'Right Down':  return 10;
      case 'Left Up':     return 11;
      case 'Not Moving':  return 12;
      case 'End':         return 13;
      case 'Remake':      return 14;
      case 'Error': default: return 15;
    }
  };

  //The function return a speed of x due to the test
  evalSpeedX = (step:number):number => {
    let str:string = this.getStepName(step);
    switch(str) {
      case 'Right slow':                  return MIN_SPEED_X;
      case 'Right fast':                  return MAX_SPEED_X; 
      case 'Left slow':                   return -MIN_SPEED_X; 
      case 'Left fast':                   return -MAX_SPEED_X;
      case 'Right Up': case 'Right Down': return (MIN_SPEED_X+MAX_SPEED_X)/2;
      case 'Left Up': case 'Left Down':   return -(MIN_SPEED_X+MAX_SPEED_X)/2;
      case 'Not Moving': default:         return 0;
    }
  };

  //The function return a speed of y due to the test
  evalSpeedY = (step:number):number => {
    let str:string = this.getStepName(step);
    switch(str) {
      case 'Up slow':                       return -MIN_SPEED_Y;
      case 'Up fast':                       return -MAX_SPEED_Y;
      case 'Down slow':                     return MIN_SPEED_Y;
      case 'Down fast':                     return MAX_SPEED_Y; 
      case 'Right Up': case 'Left Up':      return -MIN_SPEED_Y/10;
      case 'Right Down': case 'Left Down':  return +MIN_SPEED_Y/10;
      case 'Not Moving': default:           return 0;
    }
  };

  //The function add the data to the miniMapXY
  addDataToMiniMapXY = (step:number, x:number, y:number):void => {
    this.miniMapDataXY.push(createDataXY(step, x, y));
  };

  //The function add the data to the miniMapG
  addDataToMiniMapG = (step:number, g:number):void => {
    this.miniMapDataG.push(createDataG(step,g));
  };

  //The function add the data to the miniMapAcceleration
  addDataToMiniAcceleration = (step:number,xx:number, yy:number):void => {
    this.miniMapDataAcceleration.push(createDataAcceleration(step, xx, yy));
  };

  //The function combine the data from the miniMaps
  combineDataFromMiniMaps = ():RowInMap[] => {
    let output:RowInMap[] = [];
    let arrA:DataXY[] = this.mapDataXY;
    let arrG:DataG[] = this.mapDataG;
    let arrC:DataAcceleration[] = this.mapDataAcceleration;
    console.log('length: arrA- '+arrA.length+' arrG- '+arrG.length+' arrC- '+arrC.length);
    for(let i=0, j=0, k=0; i<arrA.length && j<arrG.length && k<arrC.length; i++, j++, k++) {
      let stepA:number = arrA[i].step;
      let stepG:number = arrG[j].step;
      let stepC:number = arrC[k].step;
      if(stepA==stepG && stepG==stepC) {
        let vX = this.evalSpeedX(stepA);
        let vY = this.evalSpeedY(stepA);
        output.push(createRowInMap(vX, vY, arrA[i].x, arrA[i].y, arrG[j].g, arrC[k].xx, arrC[k].yy));
      }
      //maybe the information is not equal in size collect the data that happended at the exact momoent
      while ((stepA > stepG || stepC > stepG) && j<arrG.length-1) {
        j++;
        stepG = arrG[j].step;
      }
      while((stepG > stepA || stepC > stepA) && i<arrA.length-1) {
        i++;
        stepA = arrA[i].step;
      }
      while((stepA > stepC || stepG > stepC) && k<arrC.length-1) {
        k++;
        stepC = arrC[k].step;
      }
    }
    return output;
  };

  //The function add the miniMpaDataXY and minMapG and miniMapAcceleration to the Map
  addDataToMap = ():boolean => {
    let add:number = SAMPLE_SIZE;
    if(this.isSlow())
      add = SAMPLE_SIZE * 1.2;
    if(this.miniMapDataXY.length>=add) {
      this.mapDataG = this.mapDataG.concat(this.miniMapDataG);
      this.mapDataXY = this.mapDataXY.concat(this.miniMapDataXY);
      this.mapDataAcceleration = this.mapDataAcceleration.concat(this.miniMapDataAcceleration);
      this.miniMapDataXY = [];
      this.miniMapDataG = [];
      this.miniMapDataAcceleration = [];
      return true;
    }
    console.log('Ipos Step '+this.getStepName(this.step)+' with '+this.miniMapDataXY.length);
    this.miniMapDataXY = [];
    this.miniMapDataG = [];
    this.miniMapDataAcceleration = [];
    return false;
  };

  //The function move to the next init step
  nextStep = () => {
    if(this.getInitStep()=='Start' || this.addDataToMap()) {
      this.step++;
    }
    else {
      this.prevStep = this.step;
      this.step = this.getNumStep('Remake'); //Remake
    }
  };

  //The function cheack the diffrents between x\y to prev x\prev y
  equal = (x:number,y:number):boolean => {
    return (Math.abs(x-this.pX)<=0.01) && (Math.abs(y-this.pY)<=0.01);
  };

  //The function round up a value to 3 numbers after the point
  round = (n:number):number => {
    return Math.floor(n * 100) / 100;
  };
  
  //The function Analyze the data
  analayzeInitData = () => { 
    //combine all the data
    mapData = this.combineDataFromMiniMaps();
  }; 
  
  //The function saving the the data from x and y while moving to the step needed
  execMovingXY = (data:{x:number, y:number, z:number}) => {
    let {x,y,z} = data;
    //x = this.round(x);
    //y = this.round(y);
    if(this.pX==DEFAULT_VALUE && this.pY==DEFAULT_VALUE) { 
      //console.log('Accelometer Ipos Prev');
      this.pX = x;
      this.pY = y;
    }
    else {
      if(!this.equal(x,y)) {
        this.collect_data = true;
        //console.log('('+this.step+') Aceelometer Prev <'+this.pX+','+this.pY+'> new <'+x+','+y+'>');
        this.pX = x;
        this.pY = y;
        this.addDataToMiniMapXY(this.step,x, y);
      }
      else if(this.collect_data) {
        this.collect_data = false;
        this.pX = DEFAULT_VALUE;
        this.pY = DEFAULT_VALUE;
        this.nextStep();
      }
    }
  };

  //The function saving the the data from x and y while moving to the step needed
  execNotMovingXY = (data:{x:number, y:number, z:number}) => {
    let {x,y,z} = data;
    //x = this.round(x);
    //y = this.round(y);
    this.addDataToMiniMapXY(this.step,x, y);
  };
  
  //The function saving the the data from g
  execMovingG = (data:{x:number, y:number, z:number}) => {
    let {x,y,z} = data;
    if(this.collect_data) {
      this.addDataToMiniMapG(this.step,z);
    }
  };

  //The function saving the the data from g
  execNotMovingG = (data:{x:number, y:number, z:number}) => {
    let {x,y,z} = data;
    this.addDataToMiniMapG(this.step,z);
    if(this.counterNotMoving> NOT_MOVING_SAMPLE_SIZE) {
      this.nextStep();
    }
    else
        this.counterNotMoving++;
  };

  //The function saving the the data from Acceleration
  execMovingAcceleration = (data:{x:number, y:number, z:number}) => {
    let {x,y,z} = data;
    if(this.collect_data) {
      //x = this.round(x);
      //y = this.round(y);
      this.addDataToMiniAcceleration(this.step,x,y);
    }
  };

  execNotMovingAcceleration = (data:{x:number, y:number, z:number}) => {
    let {x,y,z} = data;
    //x = this.round(x);
    //y = this.round(y);
    this.addDataToMiniAcceleration(this.step,x,y);
  };

  //The function is diracte you to which sensor you at
  execMoving = (sensor:string, data:any) => {
    switch(sensor) {
      case 'Accelometer':   this.execMovingXY(data); break;
      case 'Gyroscope':     this.execMovingG(data);  break;
      case 'Acceleration':  this.execMovingAcceleration(data); break; //TODO remove this
    }
  };

  //(Speacial case for not moving) The function is diracate you ti which sensir you at
  execNotMoving = (sensor:string, data:any) => {
    switch(sensor) {
      case 'Accelometer':   this.execNotMovingXY(data); break;
      case 'Gyroscope':     this.execNotMovingG(data);  break;
      case 'Acceleration':  this.execNotMovingAcceleration(data); break;
    }
  };

  //preform the step init with the spasific data from the sensors accumoloter 
  execAct = (sensor:string, data:any):boolean => {
    switch(this.getInitStep()) {
      case 'Start':       this.nextStep(); break; 
      case 'Right slow':  this.execMoving(sensor, data); break;
      case 'Left slow':   this.execMoving(sensor, data); break;
      case 'Up slow':     this.execMoving(sensor, data); break;
      case 'Down slow':   this.execMoving(sensor, data); break;
      case 'Right fast':  this.execMoving(sensor, data); break; 
      case 'Left fast':   this.execMoving(sensor, data); break; 
      case 'Up fast':     this.execMoving(sensor, data); break; 
      case 'Down fast':   this.execMoving(sensor, data); break; 
      case 'Right Up':    this.execMoving(sensor, data); break; 
      case 'Left Up':     this.execMoving(sensor, data); break; 
      case 'Right Down':  this.execMoving(sensor, data); break; 
      case 'Left Down':   this.execMoving(sensor, data); break; 
      case 'Not Moning':  this.execNotMoving(sensor,data); break;
      case 'Remake':      this.step = this.prevStep;
                          this.execMoving(sensor, data); break; 
      //case 'End': this.analayzeInitData(); This case happend manuly at the Accelometer init
      case 'Error': default:
        //TODO: maybe this case is not needed
        return false;
    }
    return true;
  };

}
