// The "Follow along" page (/social). Update FEED and PICK each week when new posts go out –
// newest first. Images live in /public/social (720px wide webp, cut from the post designs).
import { FACEBOOK_URL, INSTAGRAM_URL } from './schema';

export type FeedTile = { src: string; alt: string; where: 'Instagram' | 'Facebook' };

export const FEED: FeedTile[] = [
  { src: '/social/hello.webp', alt: 'Hello – Fettle is on Instagram', where: 'Instagram' },
  { src: '/social/fulham-sign.webp', alt: 'London Streets no. 1 – Fulham Road SW6 street sign', where: 'Instagram' },
  { src: '/social/fulham-houses.webp', alt: 'Illustration of late-Victorian terraces in Fulham', where: 'Instagram' },
  { src: '/social/slow-sink.webp', alt: 'Fix it or call us – slow sink, sorted without chemicals', where: 'Instagram' },
  { src: '/social/sash-windows.webp', alt: 'Sash windows that rattle, stick or let the wind in', where: 'Instagram' },
  { src: '/social/membership.webp', alt: 'New – In Fine Fettle home membership from £29 a month', where: 'Instagram' },
];

// "Off the clock" – the current London pick (from the stories / Sunday posts).
export const PICK = {
  series: 'The Sunday pint',
  name: 'The Phene',
  where: 'Phene Street · SW3',
  text: "A proper Chelsea corner pub on a quiet side street, with a big garden that's worth it even in November – just bring a coat.",
  image: '/social/off-the-clock-phene.webp',
};

export const CHANNELS = [
  {
    key: 'instagram',
    label: 'Instagram',
    handle: '@fettlelondon',
    href: INSTAGRAM_URL,
    title: 'The journal',
    text: 'London Streets, small fixes worth knowing, kind words from the homes we look after – and on Sundays, the London we love off the clock.',
    cta: 'Follow on Instagram',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    handle: 'Fettle London',
    href: FACEBOOK_URL,
    title: 'The workbench',
    text: 'Plain, useful home tips, seasonal reminders and what we are fixing this week – three times a week, with the odd street of the week thrown in.',
    cta: 'Follow on Facebook',
  },
];
