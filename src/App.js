import React from 'react';
import TextInput from './TextInput'
import styles from './App.module.css'
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage"
import {FiEdit} from 'react-icons/fi'
import Camera from 'react-snap-pic'
import nanoid from 'nanoid'

export default class extends React.Component {

  state={
    messages:[],
    name:'',
    editName:true,
    showCamera:false,
  }

  async componentWillMount(){
    firebase.initializeApp({
      apiKey: "AIzaSyBAJVwrP5J4AhVKd5ijYtcTF9XMV6tIcY4",
      authDomain: "msgr-2.firebaseapp.com",
      projectId: "msgr-2",
      storageBucket: "msgr-2.appspot.com",
    });
    
    this.db = firebase.firestore();

    this.db.collection("messages").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          //console.log(change.doc.data())
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
      ...m,
      from: this.state.name || 'No name',
      ts: Date.now()
    })
  }

  setEditName = (editName) => {
    this.setState({editName})
    if(editName===false){
      localStorage.setItem('name',this.state.name)
    }
  }

  receive = (m) => {
    const messages = [...this.state.messages]
    messages.unshift(m)
    messages.sort((a,b)=>b.ts-a.ts)
    this.setState({messages})
  }

  takePicture = async (img) => {
    this.setState({showCamera:false})
    const imgID = nanoid()
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child(imgID+'.jpg');
    try {
      await ref.putString(img, 'data_url')
      this.send({img: imgID})
    } catch(e) {
      console.log(e)
    }
  }

  render() {
    const {messages, name, editName, showCamera} = this.state
    return (
      <div className={styles.wrap}>
        {showCamera && <Camera takePicture={this.takePicture} />}
        <header className={styles.topbar}>
          msgr
          <Username name={name} editName={editName}
            changeName={(name)=>this.setState({name})}
            setEditName={this.setEditName}
          />
        </header>
        <div className={styles.messages}>
          {messages && messages.map((m,i)=>{
            return <Message m={m} key={i} name={name} />
          })}
        </div> 
        <TextInput sendMessage={this.send} 
          showCamera={()=>this.setState({showCamera:true})}
        />
      </div>
    );
  }
}

const bucket = 'https://firebasestorage.googleapis.com/v0/b/msgr-2.appspot.com/o/'
const suffix = '.jpg?alt=media'
const Message = ({m, name}) => {
  const {img, from, text} = m
  return <div className={styles.msg} from={name===m.from?"me":"you"}>
    <div className={styles.name}>{from}</div>
    {img ? <div className={styles.bubble}>
      <img alt="pic" src={bucket+img+suffix} />
    </div> : 
    <div className={styles.bubble}>
      <div>{text}</div>
    </div>}
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


