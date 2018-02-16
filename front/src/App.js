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

  componentDidMount() {
    // Load the previous messages
    this.getMessages()
      .then(res => {
        console.log(res);
        for(var m in res.log) {
          var temp_m = res.log[m];
          console.log(m);
          this.setState({
            messages: [...this.state.messages, { me: true, author: "Me", body: temp_m.msg },{ me: false, author: "bot", body: temp_m.answer}],
          });
        }
      })
      .catch(err => console.log(err));
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

  // Getting the past message list
  getMessages = async (msg) => {
    const response = await fetch('/messages/get');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  }

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
