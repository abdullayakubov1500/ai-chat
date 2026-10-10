import styles from './DemoPage.module.css';

const services = [
  {
    id: 's1',
    title: 'Виджет на сайт',
    description: 'Установка за 5 минут — одна строка кода, как у Jivo. Чат не мешает контенту.',
  },
  {
    id: 's2',
    title: 'ИИ-ассистент 24/7',
    description: 'Отвечает на типовые вопросы, собирает заявки и передаёт сложные диалоги оператору.',
  },
  {
    id: 's3',
    title: 'Аналитика диалогов',
    description: 'Темы обращений, время ответа и конверсия в заявку — всё в одном кабинете.',
  },
  {
    id: 's4',
    title: 'Интеграции',
    description: 'CRM, мессенджеры и email-уведомления — подключим под ваш процесс продаж.',
  },
];

export default function DemoPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>ChatFlow</span>
        <nav className={styles.nav} aria-label="Основная навигация">
          <a href="#services">Услуги</a>
          <a href="#about">О продукте</a>
          <a href="#contact">Контакты</a>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Умный чат для вашего сайта
          </h1>
          <p className={styles.heroText}>
            Демо-страница клиента: в правом нижнем углу — виджет с ИИ-агентом в стиле Jivo.
            Откройте чат и попробуйте быстрые ответы или задайте свой вопрос.
          </p>
          <a className={styles.cta} href="#services">
            Узнать больше
          </a>
        </section>

        <section id="services" className={styles.section}>
          <h2 className={styles.sectionTitle}>Что входит в сервис</h2>
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
            <h2 className={styles.sectionTitle}>О продукте</h2>
            <p>
              ChatFlow помогает малому и среднему бизнесу не терять обращения с сайта.
              Виджет настраивается под ваш бренд: цвета, приветствие и сценарии ответов.
              На этом демо ответы имитируются локально — без подключения к серверу.
            </p>
          </div>
        </section>

        <section id="contact" className={styles.section}>
          <h2 className={styles.sectionTitle}>Контакты</h2>
          <p className={styles.contactText}>
            demo@chatflow.example.com · +7 (800) 555-35-35 · Москва, ул. Примерная, 1
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} ChatFlow. Учебный демо-проект.
      </footer>
    </div>
  );
}
