import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';

import CoverCard from '../../../components/CoverCard';
import MapView from '../../../components/MapView';
import Title from '../../../components/Title';
import { routing } from '../../../i18n/routing';
import RichText from '../../../lib/contentful/RichText';
import { getPostBySlug, getPosts } from '../../../lib/contentful/client';
import { toFullUrl } from '../../../lib/util';
import commonStyles from '../../common.module.css';
import styles from './page.module.css';

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export default async function Detail({ params }: Props) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  const t = await getTranslations({ locale });
  setRequestLocale(locale);

  if (!post) {
    return <div>{t('notFound')}</div>;
  }

  return (
    <article>
      <Title locale={locale} day={post.fields.day} post={post} />
      <div className={commonStyles.widthConstraint + ' ' + styles.columns}>
        <div className={styles.media}>
          <CoverCard post={post} inline />
          <MapView gpxUrl={post.fields.gpx?.fields.file?.url} />
          {post.fields.media?.map(
            (media) =>
              media?.fields.file?.url && (
                <Image
                  src={toFullUrl(media?.fields.file?.url)}
                  alt={media?.fields.description || ''}
                  className={styles.mediaImage}
                  key={media?.sys.id}
                  width={media?.fields.file?.details.image?.width ?? 0}
                  height={media?.fields.file?.details.image?.height ?? 0}
                  loading="lazy"
                />
              ),
          )}
        </div>
        {post.fields.content && (
          <div className={styles.content}>
            <RichText content={post.fields.content} />
          </div>
        )}
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const posts = (
    await Promise.all(routing.locales.map((locale) => getPosts(locale)))
  ).flatMap((result) => result.items);
  return posts.map((post) => ({
    locale: post.sys?.locale,
    slug: post.fields.slug,
  }));
}
