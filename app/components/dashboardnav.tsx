"use client"
import { cn } from '@/lib/utils'
import { Building, CreditCard, Headset, HomeIcon, Settings, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


export const navitems = [
    {name : "Dashboard" , href : "/dashboard" , icon : HomeIcon},
    {name : "Team" , href : "/dashboard/organization", icon : Building}, 
    {name : "Billings" , href : "/dashboard/billings" , icon : CreditCard},
    {name : "Support" , href : "/dashboard/support" , icon : Headset}, 
    {name : "Settings" , href : "/dashboard/settings" , icon : SettingsIcon}, 
    
]

function Dashboardnav() {
    const pathname = usePathname()
  return (
    <nav className='grid items-start gap-2'>
        {navitems.map((item, index) =>
        <Link key={index} href={item.href}>
        <span className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground" , pathname==item.href ? "bg-accent" : "bg-transparent"
        )}> 
        <item.icon className='mr-2 h-4 w-4 text-primary'/>
        <span>{item.name}</span>
        </span>
        </Link>
    )}
    </nav>
  )
}

export default Dashboardnav
