/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Video as VideoIcon, Image as ImageIcon } from 'lucide-react';
import { UploadStatusIndicator } from '../ui/UploadStatusIndicator';

interface MediaUploadFieldProps {
  type: 'image' | 'video';
  previewUrl: string | null;
  uploadStatus: 'uploading' | 'success' | 'error' | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MediaUploadField = ({
  type,
  previewUrl,
  uploadStatus,
  onChange,
}: MediaUploadFieldProps) => (
  <div className="relative">
    <input
      type="file"
      accept={type === 'image' ? 'image/jpeg,image/png' : 'video/mp4'}
      onChange={onChange}
      className="hidden"
      id={`${type}-upload`}
    />
    <label
      htmlFor={`${type}-upload`}
      className="flex flex-col p-6 h-40 items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-black/50 transition-colors"
    >
      {previewUrl ? (
        type === 'image' ? (
          <img
            alt="image-preview"
            src={previewUrl}
            className="w-full h-40 object-cover rounded-lg"
          />
        ) : (
          <video
            src={previewUrl}
            className="w-full h-40 object-cover rounded-lg"
            controls
          />
        )
      ) : (
        <div className="p-6 flex flex-col items-center justify-center">
          {type === 'image' ? (
            <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
          ) : (
            <VideoIcon className="w-8 h-8 mb-2 text-gray-400" />
          )}
          <span className="text-sm text-gray-500">Upload {type}</span>
        </div>
      )}
    </label>
    <UploadStatusIndicator status={uploadStatus} />
  </div>
);

export default MediaUploadField;
