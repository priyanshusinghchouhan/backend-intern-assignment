import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl mb-4 text-black">Backend Intern Assignment</h1>
        <p className="mb-8 text-black">Scalable REST API with Authentication & Role-Based Access</p>
        <div className="space-x-4">
          <Link href="/register" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Register</Link>
          <Link href="/login" className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Login</Link>
        </div>
      </div>
    </div>
  );
}
