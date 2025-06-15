import { HikeLogSkeleton } from '../../lib/contentful/types';
import ContentfulClient from '@/lib/contentful/client';
import { Block, BLOCKS, Inline } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import styles from './page.module.css';
import commonStyles from '../common.module.css';
import { capsFont } from '../fonts';
import Link from 'next/link';
import CoverCard from '../../components/CoverCard';
import MapView from '../../components/MapView';

type Params = Promise<{
  slug: string
}>

type Props = {
  params: Params
}

// FIXME: Remove polyfill once https://github.com/contentful/rich-text/issues/853 is fixed
const renderAsset = (node: Block) => {
  const fileUrl = node.data?.target?.fields?.file?.url ?? '';
  const imageUrl = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl;
  const imgDescription = node.data?.target?.fields?.description ?? '';

  return <img src={imageUrl} alt={escape(imgDescription)} loading="lazy"></img>;
};
const renderOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => renderAsset(node as Block),
  }
};

export default async function Detail({params}: Props) {
  const { slug } = await params;
  const posts = await ContentfulClient.withoutUnresolvableLinks.getEntries<HikeLogSkeleton>({
    content_type: 'hikeLog',
    'fields.slug': slug
  });

  if (!posts.items.length) {
    return <div>Not found</div>;
  }

  const post = posts.items[0];

  return (
    <article>
      <h1 className={commonStyles.title + " " + capsFont.className}>
        <div className={commonStyles.widthConstraint}>
          <Link href="/">Giant Reset</Link>&nbsp;&nbsp;
          <span className={styles.day}>Day {post.fields.day}</span>&nbsp;&nbsp;
          <span className={styles.title}>{post.fields.title}</span>
        </div>
      </h1>
      <div className={commonStyles.widthConstraint + " " + styles.columns}>
        <div className={styles.media}>
          <CoverCard post={post} inline />
          <MapView gpxUrl={post.fields.gpx?.fields.file?.url} />
          { post.fields.media?.map((media, index) => (
              <img src={media?.fields.file?.url} alt={media?.fields.description} className={styles.mediaImage} key={media?.sys.id} />
          ))}
        </div>
        <div className={styles.content}>
          {post.fields.content && documentToReactComponents(post.fields.content, renderOptions)}
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await ContentfulClient.getEntries<HikeLogSkeleton>();
  return posts.items.map(entry => ({ slug: entry.fields.slug }));
}