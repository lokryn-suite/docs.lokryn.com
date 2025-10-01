import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Lokryn
        </Heading>
        <p className="hero__subtitle">
          Compliance‑ready developer tools for auditability, automation, and trust.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/developyrs/lokryn-pipe-audit-core">
            GitHub
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://discord.gg/4JJT9qEfCA">
            Join Discord
          </Link>
        </div>
      </div>
    </header>
  );
}

export default HomepageHeader;
