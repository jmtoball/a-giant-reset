import ContentfulClient from '@/lib/contentful/client';
import Link from 'next/link';
import { HikeLogSkeleton } from '../lib/contentful/types';


export default async function Home() {
  const posts = (await ContentfulClient.getEntries<HikeLogSkeleton>({content_type: 'hikeLog'})).items;

  return (
    <main className="container">
      <div>
        {posts.map((post) => (
          <article key={post.fields.date} className="blog-post">
            <h2 className="blog-post-title">
              <Link href={`/${post.fields.slug}`}>
                {post.fields.title}
              </Link>
            </h2>
            <p className="blog-post-description">{post.fields.title}</p>
          </article>
        ))}
      </div>
    </main>
  );
}