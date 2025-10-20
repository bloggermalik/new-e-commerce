"use server"

import { auth } from "@/lib/auth";
import { getCurrentUser } from "./user";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { organization } from "@/db/schema";
import { headers } from "next/headers";


export async function getOrganizations() {

   const currentUser = await getCurrentUser();
   if (!currentUser) redirect("/login");

   const myOrganization = await auth.api.listOrganizations({
      headers: await headers(),
   });

   return myOrganization;

}

export async function getOrganizationBySlug(slug: string) {

   try {
      
         const myOrganization = await db.query.organization.findFirst({
              where: eq(organization.slug, slug),
      
         });
      
         return myOrganization;
   } catch (error) {
      return null;
   }
 


}