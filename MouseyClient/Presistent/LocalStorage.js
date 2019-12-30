import React from 'react';
import { SQLite } from 'expo-sqlite';

export class LocalStorage {

  constructor() {
    this.db = null;
  }
  
  //The function create the DB and the info table
  createDb = () => {
    this.db = SQLite.openDatabase('user3.db',()=>console.log('DB opened'));
    while(this.db==null);
    this.db.transaction( res=> {
      res.executeSql('drop table info',[], 
        ()=> console.log('droped table info'),
        ()=> console.log('problem while droping the table info'));
    })
    
    this.db.transaction( (res)=> {
      res.executeSql( //maybe need to add another field to table that is HRM value (to know when the movment stoped)
        `create table if not exists 
          info (
            ID integer primary key not null, 
            X_acc real, 
            Y_acc real, 
            Z_gyro real, 
            Vx real,
            Vy real );`,[],
            ()=>console.log('Opened table name info'),
            ()=>console.log('Problem opening table name info'));
    });
  }

  //The function add data to info table id=index
  addData = async (index,data) => {
    if(this.db!=null) {
      let x = data.x;
      let y = data.y;
      let g = data.g;
      let vx = data.vx;
      let vy = data.vy;
      this.db.transaction( res => {
        //console.log('Trying to addd ('+this.rows+') with values ('+x+', '+y+', '+g+', '+vx+', '+vy);
        //(ID, X_acc, Y_acc, Z_gyro, Vx, Vy)
        res.executeSql(`insert into info values(?,?,?,?,?,?)`, [index, x, y, g, vx, vy],
          //()=>console.log(''+x+' '+y+' '+g+' '+vx+' '+vy),
          //()=>console.log('Fail addding ('+index+') ') //Object.keys(err))
          )
      });
    }
  }
  
  //The function add an array of data to the info table
  addDatafromArray = (arr) => {
    this.db = SQLite.openDatabase('user3.db',()=>console.log('DB opened'));
    if(this.db!=null) {
      for(let i=0;i<arr.length;i++) {
        this.addData(i,arr[i]); 
      }
    }
  }

  //The function get a single row and create from to an data object
  createData = (row) => {
    //TODO
    //must look like that {y:_y, x1:_x1, x2:_x2, x3:_x3};
  }

  //The function get all the data from the info table
  getAllData = async () =>{
    //TODO something is broken... dont pass the I am here 1
    console.log('I am here 1');
    if(this.db!=null) {
      this.db.transaction( res => {
        res.executeSql(
          `select * from info`, [], 
          (d,{rows:_array}) => {
            console.log('I am here 2');
            for(let i =0; i<_array.length; i++)
              console.log(_array[i]);
            console.log('I am here 3');
          },
          () => console.log('Error getting all data') 
        )
      }); 
    }
  }

}
