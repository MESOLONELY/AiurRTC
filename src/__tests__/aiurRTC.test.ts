import { AiurRTC } from "../aiurRTC"

test('Simple test', () => 
{
    var apc1 = new AiurRTC
    ({
        iceServers:[
            {
                urls:'stun.l.google.com:19302'
            }
        ]
    });
    var apc2 = new AiurRTC
    ({
        iceServers:[
            {
                urls:'stun.l.google.com:19302'
            }
        ]
    });
    apc1.onIceCandidate.subscribe(e => {if(e.candidate) apc2.handleCandidate(e.candidate);});
    apc2.onIceCandidate.subscribe(e => {if(e.candidate) apc1.handleCandidate(e.candidate);});
    apc1.gotRemoteStream.subscribe(e => console.log(e));
    apc2.gotRemoteStream.subscribe(e => console.log(e));
    apc1.init();
    apc2.init();
    apc1.createOffer().then(e => apc2.handleOffer(e).then(e2 => apc1.handleAnswer(e2)));
    expect(apc1.connectionState()).toBe("connected");
    expect(apc2.connectionState()).toBe("connected");
    apc1.close();
    expect(apc1.connectionState()).toBe("closed");
    expect(apc2.connectionState()).toBe("disconnected");
});
