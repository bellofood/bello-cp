import Link from "next/link";

const Menu = () => {
  return (
    <nav className="main-menu">
      <ul>
        <li className="menu-item">
          <Link legacyBehavior href="/">
            Home
          </Link>
        </li>
        <li className="menu-item">
          <Link legacyBehavior href="/about">
            About
          </Link>
        </li>
        <li className="menu-item">
          <Link legacyBehavior href="/sustainability">
            Sustainability
          </Link>
        </li>
        <li className="menu-item">
          <Link legacyBehavior href="/products">
            Products
          </Link>
        </li>
        <li className="menu-item">
          <Link legacyBehavior href="/join-us">
            Join Us
          </Link>
        </li>
        <li className="menu-item">
          <Link legacyBehavior href="/contact">
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Menu;
