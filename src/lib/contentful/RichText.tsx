'use client';

import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Block, Document, Inline } from '@contentful/rich-text-types';
import { track } from '@vercel/analytics';
import Image from 'next/image';
import React, { useEffect } from 'react';

import { LightboxSlide } from '../useLightbox';
import { toFullUrl } from '../util';

type Props = {
  content: Document;
  slides: LightboxSlide[];
  setSlides: React.Dispatch<React.SetStateAction<LightboxSlide[]>>;
  openSlide: React.Dispatch<React.SetStateAction<number | null>>;
};

export default function RichText({
  content,
  slides,
  setSlides,
  openSlide,
}: Props) {
  const renderAsset = (node: Block) => {
    const metadata = node.data.target.fields;
    if (!metadata) return;
    const url = toFullUrl(metadata.file.url);
    const label = metadata.title;

    if (metadata.file.contentType.startsWith('image/')) {
      if (!slides.some((slide) => slide.src === url)) {
        slides.push({
          src: url,
          alt: label,
          width: metadata.file.details.image.width,
          height: metadata.file.details.image.height,
        });
      }
      const assetIdx = slides.findIndex((slide) => slide.src === url);
      return (
        <figure key={url}>
          <Image
            src={url}
            alt={label}
            width={metadata.file.details.image.width}
            height={metadata.file.details.image.height}
            loading="lazy"
            sizes="75vw, 100vw"
            quality={90}
            onClick={() => {
              openSlide(assetIdx);
              track('open_image', { image: label });
            }}
          />
          {label && <figcaption>{label}</figcaption>}
        </figure>
      );
    }

    if (metadata.file.contentType.startsWith('video/')) {
      if (!slides.some((slide) => slide.src === url)) {
        slides.push({
          type: 'video',
          src: url,
          sources: [{ src: url, type: metadata.file.contentType }],
          description: label,
        });
      }
      const assetIdx = slides.findIndex((slide) => slide.src === url);
      return (
        <figure key={url}>
          <video
            controls
            preload=""
            onClick={() => {
              openSlide(assetIdx);
              track('open_video', { video: label });
            }}
          >
            <source src={url} type={metadata.file.contentType} />
            Your browser does not support the video tag.
          </video>

          {label && <figcaption>{label}</figcaption>}
        </figure>
      );
    }
  };

  // Custom renderNode to collect assets for lightbox
  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) =>
        renderAsset(node as Block),
    },
  };

  const rendered = documentToReactComponents(content, renderOptions);
  useEffect(() => {
    setSlides(slides);
  }, [slides, setSlides]);

  return rendered;
}
