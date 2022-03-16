import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import WS from 'react-native-websocket';

export default function App() {
  const [serverState, setServerState] = useState('Loading...');
  const [messageText, setMessageText] = useState('');
  const [disableButton, setDisableButton] = useState(true);
  const [inputFieldEmpty, setInputFieldEmpty] = useState(true);
  const [serverMessages, setServerMessages] = useState([]);

  const ws = new WebSocket('wss://ws.postman-echo.com/raw');
  

  useEffect(() => {
    ws.onopen = () => {
      setServerState('Connected to the server');
      setDisableButton(false);
    };
    ws.onclose = e => {
      setServerState('Disconnected. Check internet or server.');
      setDisableButton(true);
    };
    ws.onerror = e => {
      setServerState(e.message);
    };
    
  }, []);
  const submitMessage = () => {
    const serverMessagesList = [];
    ws.send(messageText);
    ws.onmessage = e => {
      serverMessagesList.push(e.data);
      setServerMessages([...serverMessagesList]);
      console.log(e);
    };
    setMessageText('');
    setInputFieldEmpty(true);
  };

  
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 16, color: '#000000'}}>{serverState}</Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: 'black',
          width: '80%',
          padding: 10,
          borderRadius: 10,
          marginTop: 30,
        }}
        placeholder={'Add Message'}
        onChangeText={text => {
          setMessageText(text);
          setInputFieldEmpty(text.length > 0 ? false : true);
        }}
        value={messageText}
      />
      <TouchableOpacity
        style={[
          styles.button,
          {backgroundColor: disableButton || inputFieldEmpty? 'lightgray' : 'lightblue'},
        ]}
        onPress={submitMessage}
        disabled={disableButton || inputFieldEmpty}>
        <Text style={{padding: 10, fontSize: 16, color: '#000000'}}>SEND</Text>
      </TouchableOpacity>
    

      <View
        style={{
          backgroundColor: '#ffeece',
          padding: 5,
          height: 100,
          width: '80%',
          marginTop: 20, borderRadius: 10,
          borderColor:'gray',
          borderWidth: 2
        }}>
        <Text style={{color:'#000000'}}>Message you sent:</Text>
        {serverMessages.map((item, ind) => {
          return <Text key={ind}>{JSON.stringify(item)}</Text>;
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
    borderWidth: 2,
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'gray',
    marginTop: 20,
  },
});
