import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { AudioRecorder, AudioQueue, createWavFromPCM, encodeAudioForAPI } from '@/utils/RealtimeAudio';

interface VoiceInterfaceProps {
  onTranscript?: (text: string, isUser: boolean) => void;
}

export const VoiceInterface = ({ onTranscript }: VoiceInterfaceProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState('');

  const startConversation = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      audioQueueRef.current = new AudioQueue(audioContextRef.current);

      // Connect to WebSocket
      const wsUrl = `wss://gvzebhhyswhnpxaxtnzm.supabase.co/functions/v1/realtime-voice`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Start audio recording
        recorderRef.current = new AudioRecorder((audioData) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const encoded = encodeAudioForAPI(audioData);
            wsRef.current.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: encoded
            }));
          }
        });
        
        recorderRef.current.start().catch((error) => {
          console.error('Failed to start recording:', error);
          toast({
            title: "Microphone Error",
            description: "Failed to access microphone. Please check permissions.",
            variant: "destructive",
          });
        });

        toast({
          title: "Connected",
          description: "Voice interface is ready. Start speaking!",
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received event:', data.type);

          if (data.type === 'response.audio.delta') {
            setIsSpeaking(true);
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            await audioQueueRef.current?.addToQueue(bytes);
          } else if (data.type === 'response.audio.done') {
            setIsSpeaking(false);
          } else if (data.type === 'conversation.item.input_audio_transcription.completed') {
            const userText = data.transcript || '';
            setCurrentTranscript(userText);
            onTranscript?.(userText, true);
          } else if (data.type === 'response.audio_transcript.delta') {
            setCurrentTranscript(prev => prev + (data.delta || ''));
          } else if (data.type === 'response.audio_transcript.done') {
            onTranscript?.(data.transcript || currentTranscript, false);
            setCurrentTranscript('');
          } else if (data.type === 'error') {
            console.error('OpenAI error:', data.error);
            toast({
              title: "Error",
              description: data.error.message || "An error occurred",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice service",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        setIsSpeaking(false);
        cleanup();
      };

    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    }
  };

  const cleanup = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    audioQueueRef.current?.clear();
    audioContextRef.current?.close();
    audioContextRef.current = null;
  };

  const endConversation = () => {
    wsRef.current?.close();
    cleanup();
    setIsConnected(false);
    setIsSpeaking(false);
    toast({
      title: "Disconnected",
      description: "Voice conversation ended",
    });
  };

  useEffect(() => {
    return () => {
      wsRef.current?.close();
      cleanup();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {!isConnected ? (
        <Button 
          onClick={startConversation}
          size="lg"
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Mic className="w-5 h-5" />
          Start Voice Chat
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <Button 
              onClick={endConversation}
              variant="destructive"
              size="lg"
              className="gap-2"
            >
              <MicOff className="w-5 h-5" />
              End Voice Chat
            </Button>
          </div>
          
          {isSpeaking && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
              <Volume2 className="w-4 h-4" />
              AI is speaking...
            </div>
          )}
        </div>
      )}
    </div>
  );
};
