import Image from 'next/image';

import CoverCard from '../../components/CoverCard';
import MapView from '../../components/MapView';
import Title from '../../components/Title';
import RichText from '../../lib/contentful/RichText';
import { getPostBySlug, getPosts } from '../../lib/contentful/client';
import { toFullUrl } from '../../lib/util';
import commonStyles from '../common.module.css';
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
      <Title day={post.fields.day} title={post.fields.title} />
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
  const posts = await getPosts();
  return posts.items.map((entry) => ({ slug: entry.fields.slug }));
}
