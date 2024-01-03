import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </div>
  );
}