import Link from 'next/link';
import { Button } from './ui/button';
import { Settings2Icon, UserIcon } from 'lucide-react';

export function Header() {
  return (
    <div className='px-4 py-4 w-full fixed top-0 right-0 left-0 flex justify-between items-center  shadow bg-white'>
      <div className='text-lg font-bold'>창의력 체육관</div>
      <div>
        <Button variant='secondary' size='sm' aria-label='login'>
          <Link href='/login' className='flex items-center gap-2'>
            login
          </Link>
        </Button>
        <Button variant='secondary' size='sm' aria-label='login'>
          <Link href='/profile' className='flex items-center gap-2'>
            profile
            <UserIcon />
          </Link>
        </Button>
        <Button variant='ghost' size='sm' aria-label='login'>
          <Link href='/option' className='flex items-center gap-2'>
            option
            <Settings2Icon />
          </Link>
        </Button>
      </div>
    </div>
  );
}
