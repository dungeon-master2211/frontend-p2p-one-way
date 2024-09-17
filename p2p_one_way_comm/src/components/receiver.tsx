import { useEffect, useRef, useState } from "react"
const receiver = () => {
    // const [socket,setSocket] = useState<WebSocket|null>()
    const videoRef = useRef<HTMLVideoElement>()
    useEffect(()=>{
        const ws = new WebSocket("ws://localhost:8001")
        ws.onopen = ()=>{
            ws.send(JSON.stringify({type:'iam-receiver'}))
        }
        let socket = ws
        const pc = new RTCPeerConnection()
        pc.ontrack = (e)=>{
                        
            console.log(e.track)
            // @ts-ignore
            videoRef.current.srcObject = new MediaStream([e.track])
            videoRef.current?.play()
        }
        socket?.addEventListener('message',async (e)=>{
            
            console.log(e.data)
            const message = JSON.parse(e.data)
            console.log(message)
            switch (message?.type) {
                case 'offer':
                    
                    
                    pc.onicecandidate = (e)=>{
                        if(e.candidate){
                            socket?.send(JSON.stringify({type:'ice-candidates',candidate:e.candidate}))
                        }
                    }
                    await pc.setRemoteDescription(message?.sdp)
                    const answer = await pc.createAnswer()
                    
                    await pc.setLocalDescription(answer)
                    
                    socket?.send(JSON.stringify({type:'create-answer',sdp:answer}))
                    break;
                case 'ice-candidates':
                    console.log('receiving ice-candidates',message.candidates)
                    await pc.addIceCandidate(message.candidates)
                    break;
                default:
                    break;
            }
        })
    },[])
    
    
    
  return (
    <div>
        receiver
        {/* @ts-ignore */}
        <video ref={videoRef} muted="true"></video>

    </div>
  )
}

export default receiver