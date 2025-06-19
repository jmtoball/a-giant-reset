import { createClient } from 'contentful';
import { config } from 'dotenv';

import { HikeLogSkeleton } from './types';

config();

const ContentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export default ContentfulClient;
export async function getPostBySlug(slug: string) {
  const posts =
    await ContentfulClient.withoutUnresolvableLinks.getEntries<HikeLogSkeleton>(
      {
        content_type: 'hikeLog',
        'fields.slug': slug,
      },
    );

  const post = posts.items[0];
  return post;
}
export async function getPosts() {
  return await ContentfulClient.withoutUnresolvableLinks.getEntries<HikeLogSkeleton>(
    {
      content_type: 'hikeLog',
      order: ['fields.date'],
    },
  );
}
