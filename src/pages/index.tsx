import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/pipe-audit/cli/quickstart">
            Get Started with CLI
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/pipe-audit/core/quickstart">
            Get Started with Core
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className={styles.featureCard}>
        <h3>Profiles</h3>
        <p>Connect to S3, GCS, Azure, or local data sources with simple TOML profiles.</p>
      </div>
      <div className={styles.featureCard}>
        <h3>Contracts</h3>
        <p>Define expectations for your data in TOML — file‑level, column‑level, and compound rules.</p>
      </div>
      <div className={styles.featureCard}>
        <h3>Rules</h3>
        <p>Apply validators like <code>not_null</code>, <code>range</code>, and <code>pattern</code> to enforce data quality.</p>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className={styles.about}>
      <div className="container">
        <h2>What is Lokryn?</h2>
        <p>
          Lokryn is a compliance‑ready data validation and audit framework. It ensures every dataset is checked
          against explicit contracts, logged in a tamper‑evident chain, and quarantined if invalid — so your
          downstream systems only see trusted data.
        </p>
        <Link className="button button--primary button--lg" to="/docs/intro">
          Learn More in the Docs
        </Link>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Lokryn"
      description="Lokryn is a data validation and audit framework with contracts, profiles, validators, and tamper‑evident logs.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <AboutSection />
      </main>
    </Layout>
  );
}