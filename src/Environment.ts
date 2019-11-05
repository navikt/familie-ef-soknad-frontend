interface IEnvUrls {
  apiUrl: string;
  loginService: string;
}

const Environment = (): IEnvUrls => {
  if (window.location.hostname.indexOf('www-q0') > -1) {
    return {
      apiUrl: 'https://www-q0.nav.no/familie/alene-med-barn/soknad-api',
      loginService:
        'https://loginservice-q.nav.no/login?redirect=https://www-q0.nav.no/familie/alene-med-barn/soknad/',
    };
  } else if (window.location.hostname.indexOf('www') > -1) {
    return {
      apiUrl: 'https://www.nav.no/familie/alene-med-barn/soknad-api',
      loginService:
        'https://loginservice.nav.no/login?redirect=https://www.nav.no/familie/alene-med-barn/soknad/',
    };
  } else {
    return {
      apiUrl: 'http://localhost:8091/familie/alene-med-barn/soknad-api',
      loginService: `http://localhost:8091/familie/alene-med-barn/local/cookie?redirect=${window.location}`,
    };
  }
};

export default Environment;
