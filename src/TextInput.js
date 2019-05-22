import React, { Component } from "react";
import styles from './TextInput.module.css'
import {FiArrowUp} from 'react-icons/fi'

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
    const {disabled} = this.props
    const {text} = this.state
    return (<div className={styles.wrap}>
      <input className={styles.input} value={text}
        onChange={(e) => this.setState({text:e.target.value})}
        onKeyPress={(e) => {
          if(e.key==='Enter') this.onSend()
        }}
      />
      <button className={styles.sendbutton}
        disabled={disabled}
        onClick={this.onSend}>
        <FiArrowUp />
      </button>
    </div>)
  }
}