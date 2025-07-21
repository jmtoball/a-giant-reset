import { ResolvingMetadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import Title from '../../../components/Title';
import { routing } from '../../../i18n/routing';
import { getPostBySlug, getPosts } from '../../../lib/contentful/client';
import { processGPX } from '../../../lib/gpx';
import ClientDetail from './page.client';

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);

  return {
    description: (await parent).description,
    title: `${post.fields.title} | ${(await parent).title?.absolute}`,
  };
}

export default async function Detail({ params }: Props) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  const posts = (await getPosts(locale)).items;
  const t = await getTranslations({ locale });
  setRequestLocale(locale);

  if (!post) {
    return <div>{t('notFound')}</div>;
  }

  const { positions, kpis } = post.fields.gpx?.fields.file?.url
    ? await processGPX(post.fields.gpx?.fields.file?.url)
    : {};

  return (
    <article>
      <Title locale={locale} day={post.fields.day} post={post} />
      <ClientDetail
        post={post}
        posts={posts}
        locale={locale}
        positions={positions}
        kpis={kpis}
      />
    </article>
  );
}

export async function generateStaticParams() {
  const posts = (
    await Promise.all(routing.locales.map((locale) => getPosts(locale)))
  ).flatMap((result) => result.items);
  return posts.map((post) => ({
    locale: post.sys?.locale,
    slug: post.fields.slug,
  }));
}
