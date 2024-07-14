import prisma from '@/app/lib/db'
import React from 'react'
import { unstable_noStore as noStore} from 'next/cache'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'





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
      {data.apikey}
    </div>
    
     
    )
  }

  else {
    return(<div>not subscribed bro</div>)
  }

 

}

export default Apikeypage

