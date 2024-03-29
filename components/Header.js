// components/Header.js
import Link from 'next/link';

const Header = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
        <li>
          <Link href="/datagrid">DataGrid</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
