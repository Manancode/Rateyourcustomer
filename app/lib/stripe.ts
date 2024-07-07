import Stripe from "stripe"
export const stripe =  new Stripe(process.env.STRIPE_SECRET_KEY as string , {
    apiVersion : "2024-06-20" ,
    typescript : true

})

export const getstripesession = async ({priceid , domainurl , customerid} : {
    priceid : string , domainurl : string , customerid : string 
})=> {
    const session = await stripe.checkout.sessions.create({
        customer :customerid , 
        mode:"subscription" ,
        billing_address_collection : "auto",
        line_items :[{price:priceid,quantity:1}],
        payment_method_types:['card' ,"amazon_pay" ,'paypal' , "us_bank_account" ,'alipay'],
        customer_update :{
            address:"auto",
            name:"auto"
        } ,
        success_url: `${domainurl}/payment/success`,
        cancel_url:`${domainurl}/payment/cancelled` ,
    })

    return session.url as string
}