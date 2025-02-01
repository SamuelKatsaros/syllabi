import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8 mr-2" />
          UniSyllabi
        </Link>
      </div>
      <div className="flex-none">
        <Link
          href="/upload?university=3884b0da-b578-4e74-b921-e2d52dee1f71"
          className="btn btn-primary"
        >
          Upload Syllabus
        </Link>
      </div>
    </div>
  );
} 