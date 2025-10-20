import { getOrganizationBySlug } from '@/server/organization';
import React from 'react'

type Params = Promise<{ slug: string }>
async function OrganisationPage({params}: {params: Params}) {
  const { slug } = await params;
  console.log("Slug param", slug);

  const organization = await getOrganizationBySlug(slug);
  return (
    <div>
      <h1>Organisation Name: {organization?.name}</h1>
        <p>Organisation Slug: {organization?.slug}</p>
    </div>
  )
}

export default OrganisationPage