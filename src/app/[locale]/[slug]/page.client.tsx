'use client';

import Image from 'next/image';
import Link from 'next/link';

import MapView from '../../../components/MapView';
import RichText from '../../../lib/contentful/RichText';
import { HikeLog } from '../../../lib/contentful/types';
import { KPIs, Positions } from '../../../lib/gpx';
import { LightboxImageSlide, useLightbox } from '../../../lib/useLightbox';
import { toFullUrl } from '../../../lib/util';
import commonStyles from '../../common.module.css';
import styles from './page.module.css';

interface DetailClientProps {
  post: HikeLog;
  posts: HikeLog[];
  locale: string;
  positions?: Positions;
  kpis?: KPIs;
}

function renderPostNavigation(post: HikeLog, posts: HikeLog[]) {
  const currentIndex = posts.findIndex((p) => post.sys?.id === p.sys?.id);
  const prevPost = posts[currentIndex - 1];
  const nextPost = posts[currentIndex + 1];

  return (
    <div className={styles.postNavigation}>
      {prevPost ? (
        <Link href={`${prevPost.fields.slug}`}>← {prevPost.fields.title}</Link>
      ) : (
        <span />
      )}
      {nextPost ? (
        <Link href={`${nextPost.fields.slug}`}>{nextPost.fields.title} →</Link>
      ) : (
        <span />
      )}
    </div>
  );
}

export default function DetailClient({
  kpis,
  post,
  posts,
  positions,
}: DetailClientProps) {
  const coverUrl = post.fields.cover?.fields.file?.url
    ? post.fields.cover.fields.file.url
    : '';
  const coverSlide: LightboxImageSlide = {
    width: post.fields.cover?.fields.file?.details.image?.width ?? 0,
    height: post.fields.cover?.fields.file?.details.image?.height ?? 0,
    src: coverUrl,
    alt: post.fields.title,
  };
  const { openSlide, slides, setSlides, renderLightbox } = useLightbox([
    coverSlide,
  ]);

  return (
    <div className={commonStyles.widthConstraint}>
      <div className={styles.media}>
        <div>
          <Image
            src={toFullUrl(coverUrl)}
            alt={post.fields.title}
            width={post.fields.cover?.fields.file?.details.image?.width ?? 0}
            height={post.fields.cover?.fields.file?.details.image?.height ?? 0}
            sizes="50vw, 100vw"
            quality={90}
            loading="lazy"
            className={styles.coverImage}
            onClick={() => openSlide(0)}
          />
        </div>
        {positions && kpis && <MapView positions={positions} kpis={kpis} />}
      </div>
      {post.fields.content && (
        <div className={styles.content}>
          <RichText
            content={post.fields.content}
            slides={slides}
            setSlides={setSlides}
            openSlide={openSlide}
          />
        </div>
      )}
      {renderPostNavigation(post, posts)}
      {renderLightbox()}
    </div>
  );
}
