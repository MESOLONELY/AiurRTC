export class Pc
{
    private static instance: RTCPeerConnection;

    public static getInstance()
    {
        if (!Pc.instance)
        {
            Pc.instance = new RTCPeerConnection();
        }
        return Pc.instance;
    }
}