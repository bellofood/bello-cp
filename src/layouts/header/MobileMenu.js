import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
const MobileMenu = ({ handleShow, logo, extraClass, barIcon }) => {
  const [toggle, setToggle] = useState(false);

  const [activeMenu, setActiveMenu] = useState(null);
  const active = (value) => setActiveMenu(value === activeMenu ? null : value),
    activeSubMenu = (value) =>
      value == activeMenu ? { display: "block" } : { display: "none" };

  // Close menu when clicking on menu items
  const handleMenuItemClick = () => {
    setToggle(false);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (toggle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Handle escape key to close menu
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && toggle) {
        setToggle(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [toggle]);

  return (
    <Fragment>
      <div
        className={`header-navigation d-xl-none d-block breakpoint-on ${extraClass}`}
      >
        <div
          className={`nav-overlay ${toggle ? "active" : ""}`}
          onClick={() => setToggle(false)}
        />
        <div className="container-fluid">
          <div className="primary-menu">
            {/*====== Site Branding ======*/}
            <div className="site-branding">
              <Link href="/" className="brand-logo">
                  <img
                    src={logo ? logo : "/assets/images/logo/logo-black.png"}
                    alt="Site Logo"
                  />
              </Link>
            </div>
            {/*====== Nav Menu ======*/}
            <div className={`nav-menu ${toggle ? "menu-on" : ""}`}>
              {/*====== Site Branding ======*/}
              <div className="mobile-logo mb-30 d-block d-xl-none">
                <Link href="/" className="brand-logo">
                    <img
                      src={"/assets/images/logo/logo-black.png"}
                      alt="Site Logo"
                    />
                </Link>
              </div>

              {/*====== main Menu ======*/}
              <nav className="main-menu">
                <ul>
                  <li className="menu-item">
                    <Link href="/" onClick={handleMenuItemClick}>Home</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/about" onClick={handleMenuItemClick}>About</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/sustainability" onClick={handleMenuItemClick}>Sustainability</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/products" onClick={handleMenuItemClick}>Products</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/join-us" onClick={handleMenuItemClick}>Join Us</Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/contact" onClick={handleMenuItemClick}>Contact</Link>
                  </li>
                </ul>
              </nav>
              {/*====== Menu Button ======*/}
              <div className="menu-button mt-40 d-xl-none">
                <Link href="/contact" className="main-btn secondary-btn">Get a Quote</Link>
              </div>
            </div>
            {/*====== Nav Right Item ======*/}
            <div className="nav-right-item d-flex align-items-center">
              <div className="menu-button d-xl-block d-none">
                <Link href="/contact" className="main-btn primary-btn">Get a Quote</Link>
              </div>

              <div
                className={`navbar-toggler ${toggle ? 'active' : ''}`}
                onClick={() => setToggle(!toggle)}
                style={{ cursor: 'pointer' }}
                aria-label="Toggle mobile menu"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setToggle(!toggle);
                  }
                }}
              >
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default MobileMenu;
