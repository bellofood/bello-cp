import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Sidebar from "../Sidebar";

const Header3 = () => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSidebarOpen(false);
  };
  
  const handleShow = () => {
    // Only show sidebar on desktop (1200px and above)
    if (window.innerWidth >= 1200) {
      setShow(true);
      setSidebarOpen(true);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English', countryCode: 'EN' },
    { code: 'ar', name: 'Arabic', flag: '🇪🇬', nativeName: 'العربية', countryCode: 'AR' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский', countryCode: 'RU' }
  ];

  const baseNavigationItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.sustainability'), href: '/sustainability' },
    { name: t('nav.products'), href: '/products' },
    { name: t('nav.joinUs'), href: '/join-us' },
    { name: t('nav.contact'), href: '/contact' }
  ];

  // Keep navigation items in the same logical order for all languages
  const navigationItems = baseNavigationItems;

  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0];

  const handleLanguageSelect = (language) => {
    setLangDropdownOpen(false);
    router.push(router.asPath, router.asPath, { locale: language.code });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setLangDropdownOpen(false);
      setMobileMenuOpen(false);
    }
  };

  // Subtle backdrop effect for mobile menu (no scroll lock needed since menu is compact)
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-active');
    } else {
      document.body.classList.remove('mobile-menu-active');
    }
    
    return () => {
      document.body.classList.remove('mobile-menu-active');
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state for styling
      setIsScrolled(currentScrollY > 50);

      // Header always stays visible - no hide on scroll
      setLastScrollY(currentScrollY);
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.modern-language-selector')) {
        setLangDropdownOpen(false);
      }
      if (!event.target.closest('.mobile-menu-container') && !event.target.closest('.mobile-menu-toggle')) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [lastScrollY]);

  return (
    <Fragment>
      {/* Unified Responsive Header */}
      <header className={`unified-floating-header ${isVisible && !sidebarOpen ? 'header-visible' : 'header-hidden'} ${isScrolled ? 'scrolled' : ''} ${sidebarOpen ? 'sidebar-active' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <div className="header-logo">
            <Link href="/" className="brand-logo">
                <img
                  src="/assets/images/logo/logo.svg"
                  alt="Site Logo"
                />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-navigation">
            <ul className="nav-menu">
              {navigationItems.map((item, index) => (
                <li key={index} className="nav-item">
                  <Link href={item.href} className="nav-link">{item.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Language Selector */}
            <div className="modern-language-selector" onKeyDown={handleKeyDown}>
              <div 
                className={`language-trigger ${langDropdownOpen ? 'active' : ''}`}
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                tabIndex="0"
                role="button"
                aria-haspopup="listbox"
                aria-expanded={langDropdownOpen}
                aria-label={`Current language: ${currentLanguage.name}`}
              >
                <div className="current-language">
                  <span className="flag">{currentLanguage.flag}</span>
                  <span className="language-code">{currentLanguage.countryCode}</span>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div className={`language-dropdown ${langDropdownOpen ? 'open' : ''}`} role="listbox">
                <div className="dropdown-content">
                  {languages.map((language) => (
                    <div
                      key={language.code}
                      className={`language-option ${currentLanguage.code === language.code ? 'selected' : ''}`}
                      onClick={() => handleLanguageSelect(language)}
                      role="option"
                      tabIndex="0"
                      aria-selected={currentLanguage.code === language.code}
                    >
                      <span className="option-flag">{language.flag}</span>
                      <div className="option-text">
                        <span className="option-name">{language.name}</span>
                        <span className="option-native">{language.nativeName}</span>
                      </div>
                      {currentLanguage.code === language.code && (
                        <svg className="check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Button - Desktop Only */}
            <button
              className="sidebar-btn d-none d-xl-block"
              onClick={handleShow}
              aria-label="Open Sidebar"
            >
              <img src="/assets/images/bar2.png" alt="Menu" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu-container ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            {/* Close Button */}
            <button 
              className="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <i className="fas fa-times"></i>
            </button>

            {/* Mobile Navigation */}
            <nav className="mobile-navigation">
              <ul className="mobile-nav-menu">
                {navigationItems.map((item, index) => (
                  <li key={index} className="mobile-nav-item">
                    <Link 
                      href={item.href}
                      className="mobile-nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                        {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`mobile-menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      </header>

      <Sidebar show={show} handleClose={handleClose} />
    </Fragment>
  );
};

export default Header3;