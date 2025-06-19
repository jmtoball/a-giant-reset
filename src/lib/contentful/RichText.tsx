import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Block, Document, Inline } from '@contentful/rich-text-types';
import Image from 'next/image';

import { toFullUrl } from '../util';

export default function RichText({ content }: { content: Document }) {
  // FIXME: Remove polyfill once https://github.com/contentful/rich-text/issues/853 is fixed
  const renderAsset = (node: Block) => {
    const metadata = node.data.target.fields;
    if (!metadata) return;
    const imageUrl = toFullUrl(metadata.file.url);
    const imgDescription = metadata.description ?? '';

    return (
      <Image
        src={imageUrl}
        alt={escape(imgDescription)}
        width={metadata.file.details.media.width}
        height={metadata.file.details.media.height}
        loading="lazy"
      />
    );
  };

  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) =>
        renderAsset(node as Block),
    },
  };
  return documentToReactComponents(content, renderOptions);
}
