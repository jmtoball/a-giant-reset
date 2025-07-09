import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { unstable_ViewTransition as ViewTransition } from 'react';
import React from 'react';

import { capsFont } from '../app/fonts';
import { HikeLog } from '../lib/contentful/types';
import { toFullUrl } from '../lib/util';
import styles from './CoverCard.module.css';
import WithZoom from './WithZoom';

async function Day({ day }: { day: number }) {
  const t = await getTranslations();
  return (
    <ViewTransition name={`day-${day}`}>
      <span className={[styles.day, capsFont.className].join(' ')}>
        {t('day', { day })}
      </span>
    </ViewTransition>
  );
}

export default function CoverCard({
  post,
  inline,
}: {
  post: HikeLog;
  inline?: boolean;
}) {
  const MaybeWithZoom = inline ? WithZoom : React.Fragment;
  return (
    <div className={[styles.card, inline ? styles.inline : ''].join(' ')}>
      {post.fields.cover && post.fields.cover.fields.file && (
        <ViewTransition name={`cover-${post.fields.day}`}>
          <MaybeWithZoom>
            <Image
              src={toFullUrl(post.fields.cover.fields.file.url)}
              alt={post.fields.title}
              width={post.fields.cover.fields.file.details.image?.width ?? 0}
              height={post.fields.cover.fields.file.details.image?.height ?? 0}
              loading="lazy"
              className={styles.coverImage}
            />
          </MaybeWithZoom>
        </ViewTransition>
      )}
      {post.fields.day != null && <Day day={post.fields.day} />}
      <span className={[styles.title, capsFont.className].join(' ')}>
        {post.fields.title}
      </span>
    </div>
  );
}
