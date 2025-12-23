import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(props) {
  const { locale } = props.__NEXT_DATA__
  const isRTL = locale === 'ar'
  
  return (
    <Html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <Head>
        {/*====== Google Fonts ======*/}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Cairo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/*====== Flaticon css ======*/}
        <link
          rel="stylesheet"
          href="/assets/fonts/flaticon/flaticon_bello.css"
        />
        {/*====== Contact Enhanced CSS ======*/}
        <link
          rel="stylesheet"
          href="/assets/css/contact-enhanced.css"
        />
        {/*====== Sustainability Modern CSS ======*/}
        <link
          rel="stylesheet"
          href="/assets/css/sustainability-modern.css"
        />
        {/*====== FontAwesome css ======*/}
        <link
          rel="stylesheet"
          href="/assets/fonts/fontawesome/css/all.min.css"
        />
        {/*====== Bootstrap css ======*/}
        <link
          rel="stylesheet"
          href="/assets/vendor/bootstrap/css/bootstrap.min.css"
        />
        {/*====== magnific-popup css ======*/}
        <link
          rel="stylesheet"
          href="/assets/vendor/magnific-popup/dist/magnific-popup.css"
        />
        {/*====== Slick-popup css ======*/}
        <link rel="stylesheet" href="/assets/vendor/slick/slick.css" />
        {/*====== Jquery UI css ======*/}
        <link
          rel="stylesheet"
          href="/assets/vendor/jquery-ui/jquery-ui.min.css"
        />
        {/*====== Nice Select css ======*/}
        <link
          rel="stylesheet"
          href="/assets/vendor/nice-select/css/nice-select.css"
        />
        {/*====== Animate css ======*/}
        <link rel="stylesheet" href="/assets/vendor/animate.css" />
        {/*====== Default css ======*/}
        <link rel="stylesheet" href="/assets/css/default.css" />
        {/*====== Style css ======*/}
        <link rel="stylesheet" href="/assets/css/style.css" />
        {/*====== Product Fixes css ======*/}
        <link rel="stylesheet" href="/assets/css/product-fixes.css" />
        {/*====== Product Overlay Fix css ======*/}
        <link rel="stylesheet" href="/assets/css/product-overlay-fix.css" />
        {/*====== Homepage Products Compact css ======*/}
        <link rel="stylesheet" href="/assets/css/homepage-products-compact.css" />
        {/*====== Mobile Menu Fix css ======*/}
        <link rel="stylesheet" href="/assets/css/mobile-menu-fix.css" />
        {/*====== RTL css ======*/}
        <link rel="stylesheet" href="/assets/css/rtl.css" />
        {/*====== Unified Floating Header css ======*/}
        <link rel="stylesheet" href="/assets/css/floating-header.css" />
        {/*====== WhatsApp Button css ======*/}
        <link rel="stylesheet" href="/assets/css/whatsapp-button.css" />
        <link rel="stylesheet" href="/assets/css/call-button.css" />
        {/*====== Tree Positioning Fix css ======*/}
        <link rel="stylesheet" href="/assets/css/tree-positioning-fix.css" />
        {/*====== Hero Button Fix css ======*/}
        <link rel="stylesheet" href="/assets/css/hero-button-fix.css" />
        {/*====== RTL Wave Absolute Fix css - FINAL SOLUTION ======*/}
        <link rel="stylesheet" href="/assets/css/rtl-wave-absolute.css" />
        {/*====== Arabic Mobile Fix css ======*/}
        <link rel="stylesheet" href="/assets/css/arabic-mobile-fix.css" />
        {/*====== Join Us Mobile Fix css ======*/}
        <link rel="stylesheet" href="/assets/css/join-us-mobile-fix.css" />
        {/*====== Text Contrast Fix css ======*/}
        <link rel="stylesheet" href="/assets/css/text-contrast-fix.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
