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
      messages: [...this.state.messages, { me: true, author: "Me", body: text },{ me: false, author: "bot", body: "Let me check..." }],
    });

    this.readMsg(text)
      .then(res => this.setState({ messages: [...this.state.messages, { me: false, author: "Bot", body: res.answer }]}))
      .catch(err => console.log(err));
  }

  // Function to query the backend for the answer
  readMsg = async (msg) => {
    const response = await fetch('/messages/read?msg='+msg);
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
