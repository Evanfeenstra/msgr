import React from 'react'

class Camera extends React.Component {

  constructor(){
    super()
    this.getScreenshot = this.getScreenshot.bind(this)
    this.getCanvas = this.getCanvas.bind(this)
    this.capture = this.capture.bind(this)
  }

  getScreenshot() {
    const stream = this.video.srcObject
    const {canvas, aspectRatio} = this.getCanvas();
    const img = this.capture(canvas, aspectRatio)
    const track = stream.getTracks()[0];
    track.stop();
    this.props.takePicture(img)
  }

  capture(canvas, aspectRatio){
    var resizedCanvas = document.createElement("canvas");
    var resizedContext = resizedCanvas.getContext("2d");
    const h = 200
    const w = h*aspectRatio
    resizedCanvas.height = h + '';
    resizedCanvas.width = w + '';
    resizedContext.drawImage(canvas, 0, 0, w, h);
    return resizedCanvas.toDataURL("image/jpeg", 0.35);
  }

  getCanvas() {
    let aspectRatio
    let canvas
    if (!this.ctx) {
      canvas = document.createElement("canvas");
      aspectRatio = this.video.videoWidth / this.video.videoHeight;
      const canvasWidth = this.video.clientWidth;
      canvas.width = canvasWidth;
      canvas.height = canvasWidth / aspectRatio;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
    }
    return {canvas, aspectRatio}
  };

  componentDidMount(){
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: true
        })
        .then(mediaStream => {
          this.video.srcObject = mediaStream;
          this.video.play();
        })
        .catch(error => error);
    }
  }

  render(){
    return (<div style={styles.camera}>
      <video playsInline={true} ref={r=>this.video=r}
        style={styles.video}
        height={window.innerHeight} width={window.innerWidth} />
      <button style={styles.takepic} onClick={this.getScreenshot} />
    </div>)
  }
}

const styles={
  camera:{
    position: 'absolute',
    top:0,left:0,right:0,bottom:0,
    background: 'white',
    zIndex: 200,
  },
  video:{
    position: 'absolute',
    background: 'black',
    objectFit: 'cover',
  },
  takepic:{
    borderRadius:'100%',
    height:60,
    width:60,
    position:'absolute',
    bottom:40,
    background:'#c90000',
    left:'calc(50% - 30px)',
    border: '2px solid white',
    cursor: 'pointer',
    zIndex:201,
  }
}

export default Camera