import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu'
import CompareArrowsIcon from 'material-ui-icons/CompareArrows'
import ActionCachedIcon from 'material-ui-icons/Cached'

import Row from './Row'
import './App.css';

class App extends Component {
  componentWillMount() {
    const socket = new WebSocket(`ws://${window.location.host}/data`)

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

      this.setState({
        requests: [...requests, JSON.parse(event.data)]
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
      requests = []
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
             Proxy to:
           </Typography>
         </Toolbar>
       </AppBar>

        { requests.map(request => <Row request={ request } />) }
      </div>
    );
  }
}

export default App;
