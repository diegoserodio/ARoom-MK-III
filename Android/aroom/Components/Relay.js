import React,{Component} from 'react'
import {Alert, View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import {ConectionPar} from './Arduino'
import socketIOClient from 'socket.io-client'

export class Relay extends Component {
  constructor(props: Props) {
        super(props);
        this.state = {
          lightIcon:{
            status: 'off',
            icon: require('./../Resources/light_off.png'),
            back_color: '#fff',
            tintColor: 'black',
          },
          fanIcon: {
            status: 'off',
            icon: require('./../Resources/fan_off.png'),
            back_color: '#fff',
            tintColor: 'black',
          },

          endpoint: ConectionPar.endpoint,
        };
        this.socket = '';
        this.old_command = "";
  }

  componentDidMount() {
    this.socket = socketIOClient(this.state.endpoint);
    this.send('serial', 'get_status');
    this.socket.on('arduino', (data) => {
      if(data != this.old_command){
        if(data.indexOf('response') != -1){
      		if(data.indexOf('light_on') != -1){
            this.setState({
              lightIcon:{
                status: 'on',
                icon: require('./../Resources/light_on.png'),
                back_color: '#3399ff',
                tintColor: 'white',
              }
            });
      		}
          else if(data.indexOf('light_off') != -1){
            this.setState({
              lightIcon:{
                status: 'off',
                icon: require('./../Resources/light_off.png'),
                back_color: '#fff',
                tintColor: 'black',
              }
            });
      		}
          else if(data.indexOf('fan_on') != -1){
            this.setState({
              fanIcon:{
                status: 'on',
                icon: require('./../Resources/fan_on.png'),
                back_color: '#3399ff',
                tintColor: 'white',
              }
            });
      		}
          else if(data.indexOf('fan_off') != -1){
            this.setState({
              fanIcon:{
                status: 'off',
                icon: require('./../Resources/fan_off.png'),
                back_color: '#fff',
                tintColor: 'black',
              }
            });
    		  }
        }
        this.old_command = data;
      }
    })
  }

  // sending sockets
  send = (topic, data) => {
    var command = {data: data};
    this.socket.emit(topic, command);
  }
  ///

  onPressLightButton = () => {
    if(this.state.lightIcon.status == 'off'){
      this.send('serial', 'light_on');
    }else{
      this.send('serial', 'light_off');
    }
  }

  onPressFanButton = () => {
    if(this.state.fanIcon.status == 'off'){
      this.send('serial', 'fan_on');
    }else{
      this.send('serial', 'fan_off');
    }
  }

  render() {
    return (
      <View style={styles.relay}>
        <View style={styles.lightButton} backgroundColor={this.state.lightIcon.back_color}>
        <TouchableOpacity activeOpacity={0.5} onPress={this.onPressLightButton}>
            <Image
             source={this.state.lightIcon.icon}
             style={styles.iconStyle}
             tintColor={this.state.lightIcon.tintColor}
            />
        </TouchableOpacity>
        </View>

        <View style={styles.fanButton} backgroundColor={this.state.fanIcon.back_color}>
        <TouchableOpacity activeOpacity={0.5} onPress={this.onPressFanButton}>
            <Image
             source={this.state.fanIcon.icon}
             style={styles.iconStyle}
             tintColor={this.state.fanIcon.tintColor}
            />
        </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  relay: {
    position: 'absolute',
    left: 70,
    top: 60,
    flexDirection:"row",
  },
  lightButton: {
    borderWidth: 1,
    borderColor: '#3399ff',
    borderRadius: 80,
    padding: 10,
  },
  fanButton: {
    borderWidth: 1,
    borderColor: '#3399ff',
    borderRadius: 80,
    padding: 10,
    marginLeft: 60,
  },
  iconStyle: {
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },
});
