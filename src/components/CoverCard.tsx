import Image from 'next/image';
import { unstable_ViewTransition as ViewTransition } from 'react';

import { capsFont } from '../app/fonts';
import { HikeLog } from '../lib/contentful/types';
import { toFullUrl } from '../lib/util';
import styles from './CoverCard.module.css';

function Day({ day }: { day: number }) {
  return (
    <ViewTransition name={`day-${day}`}>
      <span className={styles.day + ' ' + capsFont.className}>Day {day}</span>
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
  return (
    <div className={[styles.card, inline ? styles.inline : ''].join(' ')}>
      {post.fields.cover && post.fields.cover.fields.file && (
        <ViewTransition name={`cover-${post.fields.day}`}>
          <Image
            src={toFullUrl(post.fields.cover.fields.file.url)}
            alt={post.fields.title}
            width={post.fields.cover.fields.file.details.image?.width ?? 0}
            height={post.fields.cover.fields.file.details.image?.height ?? 0}
            loading="lazy"
            className={styles.coverImage}
          />
        </ViewTransition>
      )}
      {true && post.fields.day && <Day day={post.fields.day} />}
      <span className={styles.title}>{post.fields.title}</span>
    </div>
  );
}
