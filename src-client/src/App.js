import React, { Component } from 'react';
import Row from './Row'
import './App.css';

class App extends Component {
  componentWillMount() {
    const socket = new WebSocket(`ws://${window.location.host}/data`)

    socket.onopen = () => {
      alert("Соединение установлено.");

      socket.send('start')
    }

    socket.onclose = event => {
      if (event.wasClean) {
        alert('Соединение закрыто чисто');
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
    requests: []
  }

  render() {
    const {
      requests = []
    } = this.state

    return (
      <div className="App">
        { requests.map(request => <Row request={ request } />) }
      </div>
    );
  }
}

export default App;
