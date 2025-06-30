import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container py-4">
      <nav className="mb-4">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <Link className="nav-link" href="/mobile-view">مشاهده نسخه موبایل</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/admin-panel">مشاهده پنل ادمین</Link>
          </li>
        </ul>
      </nav>
      <div>Welcome to the B2B Platform.</div>
    </main>
  );
}
