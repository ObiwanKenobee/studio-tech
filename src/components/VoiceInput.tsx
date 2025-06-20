"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onVoiceRecorded: (dataUri: string) => void;
  isProcessing: boolean;
}

export function VoiceInput({ onVoiceRecorded, isProcessing }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Effect to handle client-side only MediaRecorder initialization and cleanup
  useEffect(() => {
    // MediaRecorder is browser-specific, so we don't do anything on SSR
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    setError(null);
    if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // Standard webm, good compatibility
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64Audio = reader.result as string;
            onVoiceRecorded(base64Audio);
          };
          stream.getTracks().forEach(track => track.stop()); // Release microphone
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Could not access microphone. Please check permissions.");
        setIsRecording(false);
      }
    } else {
      setError("Voice recording is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        size="lg"
        aria-label={isRecording ? "Stop recording" : "Start recording"}
        className="w-full max-w-xs"
      >
        {isProcessing ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : isRecording ? (
          <StopCircle className="mr-2 h-5 w-5" />
        ) : (
          <Mic className="mr-2 h-5 w-5" />
        )}
        {isProcessing ? "Processing..." : isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {isRecording && <p className="text-sm text-muted-foreground">Recording audio...</p>}
      {error && (
        <div className="text-destructive text-sm flex items-center">
          <AlertTriangle className="mr-2 h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
