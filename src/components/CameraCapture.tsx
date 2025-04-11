
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onReset: () => void;
  hasImage: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onReset, hasImage }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      if (isCameraActive && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
          setIsCameraActive(false);
        }
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const handleCaptureClick = () => {
    if (!isCameraActive) {
      setIsCameraActive(true);
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        onCapture(imageData);
        setIsCameraActive(false);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        onCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    onReset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
        {isCameraActive && (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="camera-overlay"></div>
          </>
        )}
        
        {capturedImage && !hasImage && (
          <img 
            src={capturedImage} 
            alt="Captured food" 
            className="w-full h-full object-cover"
          />
        )}
        
        {!isCameraActive && !capturedImage && !hasImage && (
          <div className="text-center p-8">
            <div className="inline-block p-4 rounded-full bg-foodtrack-light mb-3">
              <Utensils className="h-8 w-8 text-foodtrack-primary" />
            </div>
            <p className="text-gray-500">Take a photo of your food or upload an image</p>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="mt-4 flex justify-center space-x-3">
        {(!capturedImage && !hasImage) && (
          <>
            <Button 
              onClick={handleCaptureClick}
              className="flex items-center space-x-2"
              variant={isCameraActive ? "default" : "outline"}
            >
              <Camera className="h-4 w-4" />
              <span>{isCameraActive ? "Take Photo" : "Camera"}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload} 
              />
            </Button>
          </>
        )}
        
        {(capturedImage || hasImage) && (
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 text-red-500 border-red-200 hover:bg-red-50"
            onClick={handleReset}
          >
            <X className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
