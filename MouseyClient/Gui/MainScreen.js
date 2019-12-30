import React from 'react';
import { StyleSheet, Text, View, Button, Image} from 'react-native';
import { TouchableOpacity} from 'react-native';
import { Accelerometer, Gyroscope, DeviceMotion,Magnetometer } from "expo-sensors";
import { MainHandler} from '../Logic/MainHandler'
import ConnectionPopUp from './ConectionPopUp'

export default class MainScreen extends React.Component {
  
  intervalTime = 80;//60 to much faster the server cant handlle that good
  mainHandler = new MainHandler();
  //this vars working for the roller
  src = require('./Images/arrow.gif');
  //this vars working when touch pad is on
  touchPadPos = -1;
  i_touch = null;
  doubleTap = false; // noticed a double tap
  clickOn = false;   //if clicked is on or off
  locationX = -1;
  locationY = -1;
  
  constructor(props) {
    super(props);
  }
  
  state = {
    indecator: 0,
    accelerometerData: {},
    text:``,
    touchingPad:false,
    vx:0,
    vy:0,
    rollerSpeed:0,
    doubleTapColor:'#B7BBBB',
  };

  static navigationOptions = {
    header:null
  };

  subscribeSensors = () => {
    //Accelometer set up
    //Accelerometer.removeAllListeners();
    Accelerometer.setUpdateInterval(this.intervalTime);
    Accelerometer.addListener(accelerometerData => {
      //console.log('acumltor run');
      this.mainHandler.addAccData(accelerometerData.x,accelerometerData.y);
      let data = this.mainHandler.getSpeed();
      this.setState({vx:data.vx});
      this.setState({vy:data.vy});
    });
    //Gyroscope set up
    //Gyroscope.removeAllListeners();
    Gyroscope.setUpdateInterval(this.intervalTime);
    Gyroscope.addListener(gyroscopeData => {
      this.mainHandler.addGyroData(gyroscopeData.z);
    });
    //Device Motion set up
    //DeviceMotion.removeAllListeners(); There is a problem with expo sensors they didnt cheack if the list of liseners is null before deleting the list.
    DeviceMotion.setUpdateInterval(this.intervalTime-10);
    DeviceMotion.addListener( motion => {
      let acc = {x:motion.accelerationIncludingGravity.x, y:motion.accelerationIncludingGravity.y};//
      this.mainHandler.addAccelerationData(acc.x, acc.y);
    });
  }

  unsubscribeSensors = () => {
    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
    DeviceMotion.removeAllListeners();
  }

  subscribe = (_ip, _port) => {
    this.setState({ip:_ip, port:_port});
    this.mainHandler.startConnection(_ip,_port);
    this.subscribeSensors();   //TODO add in indector for subscribe or unsbscribe
    this.touchPadButtonOnOff();
  }

  rightClickPress = () => {
    this.mainHandler.sendRightClick(true);
  };

  rightClickRealese = () => {
    this.mainHandler.sendRightClick(false);
  };

  leftClickPress = () => {
    this.mainHandler.sendLeftClick(true);
  }

  leftClickRealese = () => {
    this.mainHandler.sendLeftClick(false);
    //if touchPad is on
    this.clickOn = false;
    this.setState({doubleTapColor:this.getDoubleTapColor()});
    this.locationX = -1;
    this.locationY = -1;
  }

  //The function responseble for roller moving
  rollerMoved = (e) => {
    let t = e.nativeEvent.locationY;
    this.mainHandler.addRollerSpeed(t);
    this.mainHandler.sendRollerSpeed();
    this.setState({rollerSpeed:this.mainHandler.getRollerSpeed()});
  }

  //The function responseble for the roller release
  rollerRelese = (e) => {
    this.mainHandler.resetRoller();
    this.setState({rollerSpeed:this.mainHandler.getRollerSpeed()});
  }

  //The function responseble for the butoon who activated the touch pad or the mouse movment
  touchPadButtonOnOff = () => {
    if(this.state.touchingPad){
      this.subscribeSensors();
      this.setState({touchingPad:false}); 
    }
    else {
      this.unsubscribeSensors();
      this.mainHandler.resetVector();
      this.setState({touchingPad:true});
    }
  }

  //The function when the touch pad noticed a press in
  touchPadMove = (e) => {
      if(this.touchPadPos == -1)
        this.touchPadPos = e.nativeEvent.touches.length-1;
      else if(e.nativeEvent.touches.length>1 && this.touchPadPos == e.nativeEvent.touches.length-1) { //Assum at most 2 touches, 1 touch button, 1 touch mouse
        this.touchPadPos = this.touchPadPos -1;
      }
      this.i_touch = e.nativeEvent.touches[this.touchPadPos];
      setTimeout(() => {
        if(this.touchPadPos!=-1) {
          this.mainHandler.addVectorSpeed(this.i_touch.locationX,this.i_touch.locationY);
          this.mainHandler.sendVectorSpeed();
          //console.log('~x: '+this.i_touch.locationX+' y:'+this.i_touch.locationY);
        }
      }, this.intervalTime/2);
  }
  
  //The function when the touch pad noticed a press out
  touchPadOut = (e) => { 
    this.mainHandler.resetVector();
    this.touchPadPos = -1;
    this.clickOn = false;
  }

  //The function stimulate double tap for the touchPad. double tap is like left click mouse
  touchPadDoubleClick = (e) => {
    let x = e.nativeEvent.locationX;
    let y = e.nativeEvent.locationY;
    if(this.touchPadPos==-1) {
      this.doubleTap = !this.doubleTap;
      this.locationX = x;
      this.locationY = y;
    }
    setTimeout(() => {
        if(this.touchPadPos == -1 && this.doubleTap && !this.clickOn 
            && ((this.locationX - x) < 1.5 || (this.locationX - x) > -1.5) //The double tap need to be almost at the same position
            && ((this.locationY - y) < 1.5 || (this.locationY - y) > -1.5))  {
            console.log('Double Click');
            this.doubleTap = false;
            this.clickOn = true;
            this.setState({doubleTapColor:this.getDoubleTapColor()})
            this.mainHandler.sendLeftClick(this.clickOn);
        }
        console.log('Timed Out');
    }, 50);
  }

  //The function return Green if double tap happened at the touch pad
  getDoubleTapColor = ()=> {
  if(this.clickOn)
    return 'red';
  return '#B7BBBB';
  }
  //The function Render the Touch Pad
  renderTouchPad = () => {
    if(!this.state.touchingPad)
      return (<View style={{flex:6, padding:5}}>
                <Text> Speed X: {this.state.vx} </Text>
                <Text> Speed Y: {this.state.vy} </Text>
              </View>);
    return (
      //<TouchableOpacity onMo style = {{flex:6, padding:10, backgroundColor:'black'}}>
        <View style = {{flex:6, padding:10, backgroundColor:'#B7BBBB'}} 
              onTouchMove = {this.touchPadMove}
              onTouchEnd = {this.touchPadOut}
              onTouchStart = {this.touchPadDoubleClick}>
              <Text style ={{flex:1, alignSelf:'center', fontSize:18, padding:10, backgroundColor:this.state.doubleTapColor}}>
                DoubleTap can grab Files.{'\n'}Drop only with Left Button.
              </Text>
              <View style = {{flex:6}}/>
        </View>
      //</TouchableOpacity>
    );
  }

  renderTochPadButton = () => {
    let text = 'Touching Pad';
    if(this.state.touchingPad)
      text = 'Move Phone';
    return (<View style={{flex:0.5, paddingLeft:90, paddingRight:90}}>
            <TouchableOpacity style={styles.Button} onPress={this.touchPadButtonOnOff}>
              <Text style={[styles.text, {color:'#CCE0F5'}]}> {text} </Text>
            </TouchableOpacity>
           </View>);
  }

  renderRoller = () => {
    if(this.state.rollerSpeed==0)
      return;
    let rotaion = 90;
    if(this.state.rollerSpeed<0)
      rotaion = 270;
    return (
      <View>
        <Image source={this.src} 
          style={{right:11, marginTop:'auto', marginBottom:'auto', width: 50, height: 50, transform: [{ rotate: (rotaion+'deg')}]}}/>
        <Image source={this.src} 
          style={{right:11, marginTop:'auto', marginBottom:'auto', width: 50, height: 50, transform: [{ rotate: (rotaion+'deg')}]}}/>
        <Image source={this.src} 
          style={{right:11, marginTop:'auto', marginBottom:'auto', width: 50, height: 50, transform: [{ rotate: (rotaion+'deg')}]}}/>
      </View>
    );
  }

  render() 
  {
    return (
      <View style={styles.container}>
        <ConnectionPopUp data='This is a Super pop Up!!' onSubmit={this.subscribe}/>
        {/* Top Buttons */}
        <View style={[styles.mouseContainer, {flexDirection:'column', alignItems: 'stretch'}]}>
          <View style={{flex:3,flexWrap:'wrap', flexDirection:'row'}}>
            {/* Right Button*/}
            <View style={{alignSelf:'stretch',padding:2, flex:5, justifyContent: 'flex-start'}}> 
              <TouchableOpacity style={[styles.Mybutton, { borderTopLeftRadius:15 }]} onPressIn={this.rightClickPress} onPressOut={this.rightClickRealese}>
              </TouchableOpacity>
            </View>
            {/* Roller Button*/}
            <View style={{alignSelf:'stretch', flex:1, justifyContent: 'flex-start'}}> 
              <View style={styles.Roller} onTouchMove={this.rollerMoved} onTouchEnd ={this.rollerRelese}>
                {this.renderRoller()}
              </View>
            </View>
            {/* Left Button*/}
            <View style={{alignSelf:'stretch',padding:2, flex:5, justifyContent: 'flex-start'}}> 
              <TouchableOpacity style={[styles.Mybutton, { borderTopRightRadius:15 }]} onPressIn={this.leftClickPress} onPressOut={this.leftClickRealese}>
              </TouchableOpacity>
            </View>
          </View>
          {this.renderTouchPad()}
          {this.renderTochPadButton()}
        </View>
      </View>
    );
  }
  
}

function round(n) {
  return Math.floor(n * 1000) / 1000;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    backgroundColor: '#4D94DB',
    padding: 2,
    paddingTop: 25,
  },
  mouseContainer: {
    flex:5,
    flexDirection:'row', 
    justifyContent: 'center', 
    marginTop: 5,
    padding: 3,
    backgroundColor: '#B7BBBB',
    borderColor:'#939898',
    borderWidth: 3,
    borderRadius: 20,
  },
  text: {
    //backgroundColor: '#FFFFFF',
    color: 'black',
    alignSelf:'center',
    fontSize:18,
    textAlign:'center',
    alignSelf:'center',
    //color:'#CCE0F5'
  },
  Mybutton: {
    borderColor:'#7A7E7E', 
    borderWidth:3, 
    backgroundColor:'#A2A8A8', 
    height:170,
  },
  Roller: {
    borderColor:'#7A7E7E', 
    borderWidth:2, 
    backgroundColor:'#989E9E', 
    height:150,
    borderRadius:20,
    marginTop:12,
  },
  Button: {
    borderColor:'#A2A8A8',//'#003D7A', 
    borderWidth:3, 
    backgroundColor:'#939898',//'#5A7897',
    height:30,
    borderRadius:10
  }
});
