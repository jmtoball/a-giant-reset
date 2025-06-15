import ContentfulClient from '@/lib/contentful/client';
import Link from 'next/link';
import { HikeLogSkeleton } from '../lib/contentful/types';
import styles from './page.module.css';
import commonStyles from './common.module.css';
import { capsFont } from './fonts';
import { unstable_ViewTransition as ViewTransition } from 'react';
import CoverCard from '../components/CoverCard';

export default async function Home() {
  const posts = (await ContentfulClient.withoutUnresolvableLinks.getEntries<HikeLogSkeleton>({
    content_type: 'hikeLog',
    order: ['fields.date'],
  })).items;

  return (
    <main className={styles.grid}>
      <h1 className={commonStyles.title + " " + capsFont.className}>
        <div className={commonStyles.widthConstraint}>
          <Link href="/">Giant Reset</Link>
        </div>
      </h1>
      <div className={commonStyles.widthConstraint}>
        {posts.map((post) => (
          <Link href={`/${post.fields.slug}`} key={post.fields.date} className={styles.gridItem}>
            <CoverCard post={post} />
          </Link>
        ))}
      </div>
    </main>
  );
}