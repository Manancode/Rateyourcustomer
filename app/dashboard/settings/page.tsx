
import { Submitbutton } from '@/app/components/submitbuttons'
import prisma from '@/app/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import React from 'react'


async function getdata(userid : string){
  if(!userid){
    const data = await prisma.user.findUnique({
        where :{
            id : userid , 
        } ,
        select : {
            name : true , 
            email: true , 
           

        }
    })
    return data
  }

    
}



async function Settings() {
 const {getUser} = getKindeServerSession()
 const user = await getUser()
 const data = await getdata(user?.id as string)



    return (
    <div className='grid items-start gap-8'>
       <div className='flex items-center justify-between px-2'>
        <div className='grid gap-1'>
            <h1 className='text-3xl md:text-4xl'>Settings
            </h1>
            <p className='text-lg text-muted-foreground'>Your profile settings</p>
        </div>
       </div>
       <Card>
        <form>
            <CardHeader>
                <CardTitle>Personal information</CardTitle>
                    <CardDescription>Tell us about yourself.</CardDescription>
                
            </CardHeader>
            <CardContent>
                <div className='space-y-2'>
                    <div className='space-y-1'>
                            <Label>Name</Label>
                            <Input name = "name " type = "text" id = "name" placeholder='Your name' defaultValue={data?.name ?? undefined}/> 
                    </div>

                    <div className='space-y-1'>
                            <Label>Email</Label>
                            <Input name = "email " type = "text" id = "email" placeholder='Your email'
                            disabled 
                            defaultValue={data?.email}/> 
                    </div>
                    <div className='space-y-1'>
                        <Label>add later </Label>
                        <Select name= "color " defaultValue='theme-blue'>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder = "select a color" />

                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>color</SelectLabel>
                                    <SelectItem value='theme-green'>green</SelectItem>
                                    <SelectItem value='theme-green'>bhardip</SelectItem>    

                                    <SelectItem value='theme-green'>green</SelectItem>
                                    <SelectItem value='theme-green'>green</SelectItem>
                                    <SelectItem value='theme-green'>green</SelectItem>
                                    <SelectItem value='theme-green'>green</SelectItem>

                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>
                </div>

            </CardContent>
            <CardFooter>
                <Submitbutton/>
            </CardFooter>
        </form>
       </Card>
    </div>
  )
}

export default Settings
