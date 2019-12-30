import {encode, decode, Msg, isMsg, EquationMsg ,isEquationMsg, isGenerationMsg} from './EncoderDecoder';
import {Equation, makeLinearEquation5, isLinearEquation5, isPolmiyalEquation5} from './DataTypes/Equations'
import {Feature} from './DataTypes/Features'

var url:string        = '';
var ip:string         = '';
var port:string       = '';
var connected:boolean = false;

var EquationX:Equation = null;
var EquationY:Equation = null;
var fx:Feature[] = null;
var fy:Feature[] = null;

export var SolveVx = (x_acc:number, y_acc:number, z_gyro:number, xx_acceleration:number, yy_acceleratinon:number):number =>
{
  if(EquationX==null || fx==null)
    return 0;
  let tmp = {x:x_acc, y:y_acc, g:z_gyro, xx:xx_acceleration, yy:yy_acceleratinon};
  //1) execute the feature first
  for(let i=0;i<fx.length;i++) {
    tmp = fx[i].featured(tmp.x, tmp.y, tmp.g, tmp.xx, tmp.yy);
  }
  //2) then use the Equation
  return EquationX.solve(tmp.x, tmp.y, tmp.g, tmp.xx, tmp.yy);
}

export var SolveVy = (x_acc:number, y_acc:number, z_gyro:number, xx_acceleration:number, yy_acceleratinon:number):number =>
{
  if(EquationY==null || fy==null)
    return 0;
    let tmp = {x:x_acc, y:y_acc, g:z_gyro, xx:xx_acceleration, yy:yy_acceleratinon};
    //1) execute the feature first
    for(let i=0;i<fy.length;i++) {
      tmp = fy[i].featured(tmp.x, tmp.y, tmp.g, tmp.xx, tmp.yy);
    }
    console.log('z gyro after featured '+tmp.g)
    //2) then use the Equation
    return EquationY.solve(tmp.x, tmp.y, tmp.g, tmp.xx, tmp.yy);
}

//The function start the conection save the ip and port and start listen to server
export var start = (_ip:string, _port:number):Error|void => {
  if(connected==true) 
    return Error('Connection already on');
  url = 'http://'+_ip+':'+_port;
  connected = true;
  ip = _ip;
  port=''+_port;
}

//The function send the msg to the server
export var send = async (msg:Msg):Promise<any> => {
  if(connected==false)
    console.log('Error sending data');
  let result:({}|Error) = encode(msg);
  let response = await fetch(url, {
    method:'POST',
    headers: {
      'Connection': 'open',
      'Accept': 'application/json',
      'Content-Type':'application/json',
      'Accept-Encoding': 'identity'
    },
    body: JSON.stringify(result)+'\n'
  })
  .then(res => res.text())
  .then( d=>{
    recive(d);
    //console.log("Data msg ->" + d);
    })
  .catch(err => { //response only for generation Msg for Speed Msg not needed
    if(isGenerationMsg(msg)) 
      console.log(">>\n"+err.name+"\n"+err.message+'\n'+err.stack);
  });
  }

//The function recive text from the server and execute the proper Msg
var recive = (buffer:string)=> {
  //console.log('recived buffer with \n'+buffer);
  let out:Msg | Error = decode(buffer);
  isMsg(out)? executeMsg(out) :
  console.error('Recived inapproprate data');
}

//The function close the connection between the server and the client
export var close = ():Error|void => {
  if(connected==false)
    return Error('Connection already closed');
  connected = false;
}

//---------------------------------------------Exectete Functions---------------------

var executeMsg = (msg:Msg):void => {
  isEquationMsg(msg)? executeEquationMsg(msg):
  console.error("Cant execute this Msg->\n"+msg);
}

var executeEquationMsg = (msg:EquationMsg): void => {
  let tmp = msg.x;
  EquationX = msg.x;
  EquationY = msg.y;
  fx = msg.fx;
  fy = msg.fy;
  //TODO delete this print Features
  let p = "Features X => ";
  for(let i=0;i<fx.length; i++)
    p += fx[i].tag +" -> ";
  console.log(p);
  p = "Features Y => ";
  for(let i=0;i<fy.length; i++)
    p += fy[i].tag +" -> ";
  console.log(p);
  //TODO delete this print Equations
  if(isLinearEquation5(EquationX))
    console.log('Vx= '+EquationX.b0 +' +x* '+EquationX.b1+' +y* '+EquationX.b2+' +g* '+EquationX.b3+' +xx* '+EquationX.b4+ ' +yy* '+EquationX.b5);
  else 
    console.error('Wrong Equation Vx');
  if(isLinearEquation5(EquationY))
    console.log('Vy= '+EquationY.b0 +' +x* '+EquationY.b1+' +y* '+EquationY.b2+' +g* '+EquationY.b3+' +xx* '+EquationY.b4+ ' +yy* '+EquationY.b5);
  else if(isPolmiyalEquation5(EquationY)){
    let tmp = EquationY.ex;
    console.log('Acc x= '+tmp.b0 +' +x* '+tmp.b1+' +x^2* '+tmp.b2+' +x^3* '+tmp.b3);
    tmp = EquationY.ey;
    console.log('Acc Y= '+tmp.b0 +' +x* '+tmp.b1+' +x^2* '+tmp.b2+' +x^3* '+tmp.b3);
    tmp = EquationY.eg;
    console.log('Gyro Z= '+tmp.b0 +' +x* '+tmp.b1+' +x^2* '+tmp.b2+' +x^3* '+tmp.b3);
    tmp = EquationY.exx;
    console.log('Acceleration XX= '+tmp.b0 +' +x* '+tmp.b1+' +x^2* '+tmp.b2+' +x^3* '+tmp.b3);
    tmp = EquationY.eyy;
    console.log('Acceleration YY= '+tmp.b0 +' +x* '+tmp.b1+' +x^2* '+tmp.b2+' +x^3* '+tmp.b3);
    let tmp2 = EquationY.multi;
    console.log('Vy= '+tmp2.b0 +' +x* '+tmp2.b1+' +y* '+tmp2.b2+' +g* '+tmp2.b3+' +xx* '+tmp2.b4+ ' +yy* '+tmp2.b5);
    }
  else
    console.error('Wrong Equation Vy');

}

/* anthor send that works with server using xmlhttp and not fetch
export var send = async (msg:Msg):Promise<any> => {
  var xhr = new XMLHttpRequest();
    //xhr.setRequestHeader('Content-Type', 'text');
    // get a callback when the server responds
    xhr.addEventListener('error', () => {
      // update the state of the component with the result here
      console.log('Error '+xhr.responseText)
    });
    xhr.onreadystatechange = function(e){
      if(this.responseText.length!=0) {
      console.log('Response Headers ->'+'\n'+this.getAllResponseHeaders());
      console.log('Response ->'+'\n'+this.response);
      console.log('Response text ->'+'\n'+this.responseText);
      }
      //console.log(this.getAllResponseHeaders());
      //if (xhr.readyState === 4 && xhr.status === 200){
      //  console.log("ok, response :", this.response);
      //  console.log(JSON.parse(this.response))
      //}
    }
    // open the request with the verb and the url
    xhr.open('POST', url);
    //xhr.setRequestHeader('Accept-Encoding','identity')
    //xhr.setRequestHeader('Accept','application/json');
    xhr.setRequestHeader('Content-Type','text');
    // send the request
    //xhr.send();
    xhr.send(JSON.stringify(result));
}*/