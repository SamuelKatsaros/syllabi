"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import themes from "../themes.json";

export default function NotificationBar() {
  const [visible, setVisible] = useState(false);
  const searchParams = useSearchParams();
  const universityId = searchParams?.get('university') || '3884b0da-b578-4e74-b921-e2d52dee1f71';
  const theme = themes[universityId as keyof typeof themes] || themes.default;

  useEffect(() => {
    // Delay the alert appearance by 2 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpload = () => {
    // Open the upload modal (assuming its id is "upload_modal")
    const modal = document.getElementById("upload_modal") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    }
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-2 left-0 right-0 z-50 px-2 md:px-0 md:bottom-4">
      <div className="container mx-auto max-w-screen-xl">
        <div 
          role="alert" 
          className="alert shadow-lg py-2 md:py-4" 
          style={{ backgroundColor: theme.primaryColor, color: 'white' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-5 w-5 md:h-6 md:w-6 shrink-0 stroke-white">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
          </svg>
          <div className="flex-1 text-sm md:text-base">
            <h3 className="font-bold">Upload your syllabi!</h3>
            <div className="text-xs hidden md:block">Built by students for students.</div>
          </div>
          <div className="flex-none flex gap-1">
            <button 
              className="btn btn-sm" 
              onClick={handleUpload}
              style={{ backgroundColor: 'white', color: theme.primaryColor }}
            >
              Upload
            </button>
            <button 
              className="btn btn-sm btn-square" 
              onClick={handleClose}
              style={{ backgroundColor: 'white', color: theme.primaryColor }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}