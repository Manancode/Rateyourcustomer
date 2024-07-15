import prisma from '@/app/lib/db'
import React from 'react'
import { unstable_noStore as noStore} from 'next/cache'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'





async function getdata(userid:string){
  noStore()
  const data = await prisma.subscription.findUnique({
    where : {
      userid : userid , 
    } ,
    select : {
      status : true , 
      apikey : true , 
      user : {
        select : {
          stripeCustomerid : true , 
        }
      }
    }
  })
  return data 
}


async function Apikeypage() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  const data = await getdata(user?.id as string)


  if (data?.status === "active"){
    return ( 
      <div className='grid items-start gap-8 '>
    <div className='flex-items-center justify-between px-2'>
      <div className='grid gap-1'>
        <h1 className='text-3xl md:text-4xl'>Api Keys</h1>
        
      </div>
    </div>
    <Card className='w-full lg:w-5/3'>
    <CardHeader >
      <CardTitle>
       Api Keys
      </CardTitle>
      <CardDescription>
        Use your Apikey responsibly. <a href = "/path/to/docs" className="text-blue-500 underline">Get started </a>
      </CardDescription>
    </CardHeader>
    
    </Card> 


  <Card className='w-full lg:w-5/3'>
    <CardHeader >
      <CardTitle>
        Standard keys
      </CardTitle>
      <CardDescription>
      Create a key that unlocks full API access, enabling extensive interaction with your account. <a href = "/path/to/docs" className="text-blue-500 underline">Learn more</a>
      </CardDescription>
    </CardHeader>
    
    </Card> 
  </div>
    
     
    )
  }

  else {
    return(<div>not subscribed bro</div>)
  }

 

}

export default Apikeypage

