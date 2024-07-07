import { ReactNode } from "react";
import Dashboardnav from "../components/dashboardnav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../lib/db";
import { stripe } from "../lib/stripe";


async function getdata({email , id , firstname , lastname , profileimage}:{email : string , id : string , firstname : string | undefined | null ,lastname : string | undefined | null , profileimage : string | undefined | null }){
const user = await prisma.user.findUnique({
    where : { 
        id : id ,
    } , 
    select : {
        id : true , 
        stripeCustomerid : true , 
    } ,
})

if (!user){
    const name = `${firstname??''} ${lastname??''}`
    await prisma.user.create({
        data:{ 
            id : id , 
            email: email ,
            name : name ,

        } ,
    })
}

if(!user?.stripeCustomerid){
    const data = await stripe.customers.create({
        email:email , 
    })

    await prisma.user.update({
        where : {
            id : id ,
        } ,
        data : {
            stripeCustomerid : data.id
        }
    })
}


}

export default async function dashboardlayout({children} : {children: ReactNode}){
const {getUser} = getKindeServerSession()
const user = await getUser()
if(!user){
    return redirect("/")
}
await getdata({email : user.email as string , firstname : user.given_name as string , id:user.id , lastname:user.family_name , profileimage: user.picture})
return(
    <div className="flex flex-col space-y-6 mt-10">
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
            <Dashboardnav/>
        </aside>
        <main>{children}</main>
    </div>
   </div>
)

}