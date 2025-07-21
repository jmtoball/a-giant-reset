import { EntryFieldTypes } from 'contentful';

import { getPosts } from './client';

export type HikeLogSkeleton = {
  contentTypeId: 'hikeLog';
  fields: {
    date: EntryFieldTypes.Date;
    day: EntryFieldTypes.Number;
    title: EntryFieldTypes.Text;
    content: EntryFieldTypes.RichText;
    slug: EntryFieldTypes.Text;
    cover: EntryFieldTypes.AssetLink;
    gpx: EntryFieldTypes.AssetLink;
  };
};

export type HikeLog = Awaited<ReturnType<typeof getPosts>>['items'][number];
