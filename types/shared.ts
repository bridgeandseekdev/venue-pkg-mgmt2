import { Types } from 'mongoose';

export type ID = string | Types.ObjectId;

export type WithTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type MediaItem = {
  url: string | null;
  key: string | null;
  previewUrl: string | null;
};

export type MediaUploadStatus = 'uploading' | 'success' | 'error' | null;

export type UploadStatus = {
  image: {
    status: MediaUploadStatus;
  };
  video: {
    status: MediaUploadStatus;
  };
};
