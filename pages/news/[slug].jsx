import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "@/src/layouts/Layout";
import PageBanner from "@/src/components/PageBanner";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

const NewsDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { t } = useTranslation('common');
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isRTL = router.locale === 'ar' || router.locale === 'eg';

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, router.locale]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?slug=${slug}`);
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        setPost(result.data[0]);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (!post) return '';
    if (router.locale === 'ar') return post.title_ar || post.title_en;
    if (router.locale === 'ru') return post.title_ru || post.title_en;
    return post.title_en;
  };

  const getContent = () => {
    if (!post) return '';
    if (router.locale === 'ar') return post.content_ar || post.content_en;
    if (router.locale === 'ru') return post.content_ru || post.content_en;
    return post.content_en;
  };

  const getExcerpt = () => {
    if (!post) return '';
    if (router.locale === 'ar') return post.excerpt_ar || post.excerpt_en;
    if (router.locale === 'ru') return post.excerpt_ru || post.excerpt_en;
    return post.excerpt_en;
  };

  if (loading) {
    return (
      <Layout header={3} footer={3}>
        <PageBanner pageTitle={t('blog.title')} />
        <section className="blog-details-section pt-100 pb-60">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-8">
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p style={{ marginTop: '20px' }}>Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout header={3} footer={3}>
        <PageBanner pageTitle={t('blog.title')} />
        <section className="blog-details-section pt-100 pb-60">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-8">
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#dc3545', marginBottom: '20px' }}></i>
                  <h3>{error || 'Post not found'}</h3>
                  <Link href="/" className="main-btn btn-green mt-4">
                    {t('common.backHome')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout header={3} footer={3}>
      <PageBanner pageTitle={getTitle()} />
      <section className="blog-details-section pt-100 pb-60">
        <div className="container">
          {/* Back to Home Button - Top */}
          <div className="row">
            <div className="col-12">
              <div className="back-to-home-top mb-30">
                <Link href="/" className="back-link-top">
                  <i className={`fas fa-arrow-${isRTL ? 'right' : 'left'}`}></i>
                  <span>{t('blog.backToHome', 'Back to Home')}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-12">
              <div className="blog-details-wrapper">
                {/* Featured Image */}
                {post.featured_image && (
                  <div className="featured-image-wrapper mb-40">
                    <img 
                      src={post.featured_image} 
                      alt={getTitle()}
                      style={{
                        width: '100%',
                        maxHeight: '500px',
                        objectFit: 'cover',
                        borderRadius: '12px'
                      }}
                    />
                  </div>
                )}

                {/* Post Meta */}
                <div className="post-meta-wrapper mb-30">
                  <div className="post-meta-items">
                    <div className="meta-item">
                      <i className="far fa-calendar-alt"></i>
                      <span>{new Date(post.published_at).toLocaleDateString(router.locale, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="meta-item">
                      <i className="far fa-user"></i>
                      <span>{post.author_name || t('blog.author')}</span>
                    </div>
                    {post.category && (
                      <div className="meta-item">
                        <i className="far fa-folder"></i>
                        <span>{post.category}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Title */}
                <h1 className="post-title mb-20">{getTitle()}</h1>

                {/* Post Excerpt */}
                {getExcerpt() && (
                  <div className="post-excerpt mb-30">
                    <p>{getExcerpt()}</p>
                  </div>
                )}

                {/* Post Content */}
                <div className="post-content">
                  <div dangerouslySetInnerHTML={{ __html: getContent() }} />
                </div>

                {/* Gallery Images */}
                {post.gallery_images && post.gallery_images.length > 0 && (
                  <div className="post-gallery mt-40">
                    <h3 className="mb-20">{t('blog.gallery', 'Gallery')}</h3>
                    <div className="row">
                      {post.gallery_images.map((image, index) => (
                        <div className="col-md-6 col-sm-12 mb-20" key={index}>
                          <img 
                            src={image} 
                            alt={`Gallery ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '300px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags mt-40">
                    <h4 className="mb-15">{t('blog.tags', 'Tags')}</h4>
                    <div className="tags-list">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="tag-item">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Back Button */}
                <div className="back-button-wrapper mt-50">
                  <Link href="/" className="main-btn btn-green">
                    <i className={`fas fa-arrow-${isRTL ? 'right' : 'left'}`}></i>
                    {t('blog.backToHome', 'Back to Home')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .back-to-home-top {
            display: inline-block;
          }

          .back-to-home-top :global(.back-link-top) {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 24px;
            background: white;
            border: 2px solid #5a7249;
            border-radius: 8px;
            color: #5a7249;
            font-weight: 600;
            font-size: 15px;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          }

          .back-to-home-top :global(.back-link-top:hover) {
            background: #5a7249;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(90, 114, 73, 0.3);
          }

          .back-to-home-top :global(.back-link-top i) {
            font-size: 16px;
            transition: transform 0.3s ease;
          }

          .back-to-home-top :global(.back-link-top:hover i) {
            transform: translateX(-3px);
          }

          .blog-details-wrapper {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
          }

          .post-meta-wrapper {
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
          }

          .post-meta-items {
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
          }

          .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #666;
          }

          .meta-item i {
            color: #5a7249;
            font-size: 16px;
          }

          .post-title {
            font-size: 36px;
            font-weight: 700;
            color: #1a1a1a;
            line-height: 1.3;
          }

          .post-excerpt {
            font-size: 18px;
            color: #666;
            font-style: italic;
            padding: 20px;
            background: #f8f9fa;
            border-left: 4px solid #5a7249;
            border-radius: 4px;
          }

          .post-content {
            font-size: 16px;
            line-height: 1.8;
            color: #333;
          }

          .post-content :global(p) {
            margin-bottom: 20px;
          }

          .post-content :global(h2) {
            font-size: 28px;
            font-weight: 600;
            margin: 30px 0 15px;
            color: #1a1a1a;
          }

          .post-content :global(h3) {
            font-size: 24px;
            font-weight: 600;
            margin: 25px 0 12px;
            color: #1a1a1a;
          }

          .post-content :global(ul),
          .post-content :global(ol) {
            margin-bottom: 20px;
            padding-left: 30px;
          }

          .post-content :global(li) {
            margin-bottom: 10px;
          }

          .post-content :global(img) {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
          }

          .post-content :global(blockquote) {
            padding: 20px 30px;
            margin: 30px 0;
            background: #f8f9fa;
            border-left: 4px solid #5a7249;
            font-style: italic;
            color: #555;
          }

          .tags-list {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }

          .tag-item {
            padding: 6px 15px;
            background: #5a7249;
            color: white;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
          }

          .back-button-wrapper {
            padding-top: 30px;
            border-top: 2px solid #f0f0f0;
            text-align: center;
          }

          .back-button-wrapper :global(.main-btn) {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 14px 32px;
            background: #5a7249;
            color: white;
            border: 2px solid #5a7249;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(90, 114, 73, 0.2);
          }

          .back-button-wrapper :global(.main-btn:hover) {
            background: white;
            color: #5a7249;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(90, 114, 73, 0.3);
          }

          .back-button-wrapper :global(.main-btn i) {
            font-size: 18px;
            transition: transform 0.3s ease;
          }

          .back-button-wrapper :global(.main-btn:hover i) {
            transform: translateX(-3px);
          }

          @media (max-width: 768px) {
            .blog-details-wrapper {
              padding: 25px;
            }

            .post-title {
              font-size: 28px;
            }

            .post-excerpt {
              font-size: 16px;
            }

            .post-meta-items {
              gap: 15px;
            }

            .back-to-home-top :global(.back-link-top),
            .back-button-wrapper :global(.main-btn) {
              font-size: 14px;
              padding: 10px 20px;
            }
          }
        `}</style>
      </section>
    </Layout>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default NewsDetail;

