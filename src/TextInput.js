import React, { Component } from "react";
import styles from './TextInput.module.css'
import {FiArrowUp, FiCamera} from 'react-icons/fi'

export default class MessageInput extends Component {

  constructor(){
    super()
    this.state={
      text:'',
    }
  }

  onSend = () => {
    const {text} = this.state
    if(text){
      this.props.sendMessage({text})
      this.setState({text:''})
    }
  }

  render(){
    const {showCamera} = this.props
    const {text} = this.state
    return (<div className={styles.wrap}>
      <button className={styles.button}
        onClick={showCamera} style={{left:8}}>
        <FiCamera />
      </button>
      <input className={styles.input} value={text}
        onChange={(e) => this.setState({text:e.target.value})}
        onKeyPress={(e) => {
          if(e.key==='Enter') this.onSend()
        }}
      />
      <button className={styles.button}
        onClick={this.onSend} style={{right:10}}>
        <FiArrowUp />
      </button>
    </div>)
  }
}