/**
 * All marketing copy for the Dog-Ear Book Club template in one place.
 * Everything here is original placeholder copy — swap it for your brand.
 */

export const brand = {
  name: 'Dog-Ear Book Club',
  short: 'Dog-Ear',
  tagline: 'Unwrap your next obsession',
  description:
    'Pick up to 3 brand-new hardcovers every month, delivered to your door. Fresh releases, proper hardbacks, zero aisle-wandering.',
  email: 'hello@dogear.example',
  appUrl: '#join',
  socials: {
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/',
  },
}

export const nav = [
  { label: 'All Books', href: '/books' },
  { label: 'Gifting', href: '/#gift' },
  { label: 'FAQ', href: '/faq' },
]

export const hero = {
  title: 'Unwrap your next obsession',
  paragraph:
    "The book club for people who'd rather read than browse. Choose up to 3 new hardcovers a month, delivered to your door. Then read them, and argue about them, with us.",
  cta: 'Log-in / Sign-up now',
  handwritten: 'Ships free in the US & Canada',
}

export const books = {
  title: "This month's picks",
  paragraph: 'Six fresh hardcovers land on the 1st of every month. Call us creatures of habit.',
  handwritten: 'Hidden gems and buzzy debuts',
}

export const flow = {
  title: 'How it works',
  handwritten: 'Think of us as your very picky librarian',
  cta: 'Become a member',
  steps: [
    {
      title: 'Browse the drop',
      text: 'On the 1st we reveal six or seven new books. Follow us on socials for the (not very subtle) hints the week before.',
      variant: 'base',
    },
    {
      title: 'Build your box',
      text: "Add up to 3 books per box. At least one has to be from this month's picks, the rest can come from the back catalogue.",
      variant: 'bright-pink',
    },
    {
      title: 'Watch the doorstep',
      text: 'Your box turns up at your door in a few days. This is a perfectly good excuse to cancel your Friday night plans.',
      variant: 'yellow',
    },
    {
      title: 'Talk it out',
      text: 'Post your box, tag us @dogearbooks, or jump into the club discussion threads in the app.',
      variant: 'periwinkle',
    },
  ],
}

export const box = {
  handwritten: 'Every box comes with a bookmark per book and a postcard riddle worth a free credit',
  title: 'Made to be opened slowly',
  finalText: 'By readers, for readers',
  appStore: 'Download on iOS',
  playStore: 'Get it on Android',
}

export const genre = {
  title: 'Pick your poison',
  handwritten: "There's a shelf for every mood",
}

export const benefits = {
  title: 'Why Dog-Ear?',
  items: [
    { label: 'Every genre', variant: '' },
    { label: 'Free shipping', variant: 'is--orange' },
    { label: 'Under $20', variant: 'is--periwinkle' },
    { label: 'Hardcovers only', variant: 'is--cyan' },
    { label: 'Hand-picked', variant: 'is--olive' },
  ],
}

export const faq = {
  title: 'Common questions',
  cta: 'Show all FAQ',
  items: [
    {
      q: 'How much does membership cost, my wallet is asking?',
      a: 'In the US, membership is $18.99/month for one book and $10.99 for each extra book. In Canada it is $25.99 CAD/month for one book and $15.99 for each extra. Shipping is on us.',
    },
    {
      q: 'Where do you ship?',
      a: 'The USA and Canada. If you are mailing to Puerto Rico, an APO/FPO address or a PO box, email hello@dogear.example and we will set up your account by hand.',
    },
    {
      q: 'Can I skip a month?',
      a: 'Yes, as often as you like. Skip from the app before the 25th and nothing ships and nothing is charged. Your credits and your streak (yes, there is a streak) carry over.',
    },
  ],
  more: [
    { q: 'When do new books drop?', a: 'On the 1st of every month at 9am Eastern. Members get a sneak peek email a few days before.' },
    { q: 'Are the books hardcover?', a: 'Always. Proper hardbacks with dust jackets, straight from the publisher, never remainders.' },
    { q: 'What if I already own a pick?', a: 'Swap it for anything in the back catalogue. Every past pick stays available while stock lasts.' },
    { q: 'Do you offer gift subscriptions?', a: 'We do. Buy 3, 6 or 12 months and the recipient picks their own books each month. An e-gift card is emailed instantly.' },
    { q: 'How do I cancel?', a: 'From your account settings in the app or on the web, in two taps. No emails, no phone calls, no guilt trips.' },
  ],
}

export const gift = {
  tagline: 'The gift that keeps on reading',
  paragraph:
    "Gift a subscription and they pick their own books, so there's no snooping on shelves required. Order today and an e-gift card lands in your inbox to print or forward. If you're lucky, they'll lend you a copy.",
  cta: 'Shop gifts!',
  handwritten: 'As read in',
  press: ['The Margin', 'Paper Trail', 'Nightstand', 'Bookish Times'],
}

export const badge = {
  text: 'First book just $5 with code DOGEAR (US only)!',
}

export const choice = {
  title: "Readers' Favourites",
  paragraph:
    "Every December members vote for the year's best box. The winners get a collector's reprint, a gold sticker and eternal bragging rights.",
  nextVote: 'Next voting round: Winter 2026',
  year: '2026',
}

export const exclusive = {
  title: 'Dog-Ear Originals',
  paragraph: "Twelve short frights by twelve Dog-Ear authors.\nNo, you can't get it anywhere else.",
  ratingLabel: 'Club rating',
  cta: 'Add to box!',
}

export const footer = {
  newsletterTitle: 'Join the mailing list',
  newsletterPlaceholder: 'Email address',
  newsletterCta: 'Subscribe',
  newsletterSuccess: 'Thank you, you joined us!',
  newsletterError: 'Oops! Something went wrong while submitting the form.',
  legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
  copyright: `©${new Date().getFullYear()} Dog-Ear Book Club. All rights reserved.`,
  credits: [{ label: 'A Next.js template', href: '#' }],
}

export const popUp = {
  title: 'Want to join the Club?',
  cta: 'Sign-up now!',
}
