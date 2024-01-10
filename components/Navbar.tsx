import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <div className='flex gap-1 items-center'>
      <Image src="/davies-cards-logo.png" alt="Logo" height={60} width={60} />
      <span className='text-lg text-red-700 font-bold'>Davies O-Hell Scoreboard</span>
    </div>
  );
}