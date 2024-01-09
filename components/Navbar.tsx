import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <div className='flex gap-1 items-center'>
      <Image src="/davies-cards-logo.png" alt="Logo" height={40} width={50} />
      <span className='text-xl text-red-700 font-bold'>Davies O-Hell Scoreboard</span>
    </div>
  );
}