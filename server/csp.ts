// CSP eller Content-Security-Policy er en HTTP-Header som lar oss spesifisere hvor appen kan kjøre REST-kall mot og hvor den kan hente diverse innhold fra (fonter, bilder, javascript, stylesheets mm).
export const cspMap = (): Record<string, string[]> => {
  return {
    'default-src': ["'self'", '*.nav.no'],
    // Hvor vi kan hente .js filer fra.
    'script-src': [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'", // vergic
      '*.nav.no',
      '*.psplugin.com',
      '*.taskanalytics.com',
      '*.hotjar.com',
    ],
    // Hvor vi kan hente .css filer fra.
    'style-src': ["'self'", "'unsafe-inline'", '*.nav.no', '*.psplugin.com'],
    // Hvor vi kan kjøre XHR/REST-kall mot.
    'connect-src': [
      "'self'",
      '*.nav.no',
      '*.psplugin.com',
      '*.hotjar.com',
      '*.hotjar.io',
      '*.boost.ai',
      '*.taskanalytics.com',
    ],
    // Kan kun submitte forms til seg selv.
    'form-action': ["'self'"],
    // Hvor fonter kan hentes fra.
    'font-src': ["'self'", 'data:', '*.psplugin.com', '*.hotjar.com', 'cdn.nav.no'],
    // Hvor vi hente innhold til iFrames fra.
    'frame-src': ['*.hotjar.com', 'video.qbrick.com', 'player.vimeo.com'],
    // Hvor bilder kan hentes fra.
    'img-src': [
      "'self'",
      '*.nav.no',
      'data:',
      '*.psplugin.com',
      '*.vimeocdn.com', // used for video preview images
      '*.hotjar.com',
      'www.vergic.com', // seems to only be used for a single placeholder image
    ],
    'worker-src': ["'self'", 'blob:'],
    'child-src': ["'self'", 'blob:'],
    // Hvor manifest-filer kan hentes fra
    'manifest-src': ["'self'", 'www.nav.no', 'oidc-ver2.difi.no', 'idporten-ver2.difi.no'],
  };
};

export const cspString = () => {
  return Object.entries(cspMap())
    .map((entry) => `${entry[0]} ${entry[1].join(' ')}`)
    .join('; ');
};
