import Link from 'next/link';

import commonStyles from '../app/common.module.css';
import { capsFont } from '../app/fonts';
import styles from './Title.module.css';

type TitleProps = {
  day?: number;
  title?: string;
};

export default function Title({ day, title }: TitleProps) {
  return (
    <h1 className={styles.title + ' ' + capsFont.className}>
      <div className={commonStyles.widthConstraint}>
        <Link href="/">Giant Reset</Link>
        {day && <span className={styles.day}>Day {day}</span>}
        {title && <span className={styles.headline}>{title}</span>}
      </div>
    </h1>
  );
}
