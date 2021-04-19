const getWebSiteSchema = ({ siteUrl, siteTitle, siteDescription, htmlLang }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#WebSite`,
  url: siteUrl,
  name: siteTitle,
  description: siteDescription,
  inLanguage: htmlLang,
});

export default getWebSiteSchema;
