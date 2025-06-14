import ContentfulClient from '@/lib/contentful/client';
import Link from 'next/link';
import { HikeLogSkeleton } from '../lib/contentful/types';
import { capsFont } from './fonts';

export default async function Home() {
  const posts = (await ContentfulClient.withoutUnresolvableLinks.getEntries<HikeLogSkeleton>({content_type: 'hikeLog'})).items;

  return (
    <main className="grid">
      <div>
        {posts.map((post) => (
          <Link href={`/${post.fields.slug}`} key={post.fields.date}>
            <article className="log-card">
              {post.fields.cover && post.fields.cover.fields.file && (
                <img src={post.fields.cover.fields.file.url} alt={post.fields.title} className="cover-image" />
              )}
              <span className={"log-day "+ capsFont.className}>Day {post.fields.day}</span>
              <p className="log-title">{post.fields.title}</p>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}