import React from 'react';
import TextInput from './TextInput'
import mockMessages from './mockMessages'
import styles from './App.module.css'
import * as firebase from "firebase/app";
import "firebase/firestore";
import {FiEdit} from 'react-icons/fi'

export default class extends React.Component {

  state={
    messages:[],
    name:'',
    editName:true,
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

    const name = localStorage.getItem('name')
    if(name){
      this.setState({name, editName:false})
    }
  }

  send = (m) => {
    this.db.collection("messages").add({
      from:this.state.name || 'No name',
      text:m.text
    })
  }

  changeName = (name) => {
    localStorage.setItem('name',name)
    this.setState({name})
  }

  receive = (m) => {
    if(!m.text) return
    const messages = [...this.state.messages]
    messages.unshift(m)
    this.setState({messages})
  }

  render() {
    const {messages, name, editName} = this.state
    return (
      <div className={styles.wrap}>
        <header className={styles.topbar}>
          msgr
          <Username name={name} editName={editName}
            changeName={this.changeName}
            setEditName={(bool)=>this.setState({editName:bool})}
          />
        </header>
        <div className={styles.messages}>
          {messages && messages.map((m,i)=>{
            console.log(name,m.from)
            return <Message m={m} key={i} name={name} />
          })}
        </div> 
        <TextInput sendMessage={this.send} />
      </div>
    );
  }
}

const Message = ({m, name}) => {
  const {img, from, text} = m
  return <div className={styles.msg} from={name===m.from?"me":"you"}>
    <div className={styles.name}>{from}</div>
    {img && <div className={styles.imagebubble}>
      <img alt="pic" src={img} />
    </div>}
    <div className={styles.textbubble}>
      <div className={styles.actualtext}>{text}</div>
    </div>
  </div>
}

const Username = ({name, editName, changeName, setEditName})=> {
  return editName ? <div className={styles.editusername}>
    <input value={name} className={styles.nameinput}
      onChange={e=>changeName(e.target.value)}
    />
    <button className={styles.namebutton}
      onClick={()=>setEditName(false)}>
      OK
    </button>
  </div> : <div className={styles.username}>
    {name}
    <FiEdit style={{marginLeft:10,cursor:'pointer'}} 
      onClick={()=>setEditName(true)}
    />
  </div>
}


