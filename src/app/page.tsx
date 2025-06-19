import Link from 'next/link';

import CoverCard from '../components/CoverCard';
import Title from '../components/Title';
import { getPosts } from '../lib/contentful/client';
import commonStyles from './common.module.css';
import styles from './page.module.css';

export default async function Home() {
  const posts = (await getPosts()).items;

  return (
    <main className={styles.grid}>
      <Title />
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
