import { Asset, Entry, EntryFieldTypes } from "contentful";

export type HikeLogSkeleton =
{
  contentTypeId: "hikeLog",
  fields: {
    /** Date */
    date: EntryFieldTypes.Date;

    /** Day */
    day?: EntryFieldTypes.Number;

    /** Distance */
    distance?: EntryFieldTypes.Number;

    /** Ascent */
    ascent?: EntryFieldTypes.Number;

    /** Descent */
    descent?: EntryFieldTypes.Number;

    /** Title */
    title: EntryFieldTypes.Text;

    /** Content */
    content?: EntryFieldTypes.RichText;

    /** Slug */
    slug: EntryFieldTypes.Text;
  }
}
