import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Block, Document, Inline } from '@contentful/rich-text-types';
import Image from 'next/image';

import WithZoom from '../../components/WithZoom';
import { toFullUrl } from '../util';

type Props = {
  content: Document;
};

export default function RichText({ content }: Props) {
  // FIXME: Remove polyfill once https://github.com/contentful/rich-text/issues/853 is fixed
  const renderAsset = (node: Block) => {
    const metadata = node.data.target.fields;
    if (!metadata) return;
    const url = toFullUrl(metadata.file.url);
    const label = metadata.title;

    if (metadata.file.contentType.startsWith('image/')) {
      return (
        <figure>
          <WithZoom>
            <Image
              src={url}
              alt={label}
              width={metadata.file.details.image.width}
              height={metadata.file.details.image.height}
              loading="lazy"
            />
          </WithZoom>
          {label && <figcaption>{label}</figcaption>}
        </figure>
      );
    }

    if (metadata.file.contentType.startsWith('video/')) {
      return (
        <figure>
          <WithZoom>
            <video controls preload="">
              <source src={url} type={metadata.file.contentType} />
              Your browser does not support the video tag.
            </video>
          </WithZoom>
          {label && <figcaption>{label}</figcaption>}
        </figure>
      );
    }
  };

  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) =>
        renderAsset(node as Block),
    },
  };
  return documentToReactComponents(content, renderOptions);
}
