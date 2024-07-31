'use client'
import { Button } from "@/components/ui/button";

import { createTheme, MantineProvider } from '@mantine/core'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/ui/HeroSection";
import { FaqSimple } from "@/components/ui/faq";
import CustomerInsight from "@/components/ui/afterherosection";
import { FooterLinks} from "@/components/ui/footers";
import { HeaderMegaMenu } from "@/components/ui/header";
import React from 'react';
import { FeaturesCards } from "@/components/ui/FeaturesGrid";
import { PricingPlans } from "@/components/ui/pricing";



const theme = createTheme({
  fontFamily: 'Poppins, sans-serif',
  primaryColor: 'cyan',
});





// eslint-disable-next-line @next/next/no-async-client-component
export default function Home() {
  // const {isAuthenticated} = getKindeServerSession()

  // if (await isAuthenticated()){
  //   return redirect("/dashboard")
  // }
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
    <div>
      <HeaderMegaMenu/>
        <HeroSection/>
        <CustomerInsight/>
        <FeaturesCards/>
        <PricingPlans/>
        <FaqSimple/>
        <FooterLinks/>
    </div>
  </MantineProvider>

  );
}
