import { useState } from 'react';
import { UploadStatus } from '@/types';
import { nanoid } from 'nanoid';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const MULTIPART_THRESHOLD = 5 * 1024 * 1024; // 5MB
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4'];

interface UseFileUploadProps {
  onUploadSuccess: (
    url: string,
    key: string,
    mediaType: 'image' | 'video',
  ) => void;
  onUploadError: () => void;
  onPreviewGenerated: (url: string, mediaType: 'image' | 'video') => void;
}

export const useFileUpload = ({
  onUploadSuccess,
  onUploadError,
  onPreviewGenerated,
}: UseFileUploadProps) => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    image: { status: null },
    video: { status: null },
  });

  const validateFile = (file: File, type: 'image' | 'video') => {
    const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    const acceptedTypes =
      type === 'image' ? ACCEPTED_IMAGE_TYPES : ACCEPTED_VIDEO_TYPES;

    if (!acceptedTypes.includes(file.type)) {
      alert(
        `Invalid ${type} type. Only ${acceptedTypes.join(', ')} are allowed.`,
      );
      return false;
    }
    if (file.size > maxSize) {
      alert(`File size exceeds the limit of ${maxSize / 1024 / 1024}MB.`);
      return false;
    }
    return true;
  };

  const handleFileUpload = async (file: File, mediaType: 'image' | 'video') => {
    if (!file) return;

    try {
      if (!validateFile(file, mediaType)) return;
      setUploadStatus((prev) => ({
        ...prev,
        [mediaType]: { status: 'uploading' },
      }));

      const previewUrl = URL.createObjectURL(file);
      onPreviewGenerated(previewUrl, mediaType);

      const isLargeVideo =
        file.type.startsWith('video/') && file.size > MULTIPART_THRESHOLD;

      if (isLargeVideo) {
        await handleMultipartUpload(file, mediaType);
      } else {
        await handleRegularUpload(file, mediaType);
      }

      setUploadStatus((prev) => ({
        ...prev,
        [mediaType]: { status: 'success' },
      }));
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload file');
      onUploadError();
      setUploadStatus((prev) => ({
        ...prev,
        [mediaType]: { status: 'error' },
      }));
    }
  };

  const handleMultipartUpload = async (
    file: File,
    mediaType: 'image' | 'video',
  ) => {
    const key = `${mediaType}/${nanoid()}.${file.type.split('/')[1]}`;
    const chunks = Math.ceil(file.size / CHUNK_SIZE);

    // Initiate multipart upload
    const initiateResponse = await fetch('/api/multipart/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        contentType: file.type,
      }),
    });

    if (!initiateResponse.ok) {
      throw new Error('Failed to initiate upload');
    }

    const { uploadId } = await initiateResponse.json();

    // Upload all parts in parallel
    const uploadPromises = Array.from({ length: chunks }, async (_, i) => {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      const urlResponse = await fetch('/api/multipart/getUploadUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          uploadId,
          partNumber: i + 1,
        }),
      });

      if (!urlResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl } = await urlResponse.json();
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: chunk,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload part ${i + 1}`);
      }

      const ETag = uploadResponse.headers.get('ETag');
      return {
        PartNumber: i + 1,
        ETag: ETag?.replace(/"/g, ''),
      };
    });

    const uploadedParts = await Promise.all(uploadPromises);

    // Complete multipart upload
    const completeResponse = await fetch('/api/multipart/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key,
        uploadId,
        parts: uploadedParts,
      }),
    });

    if (!completeResponse.ok) {
      throw new Error('Failed to complete upload');
    }

    const { finalUrl } = await completeResponse.json();
    onUploadSuccess(finalUrl, key, mediaType);
  };

  const handleRegularUpload = async (
    file: File,
    mediaType: 'image' | 'video',
  ) => {
    const response = await fetch('/api/upload-urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentType: file.type,
        fileType: mediaType,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, key, finalUrl } = await response.json();

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file');
    }

    onUploadSuccess(finalUrl, key, mediaType);
  };

  return {
    uploadStatus,
    handleFileUpload,
  };
};
