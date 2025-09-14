import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import useSWR from 'swr';
import invariant from 'tiny-invariant';

export function UploadForm() {
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const { mutate } = useSWR('/api/db/json');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(null);
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    setSuccess(null);
    const droppedFile = e.dataTransfer.files?.[0] || null;
    setFile(droppedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!file) {
      setError('Please select a JSON file.');
      return;
    }
    setLoading(true);
    try {
      const text = await file.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch (err) {
        setError('Invalid JSON file.');
        setLoading(false);
        return;
      }
      const res = await axios.post('/api/db/json', {
        name: file.name,
        body: json,
      });
      setSuccess(`Uploaded! New ID: ${res.data.id}`);
      await mutate(); // Refresh email list
      router.push(`/email/${res.data.id}`); // Redirect to page with the new id
    } catch (err) {
      invariant(err instanceof AxiosError);
      setError(err?.response?.data?.error || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='flex flex-col items-center gap-4' onSubmit={handleSubmit}>
      <h2 className='text-lg font-semibold'>Upload Email Data</h2>
      <div
        className={`border-2 border-dashed rounded p-4 w-full max-w-md flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
        aria-label='Drag and drop JSON file here'
      >
        <input
          type='file'
          accept='.json'
          className='hidden'
          id='file-upload-input'
          onChange={handleFileChange}
        />
        <label
          htmlFor='file-upload-input'
          className='cursor-pointer w-full text-center'
        >
          {file ? (
            <span className='text-green-700'>Selected: {file.name}</span>
          ) : (
            <span className='text-gray-500'>
              Drag & drop a JSON file here, or click to select
            </span>
          )}
        </label>
      </div>
      <button
        type='submit'
        className='bg-blue-500 text-white px-4 py-2 rounded'
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <div className='text-red-500'>{error}</div>}
      {success && <div className='text-green-600'>{success}</div>}
    </form>
  );
}
