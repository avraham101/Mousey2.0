import React from 'react';
import { StyleSheet, Text, View, Button, TextInput} from 'react-native';
import { TouchableOpacity } from 'react-native';

export var ip =  '10.0.0.1';//'192.168.14.135';//'10.0.0.11';
export var port = '1250';
export var connected = false;

export default class ConnectionPopUp extends React.Component {

  constructor(props) {
    super(props);
  }

  subscribe = () => {
    //TODO cheack connection
    connected = true;
    this.props.onSubmit(ip, port);
  }

  render() 
  {
    if(connected==true)
      return null;
    return (
      <View style={styles.container}>
        {/* Title */}
        <View style={styles.title}>
          <Text style={styles.text}> You are almost there to use Mousey </Text>
        </View>
        {/* Ip Section */}
        <View style={styles.ipSection}>
          <View style={{flex:4, justifyContent:'center'}}>
            <Text style={styles.text}> Please insert Your Computer Ip</Text>
            <TextInput style={styles.textInput}>
              {ip}
            </TextInput>
          </View>
          <View style={{flex:1, paddingBottom:10}}>
            <Text style={styles.texty}> It will be shown on Your MouseyServer App on the computer</Text>
          </View>
        </View>
        {/* Port Section */}
        <View style={styles.portSection}>
          <View style={{flex:4, justifyContent:'center'}}>
            <Text style={styles.text}> Please insert a your Computer Port</Text>
            <TextInput style={styles.textInput}>
              {port}
            </TextInput>
          </View>
          <View style={{flex:1, paddingBottom:10}}>
            <Text style={styles.texty}>  It will be shown on Your MouseyServer App on the computer </Text>
          </View>
        </View>
        {/* Connect Section */}
        <View style={styles.buttonSection}>
          <Button title="Connect" color='#0066CC' onPress={this.subscribe}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    //#80B3E6
    backgroundColor: '#00000070',
    zIndex: 1,
    position: 'absolute',
    //marign:2,
    borderRadius:5,
    left:25,
    right:25,
    top:70,
    bottom:55
  },
  title: {
    justifyContent: 'center',
    flex:1, 
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    marginRight:4,
    marginLeft: 4,
    marginTop: 10, 
    backgroundColor: '#CCE0F5',
  },
  ipSection: {
    //justifyContent: 'center',
    flex:3,
    marginRight:4,
    marginLeft: 4,
    backgroundColor: '#66A3E0'
  },
  portSection: {
    justifyContent: 'center',
    flex:3,
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    marginBottom:10,
    marginRight:4,
    marginLeft: 4,
    backgroundColor: '#4D94DB'
  },
  buttonSection: {
    flex:1,
    margin:2, 
    justifyContent: 'center'
    //backgroundColor:'#0066CC'
  },
  textInput: {
    margin: 5,
    fontSize:18,
    textAlign:'center',
    backgroundColor:'white',
  },
  text: {
    //backgroundColor: 'transperent',
    textAlign:  'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20
  },
  texty: {
    //backgroundColor: 'transperent',
    textAlign:  'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16
  },
});
