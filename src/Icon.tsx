const paths = {
  shield: 'M12 22s7-3.2 7-10V5l-7-3-7 3v7c0 6.8 7 10 7 10z M9 12l2 2 4-4',
  mail: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M3 7l9 6 9-6',
  inbox: 'M3 14l3-8h12l3 8v5H3z M3 14h5l2 2h4l2-2h5',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  check: 'm5 12 4 4L19 6',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0z',
  flag: 'M5 22V3m0 1c5-5 9 5 15 0v11c-6 5-10-5-15 0',
  clip: 'm9 15 6-6a2 2 0 0 1 3 3l-8 8a4 4 0 0 1-6-6l9-9a6 6 0 0 1 8 8l-7 7',
  link: 'M10 13a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-2 2 M14 11a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l2-2',
  qr: 'M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h2v2h-2z M21 15v6h-4',
  chevron: 'm6 9 6 6 6-6',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 6v6l4 2',
  info: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 11v5m0-8h.01',
  lock: 'M7 10V7a5 5 0 0 1 10 0v3 M5 10h14v11H5z',
  people: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M22 21v-2a4 4 0 0 0-3-4 M16 3a4 4 0 0 1 0 8',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  replay: 'M3 12a9 9 0 1 1 3 7 M3 5v7h7',
};

export function Icon({ name, size = 20 }: { name: keyof typeof paths; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
