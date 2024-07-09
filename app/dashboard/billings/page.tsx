import { Stripeportal } from '@/app/components/submitbuttons'
import prisma from '@/app/lib/db'
import { getstripesession, stripe } from '@/app/lib/stripe'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { CheckCircle2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import { unstable_noStore as noStore} from 'next/cache'




const featureitems = [
  {name : "soon to be added 1 "},
  {name : "soon to be added 1 "},
  {name : "soon to be added 1 "},
  {name : "soon to be added 1 "}
]

async function getdata(userid:string){
  noStore()
  const data = await prisma.subscription.findUnique({
    where : {
      userid : userid , 
    } ,
    select : {
      status : true , 
      user : {
        select : {
          stripeCustomerid : true , 
        }
      }
    }
  })
  return data 
}


async function Billingspage() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  const data = await getdata(user?.id as string)

async function createsubscription(){
  "use server"
  const dbuser = await prisma.user.findUnique({
    where : {
      id : user?.id 
    } ,
    select : {
      stripeCustomerid : true ,
    }
  })



  if (!dbuser?.stripeCustomerid){
    throw new Error("unable to get customer id ")
  }

const subscriptionurl = await getstripesession({
  customerid : dbuser.stripeCustomerid,
  domainurl : "http://localhost:3000",
  priceid : process.env.STRIPE_PRICE_ID as string,

  
})

return redirect(subscriptionurl)

}

async function createcustomerportal() {
  "use server"
  const session = await stripe.billingPortal.sessions.create({
    customer : data?.user.stripeCustomerid as string ,
    return_url : "http://localhost:3000/dashboard"
  })

  return redirect(session.url)
}


if (data?.status === "active"){
  return ( 
   <div className='grid items-start gap-8 '>
    <div className='flex-items-center justify-between px-2'>
      <div className='grid gap-1'>
        <h1 className='text-3xl md:text-4xl'>Subscription</h1>
        <p className='text-lg text-muted-foreground'>settings regarding your subscription</p>
      </div>
    </div>
    <Card className='w-full lg:w-2/3'>
    <CardHeader >
      <CardTitle>
        Edit subscription
      </CardTitle>
      <CardDescription>
        will write it soon
      </CardDescription>
    </CardHeader>
    <CardContent>
      
        <form action={createcustomerportal}>
          
       <Stripeportal/>
        </form>
    </CardContent>
    </Card> 
  </div>
  
   
  )
}

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <Card className='flex flex-col'>
        <CardContent className='py-8'>
          <div>
            <h3 className='inline-flex px-4 py-1 rounded-full text-sm font-semibold 
            tracking-wide uppercase bg-primary/10 text-primary'>Monthly</h3>
          </div>
          <div className='mt-4 flex items-baseline text-6xl font-extrabold'>
            $29 <span className='ml-1 text-2xl text-muted-foreground'>/mo</span>
            
          </div>

          <p className='mt-5 text-lg text-muted-foreground'> will write here</p>
        </CardContent>
        <div className='flex-1 flex flex-col justify-between px-6 pt-6 pb-8 
        bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6'>
          <ul className='space-y-4'>
            {featureitems.map((item,index)=>(
              <li key={index} className='flex items-center'>
                <div className='flex-shrink-0'>
                  <CheckCircle2 className='h-6 w-6 text-green-500'/>
                </div>
                <p className='ml-3 text-base'>{item.name}</p>
              </li>
            ))}
          </ul>
          <form className='w-full' action={createsubscription}>
            <Button>Buy today</Button>
          </form>
        </div>
      </Card>
      
    </div>
  )
}

export default Billingspage
