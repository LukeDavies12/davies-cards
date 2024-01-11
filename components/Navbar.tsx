import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <Link href="/">
      <div className='flex gap-1 items-center py-4'>
        <Image src="/davies-cards-logo.png" alt="Logo" height={50} width={50} />
        <span className=' text-red-700 font-bold text-lg'>Davies Cards</span>
      </div>
    </Link>
  );
}