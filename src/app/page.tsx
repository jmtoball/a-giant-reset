import Link from 'next/link';

import CoverCard from '../components/CoverCard';
import ContentfulClient from '../lib/contentful/client';
import { HikeLogSkeleton } from '../lib/contentful/types';
import commonStyles from './common.module.css';
import { capsFont } from './fonts';
import styles from './page.module.css';

export default async function Home() {
  const posts = (
    await ContentfulClient.withoutUnresolvableLinks.getEntries<HikeLogSkeleton>(
      {
        content_type: 'hikeLog',
        order: ['fields.date'],
      },
    )
  ).items;

  return (
    <main className={styles.grid}>
      <h1 className={commonStyles.title + ' ' + capsFont.className}>
        <div className={commonStyles.widthConstraint}>
          <Link href="/">Giant Reset</Link>
        </div>
      </h1>
      <div className={commonStyles.widthConstraint}>
        {posts.map((post) => (
          <Link
            href={`/${post.fields.slug}`}
            key={post.fields.date}
            className={styles.gridItem}
          >
            <CoverCard post={post} />
          </Link>
        ))}
      </div>
    </main>
  );
}
