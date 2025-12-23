import Counter from "@/src/components/Counter";
import Layout from "@/src/layouts/Layout";
import { sliderProps } from "@/src/sliderProps";
import Link from "next/link";
import Slider from "react-slick";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import NewsletterSuccessToast from '../components/NewsletterSuccessToast';

const Index = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRTL = router.locale === 'ar';
  const [blogPosts, setBlogPosts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [websiteImages, setWebsiteImages] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Get the appropriate video based on locale
  const getVideoSource = () => {
    if (router.locale === 'ar') {
      return "/assets/video/world-map-arabic.mp4";
    }
    return "/assets/video/world-map.mp4"; // Default for English and Russian
  };

  // Fetch blog posts, featured products, and website images from database
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/news?published_only=true&limit=3');
        const result = await response.json();
        if (result.success && result.data) {
          setBlogPosts(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/homepage/featured-products-detail');
        const result = await response.json();
        console.log('Featured products API response:', result);
        if (result.success && result.data) {
          console.log('Featured products data:', result.data);
          result.data.forEach((p, i) => {
            console.log(`Product ${i + 1}:`, {
              name_en: p.name_en,
              main_image: p.main_image,
              category: p.category
            });
          });
          setFeaturedProducts(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      }
    };

    const fetchWebsiteImages = async () => {
      try {
        // Add cache-busting to force fresh API response
        const response = await fetch(`/api/website-images/config?t=${Date.now()}`, {
          cache: 'no-store', // Prevent browser from caching this request
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const result = await response.json();
        if (result.success && result.images) {
          console.log('✅ Loaded Supabase images:', result.images);
          
          // Set images directly - no preloading needed
          // Browser will load them naturally as they appear
          setWebsiteImages(result.images);
          setImagesLoaded(true);
        }
      } catch (error) {
        console.error('Failed to fetch website images:', error);
        // On error, use fallback images
        setImagesLoaded(true);
      }
    };

    fetchBlogPosts();
    fetchFeaturedProducts();
    fetchWebsiteImages();
  }, []);

  // Get title based on current language
  const getTitle = (post) => {
    if (router.locale === 'ar') return post.title_ar || post.title_en;
    if (router.locale === 'ru') return post.title_ru || post.title_en;
    return post.title_en;
  };

  // Get product name based on current language
  const getProductName = (product) => {
    if (router.locale === 'ar') return product.name_ar || product.name_en;
    if (router.locale === 'ru') return product.name_ru || product.name_en;
    return product.name_en;
  };

  // Get product image - same logic as products.jsx for glass jars
  const getProductImagePath = (productNameEn) => {
    const imageMap = {
      'Whole Green Olives': 'Whole Green Olives .png',
      'Pitted Green Olives': 'Pitted Green Olives .png',
      'Sliced Green Olives': 'Sliced Green Olives .png',
      'Whole Black Olives': 'Whole Black Olives.png',
      'Pitted Black Olives': 'Pitted Black Olives .png',
      'Sliced Black Olives': 'Sliced Black Olives .png',
      'Whole Black Natural Picual Olives': 'Whole Black Natural Picual Olives .jpg',
      'Pitted Black Natural Picual Olives': 'Pitted Black Natural Picual Olives.png',
      'Sliced Black Natural Picual Olives': 'Sliced  Black Natural Picual Olives.png',
      'Sliced Lombardi Pepper': 'Sliced Lombardi Pepper.png',
      'Pepperoncini Pepper': 'pepperoncini Pepper.png',
      'Cherry Pepper': 'Cherry Pepper.png',
      'Kardoula Pepper': 'Kardoula Pepper.png',
      'Whole Lombardi Pepper': 'Whole Lombardi Pepper.jpg',
      'Sliced Green Jalapeno Pepper': 'Sliced Green Jalapeno Pepper.png',
      'Sliced Red en Jalapeno Pepper': 'Sliced Red en Jalapeno Pepper.png',
      'Habiba Pepper': 'Habiba Peppper.jpg',
      'Mexican Pepper': 'Mexican Pepper.png',
      'Macedonian Pepper': 'Macedonian pepper jar.png',
      'Olive Black Natural Dolce': 'Olive Black Natural Dolce.png',
      'Pitted Black Natural Dolce': 'Pitted Black Natural Dolce.png',
      'Pitted Black Natural Kalamata Olives': 'Pitted Black Natural Kalamata Olives.png',
      'Sliced Black Natural Kalamata Olives': 'Sliced Black Natural Kalamata Olives.png',
      'Whole Black Natural Kalamata Olives': 'Whole Black Natural Kalamata Olives.png',
      'Artichoke Hearts': 'Artichoke Hearts .png',
      'Artichoke Quarter': 'Artichoke Quarter .png',
      'Artichoke Bottom': 'Artichoke Bottom jar.png',
    };

    const imageName = imageMap[productNameEn];
    if (imageName) {
      return `/assets/images/products/GLASS JARS/${imageName}`;
    }

    // Fallback
    return '/assets/images/products/GLASS JARS/Whole Green Olives .png';
  };
  
  // Disable RTL for debugging
  const heroSliderProps = {
    ...sliderProps.heroSliderTwo,
    // rtl: isRTL, // Temporarily disabled
  };
  
  return (
    <Layout header={3} footer={3}>
      {/*====== Start Banner Section ======*/}
      <section className="banner-section">
        {/*====== Hero Wrapper ======*/}
        <div className="hero-wrapper-three">
          <div className="hero-waves">
            <img src="/assets/images/hero/bg-2.png" className="waves one" alt="Background waves" />
            <img src="/assets/images/hero/bg.png" className="waves two" alt="Background waves" />
          </div>
          {/*====== Hero Slider ======*/}
          <Slider {...heroSliderProps} className="hero-slider-two">
            {/*====== Single Slider ======*/}
            <div className="single-slider">
              <div
                className="image-layer bg_cover"
                style={{
                  backgroundImage: websiteImages['hero-1'] 
                    ? `url(${websiteImages['hero-1']})`
                    : `url(/assets/images/hero/hero_two-slider-1.jpg)`,
                }}
              />
          <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xl-10">
                    {/*====== Hero Content ======*/}
                    <div className="hero-content text-center">
                      <span
                        className="sub-title"
                        data-animation="fadeInUp"
                        data-delay=".4s"
                      >
                        {t('hero.subtitle') || 'زيتون ومخللات فاخرة'}
                      </span>
                      <h1 data-animation="fadeInDown" data-delay=".5s">
                        {t('hero.title') || 'الطعم الأصيل للطبيعة، من مصر إلى العالم'}
                  </h1>
                      <p data-animation="fadeInUp" data-delay=".6s">
                    {t('hero.description') || 'موثوق به عالمياً مع أكثر من 30 نوعاً، جودة معتمدة، وحلول تعبئة مرنة.'}
                  </p>
                  <div
                        className="hero-button mb-30"
                        data-animation="fadeInDown"
                        data-delay=".7s"
                        style={{ position: 'relative', zIndex: 10 }}
                  >
                    <Link href="/contact" className="main-btn golden-btn mb-10" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
                            {t('hero.getQuote') || 'Get A Quote'}
                    </Link>
                    <Link href="/products" className="main-btn filled-btn filled-white mb-10" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
                            {t('hero.exploreProducts') || 'Explore Products'}
                    </Link>
                  </div>
                </div>
              </div>
                </div>
              </div>
            </div>
            {/*====== Single Slider ======*/}
            <div className="single-slider">
              <div
                className="image-layer bg_cover"
                style={{
                  backgroundImage: websiteImages['hero-2']
                    ? `url(${websiteImages['hero-2']})`
                    : `url(/assets/images/hero/hero_two-slider-2.jpg)`,
                }}
              />
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xl-10">
                    {/*====== Hero Content ======*/}
                    <div className="hero-content text-left">
                      <span
                        className="sub-title"
                        data-animation="fadeInUp"
                        data-delay=".4s"
                      >
                        {t('hero.subtitle') || 'زيتون ومخللات فاخرة'}
                      </span>
                      <h1 data-animation="fadeInDown" data-delay=".5s">
                        {t('hero.title') || 'الطعم الأصيل للطبيعة، من مصر إلى العالم'}
                      </h1>
                      <p data-animation="fadeInUp" data-delay=".6s">
                        {t('hero.description') || 'موثوق به عالمياً مع أكثر من 30 نوعاً، جودة معتمدة، وحلول تعبئة مرنة.'}
                      </p>
                      <div
                        className="hero-button mb-30"
                        data-animation="fadeInDown"
                        data-delay=".7s"
                        style={{ position: 'relative', zIndex: 10 }}
                      >
                        <Link href="/contact" className="main-btn golden-btn mb-10" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
                            {t('hero.getQuote') || 'احصل على عرض سعر'}
                        </Link>
                        <Link href="/products" className="main-btn filled-btn filled-white mb-10" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
                            {t('hero.exploreProducts') || 'استكشف المنتجات'}
                        </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            {/*====== Single Slider ======*/}
            <div className="single-slider">
              <div
                className="image-layer bg_cover"
                style={{
                  backgroundImage: websiteImages['hero-3']
                    ? `url(${websiteImages['hero-3']})`
                    : `url(/assets/images/hero/hero_two-slider-3.jpg)`,
                }}
              />
              <div className="container">
            <div className="row justify-content-center">
                  <div className="col-xl-10">
                    {/*====== Hero Content ======*/}
                    <div className="hero-content text-right">
                      <span
                        className="sub-title"
                        data-animation="fadeInUp"
                        data-delay=".4s"
                      >
                        {t('hero.subtitle') || 'زيتون ومخللات فاخرة'}
                      </span>
                      <h1 data-animation="fadeInDown" data-delay=".5s">
                        {t('hero.title') || 'الطعم الأصيل للطبيعة، من مصر إلى العالم'}
                      </h1>
                      <p data-animation="fadeInUp" data-delay=".6s">
                        {t('hero.description') || 'موثوق به عالمياً مع أكثر من 30 نوعاً، جودة معتمدة، وحلول تعبئة مرنة.'}
                      </p>
                      <div
                        className="hero-button mb-30"
                        data-animation="fadeInDown"
                        data-delay=".7s"
                        style={{ position: 'relative', zIndex: 10 }}
                      >
                        <Link href="/contact" className="main-btn golden-btn mb-10" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
                            {t('hero.getQuote') || 'احصل على عرض سعر'}
                        </Link>
                        <Link href="/products" className="main-btn filled-btn filled-white mb-10" style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}>
                            {t('hero.exploreProducts') || 'استكشف المنتجات'}
                        </Link>
                    </div>
                  </div>
                </div>
              </div>
                    </div>
                  </div>
          </Slider>
                </div>
      </section>
      {/*====== End Banner Section ======*/}
      {/*====== Start Our Achievements Section ======*/}
      <section className="features-section pt-95 pb-70">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="section-title text-center mb-50 wow fadeInDown">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('highlightsPage.subtitle')}
                </span>
                <h2>{t('highlightsPage.title')}</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="single-counter-item-two mb-40 wow fadeInDown" data-wow-delay=".2s">
                <div className="inner-counter">
                  <div className="icon">
                    <i className="fas fa-check" />
                    </div>
                  <h2 className="number">
                    <Counter end={10} />+
                  </h2>
                  <p>{t('highlightsPage.stats.countries')}</p>
                  </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="single-counter-item-two mb-40 wow fadeInUp" data-wow-delay=".25s">
                <div className="inner-counter">
                  <div className="icon">
                    <i className="fas fa-star" />
                  </div>
                  <h2 className="number">
                    <Counter end={30} />+
                  </h2>
                  <p>{t('highlightsPage.stats.products')}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="single-counter-item-two mb-40 wow fadeInDown" data-wow-delay=".3s">
                <div className="inner-counter">
                  <div className="icon">
                    <i className="fas fa-users" />
                  </div>
                  <h2 className="number">
                    <Counter end={99} />%
                  </h2>
                  <p>{t('highlightsPage.stats.satisfaction')}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6">
              <div className="single-counter-item-two mb-40 wow fadeInUp" data-wow-delay=".35s">
                <div className="inner-counter">
                  <div className="icon">
                    <i className="fas fa-award" />
                  </div>
                  <h2 className="number">
                    <Counter end={10} />+
                  </h2>
                  <p>{t('highlightsPage.stats.experience')}</p>
                </div>
              </div>
            </div>
                  </div>
                </div>
      </section>
      {/*====== End Our Achievements Section ======*/}

      {/*====== Start Global Reach Video Section  ======*/}
      <section className="global-reach-section pt-100 pb-50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="section-title text-center mb-50 wow fadeInDown">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('aboutPage.globalReach.subtitle') || 'Our Global Reach'}
                </span>
                <h2>{t('aboutPage.globalReach.title') || 'From Egypt to the World'}</h2>
                <p className="section-description">
                  {t('aboutPage.globalReach.description') || 'Discover our worldwide presence and export network that brings premium Egyptian products to international markets'}
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="global-reach-video-box wow fadeInUp" data-wow-delay="0.2s">
                <div 
                  className="video-container"
                  style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    background: '#f8f9fa'
                  }}
                >
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      console.error('Video failed to load:', e);
                      console.log('Attempted video source:', getVideoSource());
                    }}
                  >
                    <source src={getVideoSource()} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Overlay with company info */}
                  <div className="video-overlay map-text-overlay">
                    <h4 className="map-overlay-title">
                      {t('aboutPage.globalReach.overlayTitle') || 'Exporting Excellence Worldwide'}
                    </h4>
                    <p className="map-overlay-description">
                      {t('aboutPage.globalReach.overlayDescription') || 'From our facilities in Egypt, we serve markets across continents with premium quality products'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Global Reach Video Section  ======*/}
      
      {/*====== Start About Section ======*/}
      <section className="about-bg-section">
        {/*====== About BG ======*/}
        <div
          className="about-bg bg_cover wow fadeInLeft"
          style={{ 
            backgroundImage: websiteImages['bg-about']
              ? `url(${websiteImages['bg-about']})`
              : `url(/assets/images/bg/about-bg-1.jpg)`
          }}
        />
            <div className="container">
          <div className="row align-items-center justify-content-end">
            <div className="col-lg-6">
              {/*====== About Content Box ======*/}
              <div className="about-two_content-box pb-80 wow fadeInRight">
                <div className="section-title">
                  <div className="section-title mb-50">
                      <span className="sub-title">
                        <i className="flaticon-plant" />
                        {t('about.subtitle')}
                      </span>
                    <h2>{t('about.title')}</h2>
                    </div>
                  <p className="mb-45">
                      {t('about.description')}
                  </p>
                  <ul className="check-style-one mb-45">
                    <li>
                      <i className="far fa-check" />
                      {t('about.checkItems.0')}
                    </li>
                    <li>
                      <i className="far fa-check" />
                      {t('about.checkItems.1')}
                    </li>
                  </ul>
                  <div className="about-button mt-30">
                    <Link href="/about" className="main-btn golden-btn">
                      {t('about.learnMoreButton') || 'Learn More About Us'}
                      <i className="far fa-arrow-right" />
                    </Link>
                      </div>
                          </div>
                        </div>
                      </div>
                          </div>
                        </div>
      </section>
      {/*====== End About Section ======*/}
      {/*====== Start Service Section ======*/}
      <section className="service-bgc-section p-r z-1 main-bg pt-150 pb-70">
        <div className="shape shape-one">
          <span>
            <img src="/assets/images/shape/leaf-1.png" alt="Leaf Png" />
          </span>
                      </div>
        <div className="shape shape-two">
          <span>
            <img src="/assets/images/shape/leaf-2.png" alt="Leaf Png" />
          </span>
                          </div>
        <div className="shape shape-three">
          <span>
            <img src="/assets/images/shape/leaf-3.png" alt="Leaf Png" />
          </span>
                        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-9 col-lg-12">
              {/*====== Section Title ======*/}
              <div className="section-title text-white text-center mb-50 wow fadeInDown">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('products.subtitle')}
                </span>
                <h2>{t('products.title')}</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => {
                // Use database main_image if available, otherwise fall back to mapping
                const imageUrl = product.main_image || getProductImagePath(product.name_en);
                if (index === 0) {
                  console.log('First product image debug:', {
                    name: product.name_en,
                    main_image: product.main_image,
                    mapped_image: getProductImagePath(product.name_en),
                    final_imageUrl: imageUrl
                  });
                }
                return (
                  <div key={product.id} className="col-xl-4 col-lg-6 col-sm-12">
                    {/*====== Service Item ======*/}
                    <div
                      className="single-service-item mb-30 wow fadeInUp"
                      data-wow-delay={`.${20 + index * 5}s`}
                    >
                      <div className="service-info">
                        <h4 className="title">
                          <Link legacyBehavior href={`/products?category=${product.category}`}>
                            <a>{getProductName(product)}</a>
                          </Link>
                        </h4>
                      </div>
                      <div className="service-img">
                        <Link legacyBehavior href={`/products?category=${product.category}`}>
                          <a className="icon-btn">
                            <i className="far fa-plus" />
                          </a>
                        </Link>
                        <img
                          src={imageUrl}
                          alt={getProductName(product)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback to hardcoded products if no featured products set
              <>
                <div className="col-xl-4 col-lg-6 col-sm-12">
                  <div className="single-service-item mb-30 wow fadeInUp" data-wow-delay=".2s">
                    <div className="service-info">
                      <h4 className="title">
                        <Link legacyBehavior href="/products?category=greenOlives">
                          <a>{t('productsPage.products.wholeGreenOlives')}</a>
                        </Link>
                      </h4>
                    </div>
                    <div className="service-img">
                      <Link legacyBehavior href="/products?category=greenOlives">
                        <a className="icon-btn"><i className="far fa-plus" /></a>
                      </Link>
                      <img src="/assets/images/products/GLASS JARS/Whole Green Olives .png" alt="Whole Green Olives" />
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-sm-12">
                  <div className="single-service-item mb-30 wow fadeInDown" data-wow-delay=".25s">
                    <div className="service-info">
                      <h4 className="title">
                        <Link legacyBehavior href="/products?category=blackOlives">
                          <a>{t('productsPage.products.slicedBlackOlives')}</a>
                        </Link>
                      </h4>
                    </div>
                    <div className="service-img">
                      <Link legacyBehavior href="/products?category=blackOlives">
                        <a className="icon-btn"><i className="far fa-plus" /></a>
                      </Link>
                      <img src="/assets/images/products/GLASS JARS/Sliced Black Olives .png" alt="Sliced Black Olives" />
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-sm-12">
                  <div className="single-service-item mb-30 wow fadeInUp" data-wow-delay=".3s">
                    <div className="service-info">
                      <h4 className="title">
                        <Link legacyBehavior href="/products?category=peppers">
                          <a>{t('productsPage.products.pepperonciniPepper')}</a>
                        </Link>
                      </h4>
                    </div>
                    <div className="service-img">
                      <Link legacyBehavior href="/products?category=peppers">
                        <a className="icon-btn"><i className="far fa-plus" /></a>
                      </Link>
                      <img src="/assets/images/products/GLASS JARS/pepperoncini Pepper.png" alt="Pepperoncini Pepper" />
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-sm-12">
                  <div className="single-service-item mb-30 wow fadeInDown" data-wow-delay=".35s">
                    <div className="service-info">
                      <h4 className="title">
                        <Link legacyBehavior href="/products?category=greenOlives">
                          <a>{t('productsPage.products.pittedGreenOlives')}</a>
                        </Link>
                      </h4>
                    </div>
                    <div className="service-img">
                      <Link legacyBehavior href="/products?category=greenOlives">
                        <a className="icon-btn"><i className="far fa-plus" /></a>
                      </Link>
                      <img src="/assets/images/products/GLASS JARS/Pitted Green Olives .png" alt="Pitted Green Olives" />
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-sm-12">
                  <div className="single-service-item mb-30 wow fadeInUp" data-wow-delay=".4s">
                    <div className="service-info">
                      <h4 className="title">
                        <Link legacyBehavior href="/products?category=peppers">
                          <a>{t('productsPage.products.cherryPepper')}</a>
                        </Link>
                      </h4>
                    </div>
                    <div className="service-img">
                      <Link legacyBehavior href="/products?category=peppers">
                        <a className="icon-btn"><i className="far fa-plus" /></a>
                      </Link>
                      <img src="/assets/images/products/GLASS JARS/Cherry Pepper.png" alt="Cherry Pepper" />
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-sm-12">
                  <div className="single-service-item mb-30 wow fadeInDown" data-wow-delay=".45s">
                    <div className="service-info">
                      <h4 className="title">
                        <Link legacyBehavior href="/products?category=picklesVegetables">
                          <a>{t('productsPage.products.artichokeHearts')}</a>
                        </Link>
                      </h4>
                    </div>
                    <div className="service-img">
                      <Link legacyBehavior href="/products?category=picklesVegetables">
                        <a className="icon-btn"><i className="far fa-plus" /></a>
                      </Link>
                      <img src="/assets/images/products/GLASS JARS/Artichoke Hearts .png" alt="Artichoke Hearts" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {/*====== End Service Section ======*/}
      {/*====== Start Skills Section  ======*/}
      <section className="skills-section pt-100 pb-50">
        <div className="container">
          <div className="row align-items-lg-center">
            <div className="col-xl-6 col-lg-12">
              {/*====== Skill Content Box ======*/}
              <div className="skill-content-box mb-35 mr-lg-50 wow fadeInLeft">
                {/*====== Section-title ======*/}
                <div className="section-title mb-25">
                  <span className="sub-title">
                    <i className="flaticon-plant" />
                    {t('skills.subtitle')}
                  </span>
                  <h2>{t('skills.title')}</h2>
            </div>
                <p className="mb-30">
                  {t('skills.description')}
                </p>
                {/*====== Skills List ======*/}
                <ul className="skills-list">
                  <li>
                    <div className="single-skill-bar mb-15">
                      <h5 className="title">{t('skills.qualityControl')}</h5>
                      <div className="progress-bar">
                        <div
                          className="progress wow slideInLeft"
                          style={{ width: "96%" }}
                        />
                      </div>
                      <span className="number">96%</span>
                    </div>
                  </li>
                  <li>
                    <div className="single-skill-bar mb-15">
                      <h5 className="title">{t('skills.processing')}</h5>
                      <div className="progress-bar">
                        <div
                          className="progress wow slideInLeft"
                          style={{ width: "92%" }}
                        />
                      </div>
                      <span className="number">92%</span>
                    </div>
                  </li>
                  <li>
                    <div className="single-skill-bar mb-15">
                      <h5 className="title">{t('skills.packaging')}</h5>
                      <div className="progress-bar">
                        <div
                          className="progress wow slideInLeft"
                          style={{ width: "98%" }}
                        />
                      </div>
                      <span className="number">98%</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-6 col-lg-12">
              {/*====== Skills Image Box ======*/}
              <div className="skill-two_image-box mb-20 p-r z-1 wow fadeInRight">
                <img
                  src={websiteImages['skill-4'] ? websiteImages['skill-4'] : "/assets/images/skill/skill-4.png"}
                  className="skill-img-one"
                  alt="Skill Image"
                  loading="eager"
                  key={websiteImages['skill-4'] || 'skill-4-default'}
                />
                <img
                  src={websiteImages['skill-5'] ? websiteImages['skill-5'] : "/assets/images/skill/skill-5.png"}
                  className="skill-img-two"
                  alt="Skill Image"
                  loading="eager"
                  key={websiteImages['skill-5'] || 'skill-5-default'}
                />
                <div className="circle-logo">
                  <div className="inner-circle">
                    <img 
                      src="/assets/images/logo/01-04.svg" 
                      alt="Bello Logo" 
                      className="bello-logo-circle"
                      style={{ 
                        maxHeight: '70px', 
                        width: 'auto',
                        display: 'block',
                        margin: '0 auto'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Skills Section  ======*/}
      {/*====== Start Blog Section  ======*/}
      <section className="blog-section pt-100 pb-60">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-12">
              <div className="section-title text-center mb-50 wow fadeInDown">
                <span className="sub-title">
                  <i className="flaticon-plant" />
                  {t('blog.subtitle')}
                </span>
                <h2>{t('blog.title')}</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {blogPosts.length > 0 ? (
              blogPosts.map((post, index) => {
                const excerpt = router.locale === 'ar' ? post.excerpt_ar : 
                               router.locale === 'ru' ? post.excerpt_ru : 
                               post.excerpt_en;
                const featuredImage = post.featured_image || '/assets/images/blog/blog-placeholder.jpg';
                
                return (
                  <div className="col-xl-4 col-md-6 col-sm-12" key={post.id}>
                    {/*====== Single Blog Post  ======*/}
                    <div
                      className="single-blog-post-card mb-40 wow fadeInUp"
                      data-wow-delay={`.${2 + index}s`}
                    >
                      {/* Featured Image */}
                      <Link href={`/news/${post.slug}`}>
                        <div className="post-thumbnail" style={{ cursor: 'pointer' }}>
                        <img 
                          src={featuredImage} 
                          alt={getTitle(post)}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover',
                            borderRadius: '8px 8px 0 0'
                          }}
                          onError={(e) => {
                            e.target.src = '/assets/images/blog/blog-placeholder.jpg';
                          }}
                        />
                      </div>
                      </Link>
                      
                      {/* Post Content */}
                      <div className="post-content-wrapper">
                        {/* Date and Author Meta */}
                        <div className="post-meta-info">
                          <div className="meta-item">
                            <i className="far fa-calendar-alt"></i>
                            <span>{new Date(post.published_at).toLocaleDateString(router.locale, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="meta-item">
                            <i className="far fa-user"></i>
                            <span>{post.author_name || t('blog.author')}</span>
                          </div>
                        </div>
                        
                        {/* Title */}
                        <Link href={`/news/${post.slug}`}>
                          <h3 className="post-title" style={{ cursor: 'pointer' }}>
                          {getTitle(post)}
                        </h3>
                        </Link>
                        
                        {/* Excerpt */}
                        {excerpt && (
                          <p className="post-excerpt">
                            {excerpt}
                          </p>
                        )}
                        
                        {/* Read More Button */}
                        <div className="post-actions mt-20">
                          <Link href={`/news/${post.slug}`} className="read-more-btn">
                            {t('blog.readMore', 'Read More')}
                            <i className={`fas fa-arrow-${isRTL ? 'left' : 'right'} ml-2`}></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback to hardcoded posts if no data from database
              <>
                {[0, 1, 2].map((index) => (
                  <div className="col-xl-4 col-md-6 col-sm-12" key={index}>
                    <div className="single-blog-post-card mb-40 wow fadeInUp" data-wow-delay={`.${2 + index}s`}>
                      {/* Featured Image */}
                      <div className="post-thumbnail">
                        <img 
                          src="/assets/images/blog/blog-placeholder.jpg"
                          alt={t(`blog.posts.${index}`)}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover',
                            borderRadius: '8px 8px 0 0'
                          }}
                        />
                      </div>
                      
                      {/* Post Content */}
                      <div className="post-content-wrapper">
                        {/* Date and Category Meta */}
                        <div className="post-meta-info">
                          <div className="meta-item">
                            <i className="far fa-calendar-alt"></i>
                            <span>{t('blog.date')}</span>
                          </div>
                          <div className="meta-item">
                            <i className="far fa-user"></i>
                            <span>{t('blog.author')}</span>
                          </div>
                        </div>
                        
                        {/* Title */}
                        <h3 className="post-title">
                          {t(`blog.posts.${index}`)}
                        </h3>
                        
                        {/* Excerpt */}
                        <p className="post-excerpt">
                          {t('blog.defaultExcerpt')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        
        <style jsx>{`
          .single-blog-post-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          
          .single-blog-post-card:hover {
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
            transform: translateY(-5px);
          }
          
          .post-thumbnail {
            position: relative;
            overflow: hidden;
          }
          
          .post-thumbnail img {
            transition: transform 0.3s ease;
          }
          
          .single-blog-post-card:hover .post-thumbnail img {
            transform: scale(1.05);
          }
          
          .post-content-wrapper {
            padding: 25px;
            display: flex;
            flex-direction: column;
            flex: 1;
          }
          
          .post-meta-info {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
            flex-wrap: wrap;
          }
          
          .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #666;
          }
          
          .meta-item i {
            color: #5a7249;
            font-size: 14px;
          }
          
          .post-title {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 12px;
            line-height: 1.4;
            min-height: 50px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            transition: color 0.3s ease;
          }
          
          .post-title:hover {
            color: #5a7249;
          }
          
          .post-excerpt {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 0;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .post-actions {
            margin-top: auto;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
          }
          
          .post-actions :global(.read-more-btn) {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #5a7249;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            transition: all 0.3s ease;
          }
          
          .post-actions :global(.read-more-btn:hover) {
            color: #3d5032;
            gap: 12px;
          }
          
          .post-actions :global(.read-more-btn i) {
            transition: transform 0.3s ease;
          }
          
          .post-actions :global(.read-more-btn:hover i) {
            transform: translateX(5px);
          }
          
          @media (max-width: 768px) {
            .post-content-wrapper {
              padding: 20px;
            }
            
            .post-title {
              font-size: 16px;
              min-height: auto;
            }
            
            .post-meta-info {
              gap: 15px;
            }
          }
        `}</style>
      </section>
      {/*====== End Blog Section  ======*/}
      
      {/* Success Toast */}
      {showSuccessToast && (
        <NewsletterSuccessToast 
          message={successMessage} 
          onClose={() => setShowSuccessToast(false)} 
        />
      )}
    </Layout>
  );
};
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Index;
