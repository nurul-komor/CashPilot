import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface AccountDocumentScannerProps {
    onDataExtracted: (data: {
        name?: string;
        type?: string;
        financial_institution_id?: string;
        account_number?: string;
        balance?: string;
        currency?: string;
        notes?: string;
    }) => void;
}

export default function AccountDocumentScanner({ onDataExtracted }: AccountDocumentScannerProps) {
    const [isScanning, setIsScanning] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        setIsUploading(true);
        setError(null);
        setPreview(URL.createObjectURL(file));

        try {
            const formData = new FormData();
            formData.append('document', file);

            // Use axios which is configured in bootstrap.js with proper headers
            // Sanctum SPA authentication uses cookies, so withCredentials is handled automatically
            const response = await axios.post('/api/ai/account-document-ocr', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
            });

            if (response.data.success) {
                onDataExtracted(response.data.data);
            } else {
                setError(response.data.message || 'Failed to extract account information');
            }
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Please log in to use AI features');
                router.visit('/login');
            } else {
                setError(err.response?.data?.message || 'Failed to process document. Please try again.');
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const startCamera = async () => {
        try {
            setError(null);
            setIsScanning(true);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Use back camera on mobile
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError('Unable to access camera. Please check permissions.');
            setIsScanning(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
                        stopCamera();
                        handleFileUpload(file);
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };

    const clearPreview = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-4">
            {/* Scanner Buttons */}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={isScanning ? stopCamera : startCamera}
                    disabled={isUploading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 text-sm font-medium text-purple-700 hover:from-purple-100 hover:to-pink-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isScanning ? (
                        <>
                            <X className="h-4 w-4" />
                            Stop Camera
                        </>
                    ) : (
                        <>
                            <Camera className="h-4 w-4" />
                            Scan with Camera
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || isScanning}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 text-sm font-medium text-purple-700 hover:from-purple-100 hover:to-pink-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <Upload className="h-4 w-4" />
                    Upload Image
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Camera View */}
            {isScanning && (
                <div className="relative rounded-lg overflow-hidden border-2 border-purple-300 bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-2 border-white border-dashed rounded-lg w-4/5 h-3/4"></div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={stopCamera}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={capturePhoto}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Capture
                        </button>
                    </div>
                </div>
            )}

            {/* Preview */}
            {preview && !isScanning && (
                <div className="relative rounded-lg overflow-hidden border-2 border-purple-300">
                    <img src={preview} alt="Preview" className="w-full h-64 object-contain bg-gray-50" />
                    <button
                        type="button"
                        onClick={clearPreview}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-center text-white">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                                <p className="text-sm">AI is analyzing your document...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* AI Processing Indicator */}
            {isUploading && (
                <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-3">
                    <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
                    <p className="text-sm text-gray-700">AI is extracting account information from your document...</p>
                </div>
            )}
        </div>
    );
}

