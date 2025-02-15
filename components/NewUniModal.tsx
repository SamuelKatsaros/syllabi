"use client";

import React, { useState } from 'react';

export default function NewUniModal() {
  const [universityName, setUniversityName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!universityName.trim()) {
      alert('Please enter a university name');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/request-university', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ universityName }),
      });

      if (response.ok) {
        alert('Request submitted successfully!');
        setUniversityName('');
        (document.getElementById('new_uni_modal') as HTMLDialogElement | null)?.close();
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit request. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <dialog id="new_uni_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white">
        <h3 className="font-bold text-lg mb-4 text-[#89CFF0]">Request a University</h3>
        <div className="space-y-4">
          <div className="form-control">
            <input 
              type="text" 
              placeholder="University Name" 
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              className="input input-bordered w-full text-gray-800 bg-white placeholder-gray-500"
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2">Cancel</button>
            </form>
            <button 
              className="btn text-white"
              style={{backgroundColor: "#89CFF0"}}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
