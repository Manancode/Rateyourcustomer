import prisma from '@/app/lib/db'
import { getstripesession } from '@/app/lib/stripe'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { CheckCircle2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

const featureitems = [
  {name : "soon to be added 1 "},
  {name : "soon to be added 1 "},
  {name : "soon to be added 1 "},
  {name : "soon to be added 1 "}
]

async function getdata(userid: string) {
  try {
    const data = await prisma.subscription.findUnique({
      where: {
        userid,
      },
      select: {
        status: true,
        user: {
          select: {
            stripeCustomerid: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}


async function Billingspage() {
  const {getUser} = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    console.error("User is null or undefined")
    return <div>User not found</div>
  }

  const data = await getdata(user.id as string)

  if (!data ||!data.user ||!data.user.stripeCustomerid) {
    console.error("Data is null or undefined")
    return <div>Data not found</div>
  }

  async function createsubscription(){
    if (!data?.user.stripeCustomerid){
      throw new Error("unable to get customer id ")
    }

    const subscriptionurl = await getstripesession({
      customerid : data.user.stripeCustomerid,
      domainurl : "http://localhost:3001",
      priceid : process.env.STRIPE_PRICE_ID as string,
    })

    return redirect(subscriptionurl)
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
          <form className='w-full'>
            <Button onClick={createsubscription}>Buy today</Button>
          </form>
        </div>
      </Card>
      
    </div>
  )
}

export default Billingspage