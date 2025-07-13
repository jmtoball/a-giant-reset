import Image from 'next/image';
import { useState } from 'react';
import Lightbox, {
  ContainerRect,
  Slide,
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
} from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

import { toFullUrl } from './util';

export type LightboxImageSlide = {
  src: string;
  width: number;
  height: number;
  alt?: string;
};

export type LightboxVideoSlide = {
  type: 'video';
  src: string;
  sources: { src: string; type: string }[];
  description?: string;
};

export type LightboxSlide = LightboxImageSlide | LightboxVideoSlide;

function isNextJsImage(slide: Slide): slide is LightboxImageSlide {
  return (
    isImageSlide(slide) &&
    typeof slide.width === 'number' &&
    typeof slide.height === 'number'
  );
}

export default function NextJsImage({
  slide,
  offset,
  rect,
}: {
  slide: Slide;
  offset: number;
  rect: ContainerRect;
}) {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps();

  const { currentIndex } = useLightboxState();

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  if (!isNextJsImage(slide)) return undefined;

  const width = !cover
    ? Math.round(
        Math.min(rect.width, (rect.height / slide.height) * slide.width),
      )
    : rect.width;

  const height = !cover
    ? Math.round(
        Math.min(rect.height, (rect.width / slide.width) * slide.height),
      )
    : rect.height;

  return (
    <div style={{ position: 'relative', width, height }}>
      <Image
        fill
        alt={slide.alt ?? ''}
        src={toFullUrl(slide.src)}
        loading="eager"
        draggable={false}
        style={{
          objectFit: cover ? 'cover' : 'contain',
          cursor: click ? 'pointer' : undefined,
        }}
        sizes="200vw"
        quality={90}
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
  );
}

export function useLightbox(intialSlides: LightboxSlide[] = []) {
  const [open, openSlide] = useState<number | null>(null);
  const [slides, setSlides] = useState<LightboxSlide[]>(intialSlides);

  const close = () => openSlide(null);

  const renderLightbox = () => {
    return (
      <Lightbox
        open={open !== null}
        close={close}
        slides={slides}
        plugins={[Zoom, Video]}
        index={open ?? 0}
        render={{ slide: NextJsImage }}
      />
    );
  };

  return {
    open,
    slides,
    setSlides,
    openSlide,
    close,
    renderLightbox,
  };
}
