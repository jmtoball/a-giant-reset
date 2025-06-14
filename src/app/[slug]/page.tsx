import { HikeLogSkeleton } from '../../lib/contentful/types';
import ContentfulClient from '@/lib/contentful/client';
import { Block, BLOCKS, Inline } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

type Params = {
  slug: string
}

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

export default async function Detail({params: { slug }}: Props) {
  const post = (await ContentfulClient.getEntries<HikeLogSkeleton>({
    "content_type": "hikeLog",
    "fields.slug": slug
  })).items[0];
  const contentComponents = post.fields.content && documentToReactComponents(post.fields.content, renderOptions)
  return (
    <main className="container">
      <div>
        <article className="blog-post">
          <h2 className="blog-post-title">
            {post.fields.title}
          </h2>
          { contentComponents }
        </article>
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await ContentfulClient.getEntries<HikeLogSkeleton>();
  return posts.items.map(entry => ({ slug: entry.fields.slug }));
}