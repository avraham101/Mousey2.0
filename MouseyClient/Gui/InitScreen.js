import React from 'react';
import { StyleSheet,Text, View, Image, TouchableOpacity} from 'react-native';
import { Accelerometer, Gyroscope, DeviceMotion } from "expo-sensors";
import * as sensors from "expo-sensors";
import { LogicManager } from '../Logic/LogicManager';

//TODO after the db is set and save on the phone we can skip this steps!!
//TODO add a restart button for the process (nice to have)

export default class InitScreen extends React.Component {
  
  //decresing the interval time must take the SAMPLE SIZE up
  intervalTime = 60;
  
  logicManager = new LogicManager();

  static navigationOptions = {
    title: 'Welcome to Mousey',
  };

  state = {
    img: { source:'none', size:0, flip:0},
    accelerometer: {x:0, y:0, z:0},
    stopRecord: false,
    buttonRecordTxt: 'Stop Session',
    buttonRecordColor: '#C10505'
  }

  //the button click handler for next step
  startClick = () => {
    if(this.logicManager.execAct('',{})) 
      this.subscribe();
    else 
      this.props.navigation.replace('Error');
  };

  subscribe = () => {
    console.log('Start Lisining to Sensors');
    //Accelometer set up
    Accelerometer.setUpdateInterval(this.intervalTime);
    Accelerometer.addListener(accelerometerData => {
      if(!this.state.stopRecord) {
        let step = this.logicManager.getInitStep();
        this.setState({img:getImage(step)});
        if(step!='End') {
            if(!this.logicManager.execAct('Accelometer',accelerometerData))
              this.props.navigation.replace('Error');
        }
        else {
          Accelerometer.removeAllListeners();
          this.logicManager.analayzeInitData();
          this.props.navigation.replace('Mouse');
        }
      }
    });
    //Gyroscope set up
    Gyroscope.setUpdateInterval(this.intervalTime);
    Gyroscope.addListener(gyroscopeData => {
      //console.log('Gyro x:'+gyroscopeData.x+' y:'+gyroscopeData.y + ' z:'+gyroscopeData.z);
      if(!this.state.stopRecord) {
        let step = this.logicManager.getInitStep();
        if(step!='End') {
            if(!this.logicManager.execAct('Gyroscope',gyroscopeData))
              this.props.navigation.replace('Error');
        }
        else {
          Gyroscope.removeAllListeners();
        }
      }
    });
    //Device Motion set up
    DeviceMotion.setUpdateInterval(this.intervalTime-10);
    DeviceMotion.addListener( motion => {
      let acc = {x:motion.accelerationIncludingGravity.x, y:motion.accelerationIncludingGravity.y};//
      if(!this.state.stopRecord) {
        let step = this.logicManager.getInitStep();
        if(step!='End') {
            if(!this.logicManager.execAct('Acceleration',acc))
              this.props.navigation.replace('Error');
        }
        else {
          DeviceMotion.removeAllListeners();
        }
      }
    });
  }

  recordClick = () => {
    let txt = 'Stop Session';
    let color = '#C10505';
    if(!this.state.stopRecord==true) {
      txt = 'Resume Session';
      color = '#3370AE';
    }
    this.setState({ stopRecord: !this.state.stopRecord, buttonRecordTxt:txt, buttonRecordColor:color});
  }

  renderStop = () => {
    let step = this.logicManager.getInitStep(); 
    if(step!='Start' && step!='End')
      return (
        <View style={{flex:1}}> 
           <TouchableOpacity style={[styles.Mybutton,{backgroundColor:this.state.buttonRecordColor}]} onPress={this.recordClick}>
              <Text style={[styles.text,{fontSize:18, textAlign:'center', alignSelf:'stretch',color:'#CCE0F5'}]}>
                {this.state.buttonRecordTxt}
              </Text>
            </TouchableOpacity>
        </View>
      );    
    return null;
  }

  renderStart = () => {
    if(this.logicManager.getInitStep()=='Start')
      return (
        <View style={{flex:1}}> 
           <TouchableOpacity style={styles.Mybutton} onPress={this.startClick}>
              <Text style={[styles.text,{fontSize:18,textAlign:'center',alignSelf:'center',color:'#CCE0F5'}]}>START</Text>
            </TouchableOpacity>
        </View>);
    return null;
  }

  renderMoreInstructions = () => {
    let step = this.logicManager.getInitStep(); 
    let txt = 'Click Stop Session when you need to change the position of the phone.';
    if(this.state.stopRecord==true) {
      txt = 'Click Resume Session when you fixed the position of the phone.';
    }
    if( step!='Start' && step!='End') {
      return (
      <View style={[styles.container, 
        {margin:2, padding:3, flex:1, borderRadius:10, backgroundColor:'#B3D1F0'}]}>
        <Text style={[styles.text,{fontSize: 19}]}> {txt} </Text>
      </View>);
    }
    return null;
  }

  render() 
  {
    let img = this.state.img;
    let msg = getAct(this.logicManager.getInitStep());
    return (
    <View style={styles.container}>
      <Text style={[styles.text, {padding:5 ,marginBottom:5, borderTopLeftRadius:10, borderTopRightRadius:10, backgroundColor:'#99C2EB'}]}>
        Please follow the instruction to set up Mousy</Text>
      <View style={[styles.container, 
        {padding:5, flex:2, borderBottomLeftRadius:10, borderBottomRightRadius:10, backgroundColor:'#80B3E6'}]}>
        <Text style={[styles.text,{fontSize: 20}]}>{msg}</Text>
      </View>
      <View style={{alignItems:'center', flex:3}}>
        <Image 
          source={img.source}  
          style={{ padding:5, marginTop:'auto', marginBottom:'auto', 
            width: img.size, height: img.size, transform: [{ rotate: (img.flip+'deg')}]}}
        />
      </View>
      {this.renderMoreInstructions()}
      {this.renderStart()}
      {this.renderStop()}
    </View>  
    );
  }
}

//------------------------------------------FUNCTIONS---------------------------------

//The function return the text to shown due to the init step
const getAct = (str) => { 
  let output = 'Please move the phone '; 
  switch(str) {
    case 'Start':        return  'Put the phone on the table.'+
                                 '\nMake sure there isnt anything that will block the phone from moving.'+
                                 '\nThen Click Start.'; break;
    case 'Right slow':   output= output + 'slow to the right.'; break;
    case 'Left slow':    output+= 'slow to the left.'; break;
    case 'Up slow':      output+= 'slow to the top.'; break;
    case 'Down slow':    output+= 'slow to the bottom.'; break;
    case 'Right fast':   output+= 'fast to the right.'; break;
    case 'Left fast':    output+= 'fast to the left.'; break;
    case 'Up fast':      output+= 'fast to the top.'; break;
    case 'Down fast':    output+= 'fast to the bottom.'; break;
    case 'Right Up':     output+= 'slow to right up'; break;
    case 'Left Up':      output+= 'slow to left up'; break;
    case 'Right Down':   output+= 'slow to right bottom'; break;
    case 'Left Down':    output+= 'slow to right bottom'; break;
    case 'Remake':       output= 'Pls reamke the last step again. Move it currently.'; break;
    case 'End': case 'Not Moving': default: 
                  return output='Processing data. Please wait.'; break;
    
  }
  return output;
}

var prevImg = null;
//return the object {flip: how to rotate the image, src: the image} 
const getImage = (str) => {
  let _source = require('./Images/arrow.gif');
  let output = {};
  switch(str) {
    case 'Start':                           output = {flip:0, source:''}; break;
    case 'Right slow': case 'Right fast':   output = {flip:0 , source: _source, size:150}; break;
    case 'Left slow': case 'Left fast':     output = {flip:180, source: _source, size:150}; break;
    case 'Up slow': case 'Up fast':         output = {flip:270, source: _source, size:150}; break;
    case 'Down slow': case 'Down fast':     output = {flip:90, source: _source, size:150}; break;
    case 'Right Up':                        output = {flip:315, source: _source, size:150}; break;
    case 'Left Up':                         output = {flip:225, source: _source, size:150}; break;
    case 'Right Down':                      output = {flip:45, source: _source, size:150}; break;
    case 'Left Down':                       output = {flip:135, source: _source, size:150}; break;
    case 'Remake':                          output = prevImg; break;  
    case 'End': case 'Not Moving': default: output = {flip:0, source: require('./Images/process.gif'), size:200}; break;
  }
  if(str!='Remake')
    prevImg = output;
  return output;
}

//------------------------------------------STYLES-----------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    backgroundColor: '#4D94DB',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 2,
  },
  text: {
    //backgroundColor: 'transperent',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 22
  },
  Mybutton: {
    borderColor:'#003D7A', 
    borderWidth:3, 
    backgroundColor:'#5A7897',
    height:50
  }
});