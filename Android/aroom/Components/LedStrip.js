import React,{Component} from 'react'
import {ConectionPar} from './Arduino'
import socketIOClient from 'socket.io-client'
import {Alert, View, Text, StyleSheet, TouchableOpacity, Slider} from 'react-native'

export class LedStrip extends Component {
  constructor(props: Props) {
        super(props);
        this.state = {
          style: {
            color_button: {
              status: false,
              back_color: '#fff',
              color: {color: '#000'},
            },
            music_button: {
              status: false,
              back_color: '#fff',
              color: {color: '#000'},
            },
          },

          rgb: {
            red: 0,
            green: 0,
            blue: 0,
          },
          music_offset: 0,

          endpoint: ConectionPar.endpoint,
        };
        this.socket = '';
        this.old_command = "";
  }

  componentDidMount() {
    this.socket = socketIOClient(this.state.endpoint);
    this.socket.on('arduino', (data) => {
      if(data != this.old_command){
        if(data.indexOf('response') != -1){
          if(data.indexOf('led') != -1){
            let red = parseInt(data.substring(17, 20))-100;
            let green = parseInt(data.substring(27, 30))-100;
            let blue = parseInt(data.substring(36, 39))-100;
            if(red == 300 && green == 300 && blue == 300){
              this.setState({
                style:{
                  color_button: {
                    status: false,
                    back_color: '#fff',
                    color: {color: '#000'},
                  },
                  music_button: {
                    status: true,
                    back_color: '#0687f5',
                    color: {color: '#fff'},
                  },
                },
              });
            }else{
              this.setState({
                style:{
                  color_button: {
                    status: true,
                    back_color: '#0687f5',
                    color: {color: '#fff'},
                  },
                  music_button: {
                    status: false,
                    back_color: '#fff',
                    color: {color: '#000'},
                  },
                },
                rgb:{
                  red: red,
                  green: green,
                  blue: blue,
                }
              });
            }
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

  renderBody(){
    if(this.state.style.music_button.status){
      return (
        <Text> Music On </Text>
      )
    }else{
      let arr = [];
      for(let i = 0; i < 3; i++){
        let value = 0, color = '';
        if(i == 0){value = this.state.rgb.red; color='red';}
        else if(i == 1){value = this.state.rgb.green; color='green';}
        else {value = this.state.rgb.blue; color='blue';}
        arr.push(
          [
            <Text> {value} </Text>,
            <Slider
             style={{ width: 300 }}
             step={1}
             minimumValue={0}
             maximumValue={255}
             minimumTrackTintColor = {color}
             thumbTintColor = {color}
             value={value}
             onValueChange={val => {
               if(color == 'red')this.setState({ rgb: {...this.state.rgb, red: val }})
               else if(color == 'green')this.setState({ rgb: {...this.state.rgb, green: val }})
               else this.setState({ rgb: {...this.state.rgb, blue: val }})
             }}
             onSlidingComplete={val => {
               let command = '';
               if(color=='red') command='r_slider:'+val
               else if(color=='green') command='g_slider:'+val
               else command='b_slider:'+val
               this.send('serial', command);
               }
             }
            />,
          ]
        );
      }
      return arr;
    }
  }

  render() {
    return (
      <View style={styles.main}>
        <View style={styles.color_button} backgroundColor={this.state.style.color_button.back_color}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => this.send('serial', 'strip_color_on')}>
            <Text style={[styles.text, this.state.style.color_button.color]}>Color</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.music_button} backgroundColor={this.state.style.music_button.back_color}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => this.send('serial', 'strip_music_on')}>
            <Text style={[styles.text, this.state.style.music_button.color]}>Music</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.body}>{this.renderBody()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
  },
  color_button: {
    position: 'absolute',
    left: 120,
    top: 50,
    width: '20%',
    height: '11%',
    padding: 5,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  music_button: {
    position: 'absolute',
    left: 200,
    top: 50,
    width: '20%',
    height: '11%',
    padding: 5,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  text:{
    textAlign: 'center',
    fontSize: 20,
  },
});
