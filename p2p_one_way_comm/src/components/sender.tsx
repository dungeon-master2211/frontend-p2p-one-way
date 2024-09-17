import { useEffect, useRef, useState } from "react"
const sender = () => {
    const [socket,setSocket] = useState<WebSocket|null>()
    const videoRef = useRef<HTMLVideoElement>()
    useEffect(()=>{
        const ws = new WebSocket("ws://localhost:8001")
        ws.onopen = ()=>{
            ws.send(JSON.stringify({type:'iam-sender'}))
        }
        setSocket(ws)
    },[])
async function sendVideo(){
    if(!socket) return
    const pc = new RTCPeerConnection()
    pc.onicecandidate = (e)=>{
        console.log('sending ice candidate',{type:'ice-candidates',candidate:e.candidate})
        if(e.candidate){
            socket?.send(JSON.stringify({type:'ice-candidates',candidate:e.candidate}))
        }
    }
    pc.onnegotiationneeded = async ()=>{
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        socket?.send(JSON.stringify({type:'create-offer',sdp:offer}))
    }
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    socket?.send(JSON.stringify({type:'create-offer',sdp:offer}))
    socket?.addEventListener('message',async (e)=>{
        const message = JSON.parse(e.data)
        switch(message?.type){
            case 'answer':
                await pc.setRemoteDescription(message.sdp)
                break;
            case 'ice-candidates':
                await pc.addIceCandidate(message.candidates)
                break;
            default:
                break;
        }
    })
    
    let stream = await navigator.mediaDevices.getUserMedia({audio:false,video:true})
    
    if(videoRef.current){
        {/* @ts-ignore */}
        videoRef.current.srcObject = stream
        videoRef.current.play()
    }
    console.log(stream.getTracks()[0])
    pc.addTrack(stream.getTracks()[0])
    
}

  return (
    <div>
        sender
        <button onClick={sendVideo}>Start</button>
        {/* @ts-ignore */}
        <video ref={videoRef}></video>
    </div>
  )
}

export default sender