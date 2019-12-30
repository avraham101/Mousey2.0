import React from 'react';
import {LocalStorage} from '../Presistent/LocalStorage'
import {InitHandler} from './InitHandler'
import {MainHandler} from './MainHandler'

export class LogicManager {
  
  localStorage  = new LocalStorage();
  initHandler   = new InitHandler();
  mainHandler   = new MainHandler();
  constructor() {
  
  }
  
  //---------------------------------init Screen Functions---------------------------------------------
  
  //The function return the current init step
  getInitStep = () => this.initHandler.getInitStep();

  //preform the step init with the spasific data from the sensors accumoloter 
  execAct = (sensor, data) => this.initHandler.execAct(sensor, data);
  
  //the function anayleze data
  analayzeInitData = () => this.initHandler.analayzeInitData();   

  //---------------------------------Main Screen Functions---------------------------------------------

  //the function return the speed at x
  getSpeedX = (x_acc,y_acc,z_gyro) => {
    return this.mainHandler.getSpeedX(x_acc,y_acc,z_gyro);
  }

  //the function return the speed at y
  getSpeedY = (x_acc,y_acc,z_gyro) => {
    return this.mainHandler.getSpeedY(x_acc,y_acc,z_gyro);
  }
}
