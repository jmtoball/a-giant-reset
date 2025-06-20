import { Link } from '../i18n/navigation';
import { routing } from '../i18n/routing';
import { getPost } from '../lib/contentful/client';
import { HikeLog } from '../lib/contentful/types';
import styles from './LanguageSwitcher.module.css';

export default async function LanguageSwitcher({
  activeLocale,
  post,
}: {
  activeLocale: string;
  post?: HikeLog;
}) {
  const slug = post?.sys.id && (await getPost(post?.sys.id)).fields.slug;

  return (
    <div className={styles.switcher}>
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={`/${slug ? slug[locale] : ''}`}
          locale={locale}
          className={locale === activeLocale ? styles.active : ''}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
