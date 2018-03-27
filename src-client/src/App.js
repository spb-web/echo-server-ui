import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import CompareArrowsIcon from 'material-ui-icons/CompareArrows'
import ActionCachedIcon from 'material-ui-icons/Cached'

import Row from './Row'
import './App.css';

class App extends Component {
  componentWillMount() {
    const socket = new WebSocket(`ws://${ window.location.host }/data`)

    socket.onopen = () => {
      this.setState({connected: true})

      socket.send('start')
    }

    socket.onclose = event => {
      this.setState({connected: false})

      if (event.wasClean) {
        //alert('Соединение закрыто чисто');
      } else {
        alert('Обрыв соединения'); // например, "убит" процесс сервера
      }

      alert('Код: ' + event.code + ' причина: ' + event.reason);
    }

    socket.onmessage = event => {
      const {
        requests = []
      } = this.state

      const messageData = JSON.parse(event.data)





      if (messageData.type === 'request') {
        // Если получены данные запроса
        requests.push({
          request: messageData,
          id: messageData.id
        })
      } else if (messageData.type === 'response') {
        console.log(requests, messageData)

        // Если получены данные ответа
        requests.find(req => req.id === messageData.id).response = messageData
      } else if (messageData.initData) {
        this.setState({ PROXY: messageData.initData.PROXY })
      }


      this.setState({
        requests: [...requests]
      })
    }

    socket.onerror = function(error) {
      alert("Ошибка " + error.message)
    }
  }

  state = {
    requests: [],
    connected: false
  }

  render() {
    const {
      requests = [],
      PROXY = null
    } = this.state

    return (
      <div className="App">
        <AppBar position="static">
         <Toolbar>
           <Typography variant="title" color="inherit">
             Echo server ui
           </Typography>
           { this.state.connected ? <CompareArrowsIcon/> : <ActionCachedIcon/>}
           <Typography color="inherit">
             Proxy to: {PROXY && PROXY.PROXY_TO.HOST}
           </Typography>
         </Toolbar>
       </AppBar>

        { requests.map(request => <Row request={ request } />) }
      </div>
    );
  }
}

export default App;
