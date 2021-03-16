import React from 'react';
import { Helmet } from 'react-helmet';
import Utils from 'at-utils';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var getWebSiteSchema = function getWebSiteSchema(_ref) {
  var siteUrl = _ref.siteUrl,
      siteTitle = _ref.siteTitle,
      siteDescription = _ref.siteDescription,
      htmlLang = _ref.htmlLang;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteUrl,
    name: siteTitle,
    description: siteDescription,
    inLanguage: htmlLang
  };
};

var getPageSchema = function getPageSchema(_ref) {
  var organizationName = _ref.organizationName,
      siteUrl = _ref.siteUrl,
      siteLogo = _ref.siteLogo,
      URL = _ref.URL,
      title = _ref.title,
      headline = _ref.headline,
      htmlLang = _ref.htmlLang,
      imgURL = _ref.imgURL,
      datePublished = _ref.datePublished,
      dateModified = _ref.dateModified,
      pageType = _ref.pageType,
      publisher = _ref.publisher,
      author = _ref.author;
  var type = !pageType || !['Article', 'BlogPosting', 'Blog'].some(function (t) {
    return pageType === t;
  }) ? 'WebPage' : pageType;
  var isArticle = pageType === 'Article' || pageType === 'BlogPosting';
  var o = {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    inLanguage: htmlLang,
    publisher: publisher || {
      '@type': 'Organization',
      name: organizationName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: siteLogo
      }
    }
  };

  if (isArticle) {
    o.author = author || o.publisher;
    o.mainEntityOfPage = {
      '@type': 'WebPage',
      '@id': URL
    };
    o.headline = headline;

    if (datePublished) {
      o.datePublished = datePublished;
    }

    if (dateModified) {
      o.dateModified = dateModified;
    }
  } else {
    o.url = URL;
    o.description = headline;
  }

  if (imgURL) {
    o.image = imgURL;
  }

  return o;
};

var weekDays = {
  mo: 'Monday',
  tu: 'Tuesday',
  we: 'Wednesday',
  th: 'Thursday',
  fr: 'Friday',
  sa: 'Saturday',
  su: 'Sunday'
};

var getOpeningHoursSpecification = function getOpeningHoursSpecification(openingHours) {
  var parseDow = function parseDow(s) {
    if (!s) {
      return undefined;
    }

    var dow = s.split('-');

    if (dow.length > 1) {
      var d1 = dow[0].trim();
      var d2 = dow[1].trim();
      var keys = Object.keys(weekDays);
      var a = [];
      var first = false;
      var last = false;
      keys.forEach(function (d) {
        if (d === d1) {
          first = true;
          a.push(weekDays[d]);
        } else if (d === d2) {
          last = true;
          a.push(weekDays[d]);
        } else if (first && !last) {
          a.push(weekDays[d]);
        }
      });
      return a;
    }

    dow = s.split(',');

    if (dow.length > 1) {
      return dow.map(function (d) {
        return weekDays[d.trim()];
      });
    }

    return weekDays[s.trim()];
  };

  return openingHours.map(function (_ref) {
    var dow = _ref[0],
        timeStart = _ref[1],
        timeFinish = _ref[2];
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: parseDow(dow),
      opens: timeStart,
      closes: timeFinish
    };
  });
};

var getOrganizationSchema = function getOrganizationSchema(_ref2) {
  var orgContacts = _ref2.orgContacts,
      _ref2$orgAddress = _ref2.orgAddress,
      orgAddress = _ref2$orgAddress === void 0 ? {} : _ref2$orgAddress,
      config = _ref2.config,
      socialLinks = _ref2.socialLinks;
  var organizationType = orgContacts.organizationType,
      geo = orgContacts.geo,
      openingHours = orgContacts.openingHours,
      organizationPhone = orgContacts.phone,
      organizationEmail = orgContacts.email,
      hasMap = orgContacts.hasMap,
      priceRange = orgContacts.priceRange,
      currenciesAccepted = orgContacts.currenciesAccepted,
      paymentAccepted = orgContacts.paymentAccepted;
  var organizationName = orgAddress.name,
      legalName = orgAddress.legalName,
      alternateName = orgAddress.alternateName,
      description = orgAddress.description,
      postalAddress = orgAddress.postalAddress,
      contactPoint = orgAddress.contactPoint;
  var schema = {
    '@context': 'https://schema.org',
    '@type': organizationType,
    '@id': config.siteUrl,
    name: organizationName,
    description: description,
    url: config.siteUrl,
    logo: config.siteLogo
  };

  if (config.siteBusinessPhoto) {
    schema.image = Array.isArray(config.siteBusinessPhoto) ? [].concat(config.siteBusinessPhoto) : config.siteBusinessPhoto;
  }

  var postalAddressObj;

  if (postalAddress) {
    postalAddressObj = _extends({
      '@type': 'PostalAddress'
    }, postalAddress, {
      streetAddress: postalAddress.streetAddress && postalAddress.streetAddress.join(', ')
    });
    schema.address = postalAddressObj;
  }

  if (legalName) {
    schema.legalName = legalName;
  }

  if (alternateName) {
    schema.alternateName = alternateName;
  }

  if (organizationPhone) {
    schema.telephone = "+" + organizationPhone[0];
  }

  if (organizationEmail) {
    schema.email = "mailto:" + organizationEmail[0];
  }

  if (geo) {
    schema.geo = _extends({
      '@type': 'GeoCoordinates'
    }, geo);
  }

  if (contactPoint) {
    schema.contactPoint = contactPoint.map(function (_ref3) {
      var name = _ref3.name,
          contactType = _ref3.contactType,
          telephone = _ref3.telephone,
          email = _ref3.email,
          areaServed = _ref3.areaServed;
      var o = {
        '@type': 'ContactPoint',
        name: name,
        contactType: contactType
      };

      if (telephone) {
        o.telephone = telephone.reduce(function (acc, curr) {
          return "" + acc + (acc ? ', ' : '') + Utils.formatPhone(curr);
        }, '');
      }

      if (email) {
        o.email = email.join();
      }

      if (areaServed) {
        o.areaServed = areaServed;
      }

      return o;
    });
  } else {
    if (organizationEmail) {
      schema.email = organizationEmail.join();
    }

    if (organizationPhone) {
      schema.telephone = organizationPhone.join();
    }
  }

  if (socialLinks) {
    schema.sameAs = Object.keys(socialLinks).map(function (key) {
      return socialLinks[key].to;
    });
  }

  if (currenciesAccepted) {
    schema.currenciesAccepted = currenciesAccepted;
  }

  if (paymentAccepted) {
    schema.paymentAccepted = paymentAccepted;
  }

  if (priceRange) {
    schema.priceRange = priceRange;
  }

  if (Array.isArray(openingHours)) {
    schema.OpeningHoursSpecification = getOpeningHoursSpecification(openingHours);
  }

  if (hasMap) {
    schema.hasMap = hasMap;
  }

  return schema;
};

var SeoBase = function SeoBase(_ref) {
  var config = _ref.config,
      siteMeta = _ref.siteMeta,
      i18n = _ref.i18n,
      orgContacts = _ref.orgContacts,
      orgAddress = _ref.orgAddress,
      socialLinks = _ref.socialLinks,
      title = _ref.title,
      headline = _ref.headline,
      description = _ref.description,
      locale = _ref.locale,
      pathname = _ref.pathname,
      pageType = _ref.pageType,
      imgPath = _ref.imgPath,
      datePublished = _ref.datePublished,
      dateModified = _ref.dateModified,
      canonical = _ref.canonical,
      noindex = _ref.noindex,
      metas = _ref.metas,
      links = _ref.links;
  var isRoot = pathname === '/';
  var URL = "" + config.siteUrl + pathname;
  var homeURL = i18n ? "" + config.siteUrl + i18n.localizePath('/', locale) : URL;
  var imgURL;

  if (imgPath) {
    imgURL = "" + config.siteUrl + imgPath;
  }

  var purePath = i18n ? i18n.purePath(pathname) : pathname;

  var ogImage = _extends({}, config.ogImage, {
    src: "" + config.ogImage.src + locale + ".jpg"
  });

  var twitterImage = _extends({}, config.twitterImage, {
    src: "" + config.twitterImage.src + locale + ".jpg"
  });

  var htmlLang = siteMeta.htmlLang,
      ogLocale = siteMeta.ogLocale,
      siteTitle = siteMeta.siteTitle,
      siteDescription = siteMeta.siteDescription;
  var isArticle = pageType === 'Article' || pageType === 'BlogPosting';
  var metaTitle = title || siteTitle;
  var metaDescription = description || siteDescription;
  return /*#__PURE__*/React.createElement(Helmet, null, /*#__PURE__*/React.createElement("html", {
    lang: htmlLang
  }), /*#__PURE__*/React.createElement("meta", {
    name: "robots",
    content: (noindex ? 'no' : '') + "index, follow"
  }), /*#__PURE__*/React.createElement("title", null, metaTitle), i18n === null || i18n === void 0 ? void 0 : i18n.localeCodes.map(function (code) {
    return /*#__PURE__*/React.createElement("link", {
      key: code,
      rel: "alternate",
      hrefLang: i18n.locales[code].htmlLang,
      href: "" + config.siteUrl + i18n.localizePath(purePath, code)
    });
  }), i18n && /*#__PURE__*/React.createElement("link", {
    rel: "alternate",
    hrefLang: "x-default",
    href: "" + config.siteUrl + purePath
  }), /*#__PURE__*/React.createElement("meta", {
    name: "description",
    content: metaDescription
  }), canonical && /*#__PURE__*/React.createElement("link", {
    rel: "canonical",
    href: URL
  }), links && links.map(function (_ref2) {
    var rel = _ref2.rel,
        href = _ref2.href;
    return /*#__PURE__*/React.createElement("link", {
      key: href,
      rel: rel,
      href: href
    });
  }), /*#__PURE__*/React.createElement("meta", {
    name: "theme-color",
    content: config.themeColor
  }), metas && Object.keys(metas).map(function (name) {
    return /*#__PURE__*/React.createElement("meta", {
      key: name,
      name: name,
      content: metas[name]
    });
  }), config.fbAppID && /*#__PURE__*/React.createElement("meta", {
    property: "fb:app_id",
    content: config.fbAppID
  }), /*#__PURE__*/React.createElement("meta", {
    property: "og:locale",
    content: ogLocale
  }), i18n === null || i18n === void 0 ? void 0 : i18n.localeCodes.filter(function (code) {
    return code !== locale;
  }).map(function (code) {
    return /*#__PURE__*/React.createElement("meta", {
      key: code,
      property: "og:locale:alternate",
      content: i18n.locales[code].ogLocale
    });
  }), /*#__PURE__*/React.createElement("meta", {
    property: "og:site_name",
    content: i18n.locales[locale].siteShortName
  }), socialLinks && socialLinks.facebook && /*#__PURE__*/React.createElement("meta", {
    property: "article:publisher",
    content: socialLinks.facebook.to
  }), /*#__PURE__*/React.createElement("meta", {
    property: "og:url",
    content: URL
  }), /*#__PURE__*/React.createElement("meta", {
    property: "og:type",
    content: isArticle ? 'article' : 'website'
  }), /*#__PURE__*/React.createElement("meta", {
    property: "og:title",
    content: metaTitle
  }), /*#__PURE__*/React.createElement("meta", {
    property: "og:description",
    content: metaDescription
  }), /*#__PURE__*/React.createElement("meta", {
    property: "og:image",
    content: ogImage.src
  }), /*#__PURE__*/React.createElement("meta", {
    property: "og:image:alt",
    content: metaDescription
  }), /*#__PURE__*/React.createElement("meta", {
    property: "og:image:width",
    content: ogImage.width
  }), /*#__PURE__*/React.createElement("meta", {
    property: "og:image:height",
    content: ogImage.height
  }), socialLinks && Object.keys(socialLinks).map(function (key) {
    return /*#__PURE__*/React.createElement("meta", {
      key: key,
      property: "og:see_also",
      content: socialLinks[key].to
    });
  }), /*#__PURE__*/React.createElement("meta", {
    name: "twitter:card",
    content: "summary_large_image"
  }), (config.twitterCreator || config.twitterSite) && /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("meta", {
    name: "twitter:site",
    content: config.twitterSite || config.twitterCreator
  }), /*#__PURE__*/React.createElement("meta", {
    name: "twitter:creator",
    content: config.twitterCreator || config.twitterSite
  })), /*#__PURE__*/React.createElement("meta", {
    name: "twitter:title",
    content: metaTitle
  }), /*#__PURE__*/React.createElement("meta", {
    name: "twitter:description",
    content: metaDescription
  }), /*#__PURE__*/React.createElement("meta", {
    name: "twitter:image",
    content: twitterImage.src
  }), /*#__PURE__*/React.createElement("meta", {
    name: "twitter:image:alt",
    content: metaDescription
  }), /*#__PURE__*/React.createElement("meta", {
    name: "twitter:image:width",
    content: twitterImage.width
  }), /*#__PURE__*/React.createElement("meta", {
    name: "twitter:image:height",
    content: twitterImage.height
  }), /*#__PURE__*/React.createElement("link", {
    type: "text/plain",
    href: config.siteUrl + "/humans.txt",
    rel: "author"
  }), /*#__PURE__*/React.createElement("script", {
    type: "application/ld+json"
  }, JSON.stringify(getWebSiteSchema({
    siteUrl: config.siteUrl,
    siteTitle: siteTitle,
    siteDescription: siteDescription,
    htmlLang: htmlLang
  }))), /*#__PURE__*/React.createElement("script", {
    type: "application/ld+json"
  }, JSON.stringify(getPageSchema({
    organizationName: orgAddress.name,
    siteUrl: config.siteUrl,
    siteLogo: config.siteLogo,
    URL: URL,
    headline: headline || metaDescription,
    metaTitle: metaTitle,
    metaDescription: metaDescription,
    htmlLang: htmlLang,
    imgURL: imgURL,
    datePublished: datePublished,
    dateModified: dateModified,
    pageType: pageType
  }))), isRoot && /*#__PURE__*/React.createElement("script", {
    type: "application/ld+json"
  }, JSON.stringify(getOrganizationSchema({
    orgContacts: orgContacts,
    orgAddress: orgAddress,
    config: config,
    homeURL: homeURL,
    socialLinks: socialLinks
  }))));
};

export default SeoBase;
export { getPageSchema };
//# sourceMappingURL=index.modern.js.map
