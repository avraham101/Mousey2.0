import React from 'react';
import { StyleSheet, Text, View} from 'react-native';

export default class ErrorScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() 
  {
    return (
      <View style={styles.container}>
        <View style={{alignSelf:'stretch'}}>
          <Text style={styles.text}> Error Screen! </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    backgroundColor: '#4D94DB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },

  text: {
    margin:50,
    backgroundColor: '#FFFFFF',
    color: 'black',
    alignSelf:'center'
  },
});
