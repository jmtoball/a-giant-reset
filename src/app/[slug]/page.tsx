import Image from 'next/image';
import Link from 'next/link';

import CoverCard from '../../components/CoverCard';
import MapView from '../../components/MapView';
import RichText from '../../lib/contentful/RichText';
import ContentfulClient, { getPostBySlug } from '../../lib/contentful/client';
import { HikeLogSkeleton } from '../../lib/contentful/types';
import { toFullUrl } from '../../lib/util';
import commonStyles from '../common.module.css';
import { capsFont } from '../fonts';
import styles from './page.module.css';

type Params = Promise<{
  slug: string;
}>;

type Props = {
  params: Params;
};

export default async function Detail({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return <div>Not found</div>;
  }

  return (
    <article>
      <h1 className={commonStyles.title + ' ' + capsFont.className}>
        <div className={commonStyles.widthConstraint}>
          <Link href="/">Giant Reset</Link>&nbsp;&nbsp;
          <span className={styles.day}>Day {post.fields.day}</span>&nbsp;&nbsp;
          <span className={styles.title}>{post.fields.title}</span>
        </div>
      </h1>
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
        <div className={styles.content}>
          {post.fields.content && <RichText content={post.fields.content} />}
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await ContentfulClient.getEntries<HikeLogSkeleton>();
  return posts.items.map((entry) => ({ slug: entry.fields.slug }));
}
