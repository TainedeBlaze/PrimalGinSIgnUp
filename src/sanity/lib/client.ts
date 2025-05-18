import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export async function fetchEmailSignupPage() {
  console.log('fetchEmailSignupPage called');
  const result = await client.fetch(
    `*[_type == "emailSignupPage"][0]{
      heading,
      subheading,
      gallery[]{
        asset->{url, metadata}
      }
    }`
  );
  console.log('fetchEmailSignupPage result:', result);
  return result;
}

