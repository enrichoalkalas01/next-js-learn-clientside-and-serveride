"use client"

// pages/index.js
import { useState } from 'react';

export default function Home() {
    const [file, setFile] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        console.log(res)
        // const data = await res.json();
        // if (res.ok) {
        //     alert('File uploaded successfully: ' + data.filename);
        // } else {
        //     alert('Error: ' + data.error);
        // }
    };

    return (
        <div>
            <h1>Upload Image</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}
