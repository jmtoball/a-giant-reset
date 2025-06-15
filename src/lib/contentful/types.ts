import { Asset, ChainModifiers, Entry, EntryFieldTypes } from "contentful";

import ContentfulClient from './client';

export type HikeLogSkeleton =
{
  contentTypeId: "hikeLog",
  fields: {
    date: EntryFieldTypes.Date;
    day?: EntryFieldTypes.Number;
    distance?: EntryFieldTypes.Number;
    ascent?: EntryFieldTypes.Number;
    descent?: EntryFieldTypes.Number;
    title: EntryFieldTypes.Text;
    content?: EntryFieldTypes.RichText;
    slug: EntryFieldTypes.Text;
    cover: EntryFieldTypes.AssetLink;
    media: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    gpx: EntryFieldTypes.AssetLink;
  }
}

export type HikeLog = Awaited<ReturnType<typeof ContentfulClient.withoutUnresolvableLinks.getEntries<HikeLogSkeleton>>>['items'][number];