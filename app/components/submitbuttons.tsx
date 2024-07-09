

"use client"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useFormStatus } from 'react-dom'

export function Submitbutton() {
    const {pending} = useFormStatus()  
                                                                                              
  return (

      <>
      {pending ? (
        <Button disabled className='w-full'>
            <Loader2 className='mr-2 w-4 h-4 animate-spin'/> Please wait 
            </Button> 
            ) : (
            <Button type='submit' className='w-fit'>create subscription</Button>
        )}
        </>

  )
}


export function Stripeportal(){
    const {pending} = useFormStatus()
   
    return(
        <>
        {pending ? ( <Button disabled className='w-fit'>
            <Loader2 className='mr-2 w-4 h-4 animate-spin'/> Please wait 
            </Button> ):(
                <Button className='w-fit' type='submit'>
                    view payment details
                    </Button>
            )}
            </>
          
        
        
    )
}

