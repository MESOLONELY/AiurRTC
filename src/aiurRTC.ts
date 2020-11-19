import { Subject } from 'rxjs';
import { Pc } from './models/pc';

export class AiurRTC
{
    private configuration : RTCConfiguration;
    constructor(_configuration : RTCConfiguration)
    {
        this.configuration = _configuration;
    }

    public onIceCandidate: Subject<RTCPeerConnectionIceEvent> = new Subject<RTCPeerConnectionIceEvent>();

    public gotRemoteStream: Subject<RTCTrackEvent> = new Subject<RTCTrackEvent>();

    public init() : void
    {
        Pc.getInstance().setConfiguration(this.configuration);
        Pc.getInstance().addEventListener('icecandidate',
            e => this.onIceCandidate.next(e)
        );
        Pc.getInstance().addEventListener('track', 
            e => this.gotRemoteStream.next(e)
        );
    }

    public async handleOffer(offer: RTCSessionDescriptionInit)
    {
        await Pc.getInstance().setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await Pc.getInstance().createAnswer();
        await Pc.getInstance().setLocalDescription(answer);
        return answer;
    }

    public handleAnswer(answer: RTCSessionDescriptionInit) : void
    {
        Pc.getInstance().setRemoteDescription(new RTCSessionDescription(answer));
    }

    public handleCandidate(candidate: RTCIceCandidateInit | RTCIceCandidate) : void
    {
        Pc.getInstance().addIceCandidate(candidate);
    }

    public addTrack(stream : MediaStream) : void
    {
        stream.getTracks().forEach(track =>
        {
            Pc.getInstance().addTrack(track, stream);
        });
    }

    public async createOffer()
    {
        const offer = await Pc.getInstance().createOffer();
        await Pc.getInstance().setLocalDescription(offer);
        return offer;
    }

    public connectionState() : string
    {
        return Pc.getInstance().connectionState;
    }

    public close()
    {
        Pc.getInstance().close();
    }
}