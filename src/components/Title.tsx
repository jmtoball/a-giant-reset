import { getTranslations } from 'next-intl/server';

import commonStyles from '../app/common.module.css';
import { capsFont } from '../app/fonts';
import { Link } from '../i18n/navigation';
import { HikeLog } from '../lib/contentful/types';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Title.module.css';

type TitleProps = {
  day?: number;
  post?: HikeLog;
  locale: string;
};

export default async function Title({ day, post, locale }: TitleProps) {
  const t = await getTranslations();

  return (
    <h1 className={styles.title + ' ' + capsFont.className}>
      <div className={commonStyles.widthConstraint}>
        <div>
          <span>
            <Link href="/">{t('title')}</Link>
          </span>
          {day && <span className={styles.day}>{t('day', { day })}</span>}
          {post && <span className={styles.headline}>{post.fields.title}</span>}
        </div>
        <LanguageSwitcher activeLocale={locale} post={post} />
      </div>
    </h1>
  );
}
