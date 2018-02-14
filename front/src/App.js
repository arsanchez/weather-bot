import React, { Component } from 'react';
import MessageList from './Messages'
import MessageForm from './MessageForm'
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    response: ''
  };

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
    }
  } 

  handleNewMessage = (text) => {
    this.setState({
      messages: [...this.state.messages, { me: true, author: "Me", body: text }],
    })
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="App">
        <MessageForm onMessageSend={this.handleNewMessage} />
        <MessageList messages={this.state.messages} />
      </div>
    );
  }
}

export default App;
