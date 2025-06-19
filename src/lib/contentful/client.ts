import { createClient } from 'contentful';
import { config } from 'dotenv';

config();

const ContentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export default ContentfulClient;
