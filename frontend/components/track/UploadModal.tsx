'use client';

import { useState } from 'react';
import { tracksAPI } from '@/lib/api';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function UploadModal({ onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (20MB)
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError('File size must be less than 20MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/m4a', 'audio/aac', 'audio/ogg'];
      if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(mp3|wav|flac|m4a|aac|ogg)$/i)) {
        setError('Invalid file type. Please upload an audio file.');
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a track title');
      return;
    }

    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      await tracksAPI.upload(title, file);
      onSuccess();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.response?.data?.detail || 'Failed to upload track');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-md w-full p-6 animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Upload New Track</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-text-primary mb-2 font-medium">Track Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Track"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-secondary focus:border-accent focus:outline-none"
              disabled={isUploading}
            />
          </div>

          {/* File */}
          <div>
            <label className="block text-text-primary mb-2 font-medium">Audio File</label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept="audio/*,.mp3,.wav,.flac,.m4a,.aac,.ogg"
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="file-upload"
                className="block w-full px-4 py-8 bg-background border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:border-accent transition"
              >
                {file ? (
                  <div>
                    <p className="text-text-primary font-medium">{file.name}</p>
                    <p className="text-text-secondary text-sm mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-text-primary mb-2">📁 Drop file here or click</p>
                    <p className="text-text-secondary text-sm">
                      Supported: MP3, WAV, FLAC, M4A, AAC, OGG
                    </p>
                    <p className="text-text-secondary text-sm">Max size: 20MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Info */}
          <p className="text-text-secondary text-sm flex items-center gap-2">
            <span>ℹ️</span>
            <span>Will be transcoded to 256kbps MP3</span>
          </p>

          {/* Error */}
          {error && (
            <div className="p-3 bg-error bg-opacity-10 border border-error rounded-lg">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-3 border border-border rounded-lg text-text-secondary hover:bg-border transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !title.trim() || !file}
              className="flex-1 px-4 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isUploading ? 'Uploading...' : 'Upload 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
