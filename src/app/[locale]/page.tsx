import { setRequestLocale } from 'next-intl/server';

import CoverCard from '../../components/CoverCard';
import Title from '../../components/Title';
import { Link } from '../../i18n/navigation';
import { getPosts } from '../../lib/contentful/client';
import commonStyles from '../common.module.css';
import styles from './page.module.css';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const posts = (await getPosts(locale)).items;

  setRequestLocale(locale);

  return (
    <main className={styles.grid}>
      <Title locale={locale} />
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
