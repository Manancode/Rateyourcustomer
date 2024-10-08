"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu'
import React from 'react'
import Link from 'next/link'
import { BellDot, FileClock, LogOutIcon, Settings } from 'lucide-react'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs'



export const Dropitems = [
    {name : "Notifications" , href : "/notification" , icon : BellDot},
    {name : "Activity log" , href : "/", icon : FileClock}, 
    {name : "Settings" , href : "/settings" , icon : Settings},
    
    
]                                                   

function Usernav({name , email , image}:{name : string , email : string , image : string}) {

    
  return (
   <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className='relative h-10 w-10 rounded-full'>
            <Avatar className='h-10 w-10 rounded-full'>
                <AvatarImage src={image} alt='Avatarimg'/>
                <AvatarFallback>M</AvatarFallback>
            </Avatar>
            
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel>
            <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>{name}</p>
                <p className='text-xs leading-none text-muted-foreground' > {email}
                </p>
            </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
            {Dropitems.map((item,index)=>(
                <DropdownMenuItem asChild key={index}>
                    <Link href={item.href} className='w-full flex justify-between items-center'>
                        {item.name}
                        <span>
                            <item.icon className='w-4 h-4'/>
                        </span>
                    </Link>
                </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator/>
        <DropdownMenuItem className='w-full flex justify-between items-center' asChild>
            <LogoutLink >
                Logout{" "}
                <span>
                    <LogOutIcon className='w-4 h-4' />
                </span>
            </LogoutLink>
        </DropdownMenuItem>
    </DropdownMenuContent>
   </DropdownMenu>
  )
}

export default Usernav
