import React from 'react';
import TextInput from './TextInput'
import mockMessages from './mockMessages'
import styles from './App.module.css'
import * as firebase from "firebase/app";
import "firebase/firestore";

export default class extends React.Component {

  state={
    messages:mockMessages
  }

  async componentWillMount(){
    firebase.initializeApp({
      apiKey: "AIzaSyBAJVwrP5J4AhVKd5ijYtcTF9XMV6tIcY4",
      authDomain: "msgr-2.firebaseapp.com",
      projectId: "msgr-2",
    });
    
    this.db = firebase.firestore();

    this.db.collection("messages").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("ADDED!!!!")
          console.log(change.doc.data())
          this.receive(change.doc.data())
        }
      })
    })
  }

  send = (m) => {
    this.db.collection("messages").add({
      from:'me',
      text:m.text
    })
  }

  receive = (m) => {
    if(!m.text) return
    const messages = [...this.state.messages]
    messages.unshift(m)
    this.setState({messages})
  }

  render() {
    const {messages} = this.state
    return (
      <div className={styles.wrap}>
        <header className={styles.topbar}>msgr</header>
        <div className={styles.messages}>
          {messages && messages.map((m,i)=>{
            return <Message m={m} key={i} />
          })}
        </div> 
        <TextInput sendMessage={this.send} />
      </div>
    );
  }
}

const Message = ({m}) => {
  const {img, text} = m
  const from = Math.random()>0.5?"you":"me"
  return <div className={styles.msg}>
    {img && <div className={styles.imagebubble}>
      <img alt="pic" src={img} />
    </div>}
    <div className={styles.textbubble} from={from}>
      <div className={styles.actualtext}>{text}</div>
    </div>
  </div>
}



