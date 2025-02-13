import { signOut, useSession } from 'next-auth/react';
import React from 'react'
import { Loader } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';

const Profile = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    if (status === 'loading') {
        return (
            <div className='flex h-full justify-center items-center'>
                <Loader className='size-10' />
            </div>
        )
    }

    const handleSignOut = async () => {
        await signOut({
            redirect: false,
        });
        router.push('sign-in');
    }

    return (
        <div className='flex h-full justify-center items-center'>
            {
                session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar className="size-14">
                                <AvatarImage src={session.user?.image || undefined} />
                                <AvatarFallback className="bg-gray-800 text-white">{session.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>{session.user?.email}</DropdownMenuItem>
                                <DropdownMenuItem>{session.user?.name}</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Button onClick={handleSignOut} className="w-100">SignOut</Button>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button><Link href='sign-in'>SignIn</Link></Button>
                )
            }
        </div>
    )
}

export default Profile
