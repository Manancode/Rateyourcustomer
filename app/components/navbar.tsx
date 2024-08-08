import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from 'next/link';
import React from 'react';
import { ThemeToggle } from './themetoggle';
import { Button } from '@/components/ui/button';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Usernav from "./usernav";


export default async function Navbar() {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const user = await getUser();

    return (
        <nav className='border-b bg-background h-[10vh] flex items-center'>
            <div className='container flex items-center justify-between'>
                <Link href={"/dashboard"}>
                <h1 className='font-bold text-2xl text-primary'>Dashboard</h1>
                </Link>
                <div className='flex items-center gap-x-5'>
                    
                    {(await isAuthenticated()) ? (
                        <>
                            
                            <Link href="/dashboard/developer">
                                <Button variant='link'>Developer</Button>
                            </Link>
                            
                            <Usernav email={user?.email as string} image={user?.picture as string} name={user?.given_name as string} />
                        </>
                    ) : (
                        <div className='flex items-center gap-x-5'>
                            <RegisterLink>
                                <Button variant={'secondary'}>SignUp</Button>
                            </RegisterLink>
                            <LoginLink>
                                <Button>SignIn</Button>
                            </LoginLink>
                            <ThemeToggle />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
