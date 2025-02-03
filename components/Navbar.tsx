"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import themes from "../themes.json"; // Import themes
import UploadModal from "./UploadModal";

export default function Navbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const universityId = searchParams?.get("university") || "3884b0da-b578-4e74-b921-e2d52dee1f71";
  const theme = themes[universityId as keyof typeof themes] || themes.default;
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("q") ?? "");

  // Update the URL query parameter "q" live as the user types.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("university", universityId);
    if (searchTerm.trim() !== "") {
      params.set("q", searchTerm);
    } else {
      params.delete("q");
    }
    // Use the current pathname instead of "/" so other pages (like /upload) aren't redirected.
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchTerm, universityId, router, pathname]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const params = new URLSearchParams();
      params.set("university", universityId);
      if (searchTerm.trim() !== "") {
        params.set("q", searchTerm);
      }
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="navbar text-white" style={{ backgroundColor: theme.primaryColor }}>
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-black">
            <li>
              <Link href="/">Homepage</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="navbar-center">
        <Link href="/" className="btn btn-ghost text-xl flex items-center">
          <img src={theme.logo} alt={`${theme.name} Logo`} className="h-8 w-8 mr-2" />
          {theme.name}
        </Link>
      </div>

      <div className="navbar-end">
        {showSearch ? (
          <div className="flex-none gap-2 flex items-center">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search syllabi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="input input-bordered w-24 md:w-auto text-black"
              />
            </div>
            <button className="btn btn-ghost btn-circle" onClick={() => setShowSearch(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button className="btn btn-ghost btn-circle" onClick={() => setShowSearch(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
        <UploadModal universityId={universityId} />
      </div>
    </div>
  );
}
