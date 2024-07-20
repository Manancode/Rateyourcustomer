import { ReactNode } from "react";
import Dashboardnav from "../components/dashboardnav";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "../lib/db";
import { stripe } from "../lib/stripe";
import { unstable_noStore as noStore } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

async function getdata({ email, id, firstname, lastname, profileimage }: { email: string, id: string, firstname: string | undefined | null, lastname: string | undefined | null, profileimage: string | undefined | null }) {
  noStore();

  let user = await prisma.user.findUnique({
    where: { id: id },
    select: { id: true, stripeCustomerid: true, companyId: true },
  });

  if (!user) {
    const existingUser = await prisma.user.findUnique({ where: { email: email } });

    if (!existingUser) {
      const name = `${firstname ?? ''} ${lastname ?? ''}`;
      const companyId = uuidv4(); // Generating a random ID for the company

      user = await prisma.user.create({
        data: {
          id: id,
          email: email,
          name: name,
          company: {
            create: {
              id: companyId,
              name: "have to company name here" 
            }
          }
        },
      });
    } else {
      user = existingUser;
    }
  }

  if (!user?.stripeCustomerid) {
    const stripeCustomer = await stripe.customers.create({ email: email });

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerid: stripeCustomer.id },
    });

    user.stripeCustomerid = stripeCustomer.id;
  }
}

export default async function dashboardlayout({ children }: { children: ReactNode }) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }
  await getdata({ email: user.email as string, firstname: user.given_name as string, id: user.id, lastname: user.family_name, profileimage: user.picture });
  return (
    <div className="flex flex-col space-y-6 mt-10">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <Dashboardnav />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
