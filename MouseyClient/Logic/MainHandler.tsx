import {Queue} from './Queue';
import {Msg, makeGenerationMsg, makeSpeedMsg, makeRClickMsg, makeLClickMsg, makeRollerMsg} from './EncoderDecoder';
import {Equation5, isEquation5} from './DataTypes/Equations'
import {start, send, close} from './ConnectionHandler';
import {mapData} from './InitHandler';
import {SolveVx, SolveVy} from './ConnectionHandler';

export class MainHandler {
  
  //Vars for Sensor Movment
  qAccumulator = new Queue<{x:number,y:number}>();      //queue for the values from accumoletor
  qGyro = new Queue<{z:number}>();                      //queue for the values from gyroscope
  qAcceleration = new Queue<{xx:number,yy:number}>();   //queue for the values from acceleration
  vx=0;
  vy=0;
  //Vars for Pad Movment
  prevX=99; //defualtValue
  prevY=99; //defualtValue
  qVector = new Queue<{vx:number,vy:number}>();        //queue for the vector values
  //Vars for Roller Movment
  prevYroll=99;
  qRoller = new Queue<number>();                       // queue for the roller speed values
  rollerSensative = 50;                                 // rollerSpeed/rollerSensative its what send to server
  rollerSpeed = 0;
  constructor() {
  }
  
  startConnection = (ip:string, port:number):void => {
    //1) start the conection between server to client
    start(ip,port);
    //2) send the map data
    console.log('Trying to send Map Data to server, map length '+mapData.length);
    var msg:Msg = makeGenerationMsg(mapData);
    send(msg);
    //3) TODO get the equations 
  }

  //The function return the speed of vx and vy
  getSpeed = ():{vx:number,vy:number} => {
    return {vx:this.vx,vy:this.vy};
  }

  //the function return the speed at x
  getSpeedX = (x_acc:number, y_acc:number, z_gyro:number, xx_acceleration:number, yy_acceleratinon:number) => {
    return SolveVx(x_acc, y_acc, z_gyro, xx_acceleration, yy_acceleratinon);
  }

  //the function return the speed at y
  getSpeedY = (x_acc:number, y_acc:number, z_gyro:number, xx_acceleration:number, yy_acceleratinon:number) => {
    return SolveVy(x_acc, y_acc, z_gyro, xx_acceleration, yy_acceleratinon);
  }
  
  //-----------------------------------------------This Functions For Sending data----------------------------------------------

  //The function send the data to the server. if press is true means r click is on.
  sendRightClick = (press:boolean) => {
    var msg:Msg = makeRClickMsg(press);
    send(msg);
  };

  //The function send the data to the server. if press is true means l click is on.
  sendLeftClick = (press:boolean) => {
    var msg:Msg = makeLClickMsg(press);
    send(msg);
  };
  
  //The function send the data to the server
  sendSpeedData = (data:{vx:number,vy:number}) => {
    var msg:Msg = makeSpeedMsg(data.vx,data.vy);
    send(msg);
  }

  ///The function send the roller speed to the server
  sendRollerData = (vy:number) => {
    var msg:Msg = makeRollerMsg(vy);
    send(msg);
  }

  //TODO sendFile


  //-----------------------------------------------This Functions For Moving Mouse----------------------------------------------

  //The function process the data from Acc and Gyro and create a movment, this is a synchronic function!!
  processSpeedData = async()=> {
    if(this.qAccumulator.isEmpty() || this.qGyro.isEmpty() || this.qAcceleration.isEmpty())
      return;
    let acc:{x:number,y:number}       = this.qAccumulator.dequeue();
    //let acc2:{x:number, y:number}     = {x:acc.x, y:acc.y};                //duplicate of acc
    let gyro:{z:number}               = this.qGyro.dequeue();
    //let gyro2:{z:number}              = {z:gyro.z};                        //duplicate of gyro
    let acceler:{xx:number,yy:number} = this.qAcceleration.dequeue();
    let _vx:number                    = this.getSpeedX(acc.x, acc.y, gyro.z, acceler.xx, acceler.yy);
    let _vy:number                    = this.getSpeedY(acc.x, acc.y, gyro.z, acceler.xx, acceler.yy);   
    let data:{vx:number, vy:number}   = {vx:_vx, vy:_vy};
    this.vx = _vx;
    this.vy = _vy;
    this.sendSpeedData(data);
  }

  //The function add Data to the Accumulator Queue
  addAccData = (_x:number,_y:number) => {
    this.qAccumulator.enqueue({x:_x, y:_y});
    this.processSpeedData();
  }

  //The function add Data to the Gyro Queue
  addGyroData = (g:number) => {
    this.qGyro.enqueue({z:g});
    this.processSpeedData();
  }

  //The function add Data to the Acceleration Queue
  addAccelerationData = (_xx:number, _yy:number) => {
    this.qAcceleration.enqueue({xx:_xx, yy:_yy});
  }

  //-----------------------------------------------This Functions For Padding Mouse--------------------------------------------

  //The function send The vector speed data to the server
  sendVectorSpeed = async () => {
    if(!this.qVector.isEmpty()) {
      this.sendSpeedData(this.qVector.dequeue());
    }
  }

  //The function add VectorSpeed to the queue
  addVectorSpeed = (x:number, y:number) => {
    if(this.prevX !=99 && this.prevY!=99) {
      let _vx:number = x - this.prevX;
      let _vy:number = y - this.prevY;
      this.qVector.enqueue({vx:_vx,vy:_vy});
    }
    this.prevX = x;
    this.prevY = y;
  }

  //The funcrtion Reset the Vectors
  resetVector = () => {
    this.prevX = 99;
    this.prevY = 99;
  }

  //-----------------------------------------------This Functions For Roller Mouse--------------------------------------------
  //The function send The vector speed data to the server
  sendRollerSpeed = async () => {
    if(!this.qRoller.isEmpty()) {
      let t = this.qRoller.dequeue();
      console.log('Sent '+t);
      this.sendRollerData(t);
    }
  };
  
  //The function add Roller Speed to the queue
  addRollerSpeed = (y:number) => {
    if(this.prevYroll!=99) {
      let _vy:number = y - this.prevYroll;
      _vy = _vy / this.rollerSensative;
      this.rollerSpeed = _vy;
      this.qRoller.enqueue(_vy);
    }
    else
      this.prevYroll = y;
  }
  
  //The funcrtion Reset the Roller
  resetRoller = () => {
      this.prevYroll = 99;
      this.rollerSpeed =0;
  }

  //The function return the Roller Speed
  getRollerSpeed = ()=>{
    return this.rollerSpeed;
  }
}
