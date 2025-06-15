import { unstable_ViewTransition as ViewTransition } from 'react';

import { capsFont } from '../app/fonts';
import { HikeLog } from '@/lib/contentful/types';

const styles = require('./CoverCard.module.css');

function Day({ day }: { day: number }) {
  return <ViewTransition name={`day-${day}`}>
    <span className={styles.day + " " + capsFont.className}>Day {day}</span>
  </ViewTransition>;
}

export default function CoverCard({ post, inline }: {post: HikeLog, inline?: boolean}) {
  return <div className={[styles.card, inline ? styles.inline : ''].join(' ')}>
    {post.fields.cover && post.fields.cover.fields.file && (
      <ViewTransition name={`cover-${post.fields.day}`}>
        <img src={post.fields.cover.fields.file.url} alt={post.fields.title} className={styles.coverImage} />
      </ViewTransition>
    )}
    {true && post.fields.day && <Day day={post.fields.day} />}
    <span className={styles.title}>{post.fields.title}</span>
  </div>;
}