import React from 'react';
import { Helmet } from 'react-helmet';

import getWebSiteSchema from './getWebSiteSchema';
import getPageSchema from './getPageSchema';
import getOrganizationSchema from './getOrganizationSchema';

const SeoBase = ({
  config,
  siteMeta,
  i18n,
  orgContacts,
  orgAddress,
  socialLinks,
  title,
  headline,
  description,
  locale,
  pathname,
  pageType,
  imgPath,
  datePublished,
  dateModified,
  tags,
  canonical,
  noindex,
  metas,
  links,
}) => {
  const isRoot = pathname === '/';

  const URL = `${config.siteUrl}${pathname}`;
  const homeURL = i18n ? `${config.siteUrl}${i18n.localizePath('/', locale)}` : URL;

  let imgURL;
  if (imgPath) {
    imgURL = `${config.siteUrl}${imgPath}`;
  }

  const purePath = i18n ? i18n.purePath(pathname) : pathname;

  const ogImage = { ...config.ogImage, src: `${config.ogImage.src}${locale}.jpg` };
  const twitterImage = { ...config.twitterImage, src: `${config.twitterImage.src}${locale}.jpg` };

  const { htmlLang, ogLocale, siteTitle, siteDescription } = siteMeta;

  const isArticle = pageType === 'Article' || pageType === 'BlogPosting';

  const metaTitle = title || siteTitle;
  const metaDescription = description || siteDescription;

  /** *
   * https://developer.mozilla.org/ru/docs/Web/HTTP/Headers/Content-Language
   *
   * Не  используйте этот мета элемент как здесь для констатирования языка документа:
   *
   * <meta httpEquiv="content-language" content={htmlLang} />
   *
   *  */
  const meta = [
    {
      name: 'robots',
      content: `${noindex ? 'no' : ''}index, follow`,
    },
    {
      name: 'description',
      content: metaDescription,
    },
    {
      name: 'theme-color',
      content: config.themeColor,
    },
    {
      property: 'og:locale',
      content: ogLocale,
    },
    ...(i18n?.localeCodes
      .filter((code) => code !== locale)
      .map((code) => ({
        property: 'og:locale:alternate',
        content: i18n.locales[code].ogLocale,
      })) || []),
  ];

  const og = [
    {
      property: 'og:site_name',
      content: i18n.locales[locale].siteShortName,
    },
    {
      property: 'og:url',
      content: URL,
    },
    {
      property: 'og:type',
      content: isArticle ? 'article' : 'website',
    },
    {
      property: 'og:title',
      content: metaTitle,
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      property: 'og:image',
      content: imgURL || ogImage.src,
    },
    {
      property: 'og:image:alt"',
      content: metaDescription,
    },
  ];
  if (!imgURL) {
    og.push(
      {
        property: 'og:image:width',
        content: ogImage.width,
      },
      {
        property: 'og:image:height',
        content: ogImage.height,
      },
    );
  }

  if (isArticle) {
    if (datePublished) {
      og.push({
        property: 'article:published_time',
        content: datePublished,
      });
    }
    if (dateModified) {
      og.push({
        property: 'article:modified_time',
        content: dateModified,
      });
    }
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag) => {
        og.push({
          property: 'article:tag',
          content: tag,
        });
      });
    }
  }

  if (config.fbAppID) {
    og.push({
      property: 'fb:app_id',
      content: config.fbAppID,
    });
  }

  if (socialLinks) {
    if (socialLinks.facebook) {
      og.push({
        property: 'article:publisher',
        content: socialLinks.facebook.to,
      });
    }
    Array.prototype.push.apply(
      og,
      Object.keys(socialLinks).map((key) => ({
        property: 'og:see_also',
        content: socialLinks[key].to,
      })),
    );
  }

  const twitter = [
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: metaTitle,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
    {
      name: 'twitter:image',
      content: imgURL || twitterImage.src,
    },
    {
      name: 'twitter:image:alt',
      content: metaDescription,
    },
  ];
  if (!imgURL) {
    twitter.push(
      {
        name: 'twitter:image:width',
        content: twitterImage.widt,
      },
      {
        name: 'twitter:image:height',
        content: twitterImage.height,
      },
    );
  }

  if (config.twitterCreator || config.twitterSite) {
    twitter.push(
      {
        name: 'twitter:site',
        content: config.twitterSite || config.twitterCreator,
      },
      {
        name: 'twitter:creator',
        content: config.twitterCreator || config.twitterSite,
      },
    );
  }

  const link = [
    {
      rel: 'author',
      type: 'text/plain',
      href: `${config.siteUrl}/humans.txt`,
    },
  ];

  if (canonical) {
    link.push({
      rel: 'canonical',
      href: URL,
    });
  }

  if (i18n) {
    Array.prototype.push.apply(
      link,
      i18n.localeCodes.map((code) => ({
        rel: 'alternate',
        hrefLang: i18n.locales[code].htmlLang,
        href: `${config.siteUrl}${i18n.localizePath(purePath, code)}`,
      })),
    );
    link.push({
      rel: 'alternate',
      hrefLang: 'x-default',
      href: `${config.siteUrl}${purePath}`,
    });
  }

  return (
    <Helmet
      htmlAttributes={{ lang: htmlLang }}
      title={metaTitle}
      meta={[...meta, ...og, ...twitter, ...(metas || [])]}
      link={[...link, ...(links || [])]}
    >
      <script type="application/ld+json">
        {JSON.stringify(
          getWebSiteSchema({
            siteUrl: config.siteUrl,
            siteTitle,
            siteDescription,
            htmlLang,
          }),
        )}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(
          getPageSchema({
            organizationName: orgAddress.name,
            siteUrl: config.siteUrl,
            siteLogo: config.siteLogo,
            URL,
            headline: headline || metaDescription,
            metaTitle,
            metaDescription,
            htmlLang,
            imgURL,
            datePublished,
            dateModified,
            pageType,
          }),
        )}
      </script>
      {isRoot && (
        <script type="application/ld+json">
          {JSON.stringify(
            getOrganizationSchema({
              orgContacts,
              orgAddress,
              config,
              homeURL,
              socialLinks,
            }),
          )}
        </script>
      )}
    </Helmet>
  );
};

export default SeoBase;
