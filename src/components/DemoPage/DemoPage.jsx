import { shopConfig } from '../../mocks/shopConfig.mock.js';
import styles from './DemoPage.module.css';

const services = [
  {
    id: 's1',
    title: 'Масла и жидкости',
    description: 'Моторные, трансмиссионные масла, антифриз и тормозная жидкость с подбором по допускам.',
  },
  {
    id: 's2',
    title: 'Фильтры и расходники',
    description: 'Масляные, воздушные, салонные и топливные фильтры под вашу марку и модель.',
  },
  {
    id: 's3',
    title: 'АКБ и шины',
    description: 'Аккумуляторы, шины и диски — наличие, доставка и помощь с выбором размера.',
  },
  {
    id: 's4',
    title: 'Автомастерская',
    description: `Ремонт и диагностика — по телефону ${shopConfig.workshopPhone}, не через чат магазина.`,
  },
];

export default function DemoPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>{shopConfig.name}</span>
        <nav className={styles.nav} aria-label="Основная навигация">
          <a href="#services">Каталог</a>
          <a href="#about">О магазине</a>
          <a href="#contact">Контакты</a>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Автотовары с доставкой и самовывозом
          </h1>
          <p className={styles.heroText}>
            В чате справа внизу — консультант по товарам: масла, фильтры, аккумуляторы и аксессуары.
            Вопросы по ремонту в сервисе — звоните в мастерскую: {shopConfig.workshopPhone}.
          </p>
          <a className={styles.cta} href="#services">
            Смотреть категории
          </a>
        </section>

        <section id="services" className={styles.section}>
          <h2 className={styles.sectionTitle}>Популярные категории</h2>
          <ul className={styles.grid}>
            {services.map((item) => (
              <li key={item.id} className={styles.card}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="about" className={styles.sectionMuted}>
          <div className={styles.aboutInner}>
            <h2 className={styles.sectionTitle}>О магазине</h2>
            <p>
              «{shopConfig.name}» — интернет-магазин автотоваров. В чате помогаем подобрать продукцию
              по марке и модели автомобиля. Установка и ремонт выполняются в автомастерской —
              для записи и консультации по сервису используйте номер {shopConfig.workshopPhone}.
            </p>
          </div>
        </section>

        <section id="contact" className={styles.section}>
          <h2 className={styles.sectionTitle}>Контакты</h2>
          <p className={styles.contactText}>
            shop@{shopConfig.name.toLowerCase()}.example.com · магазин: +7 (800) 555-35-35 ·
            мастерская: {shopConfig.workshopPhone} · Москва, ул. Гаражная, 1
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} {shopConfig.name}. Демо-магазин автотоваров.
      </footer>
    </div>
  );
}
