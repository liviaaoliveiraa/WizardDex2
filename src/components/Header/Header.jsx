'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../Header/Header.module.css';

export default function Header() {

  const pathname = usePathname();

  const [theme, setTheme] = useState('dark');

  const headerItems = [
    { name: 'Home', path: '/' },
    { name: 'Personagens', path: '/personagens' },
    { name: 'Sobre', path: '/sobre' },
  ];

  useEffect(() => {
    const getCookie = (name) => {
      const cookies = document.cookie.split('; ');

      const cookie = cookies.find((row) => row.startsWith(`${name}=`));

      return cookie ? cookie.split('=')[1] : null;
    };

    const savedTheme = getCookie('theme') || 'dark';

    setTheme(savedTheme);

    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);

    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;

    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (

    <header className={styles.header}>

      <div className={styles.headerContainer}>

        <Link href="/" className={styles.logoLink}>

          <Image
            src="/images/logo.png"
            alt="Logo WizardDex"
            width={48}
            height={48}
            priority
            className={styles.logoImage}
          />

          <span className={styles.logoTitle}>WIZARDDEX</span>

        </Link>

        <nav>

          <ul className={styles.headerList}>

            {headerItems.map((item) => {

              const isActive = pathname === item.path;

              return (

                <li key={item.path}>

                  <Link
                    href={item.path}
                    className={`${styles.headerLink} ${
                      isActive ? styles.activeLink : ''
                    }`}
                  >

                    {item.name}

                  </Link>

                </li>

              );

            })}

            <li>

              <button
                className={styles.themeButton}
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              >

                {theme === 'dark' ? '☀️' : '🌙'}

              </button>

            </li>

          </ul>

        </nav>

      </div>

    </header>

  );

}