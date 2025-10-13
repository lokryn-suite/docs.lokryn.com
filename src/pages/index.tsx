import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function DocsHero() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Lokryn Documentation
        </Heading>
        <p className="hero__subtitle">
          Everything you need to build with Flight Recorder, Pipe Audit, Gatehouse, and Redeliver.
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx('button button--lg', styles.getStartedButton)}
            to="/docs/control-room/quickstart"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}


function QuickstartTiles() {
  return (
    <section className={styles.tiles}>
      <div className="container">
        <div className="row">
          <div className="col col--3">
            <h3>Flight Recorder</h3>
            <p>Compliance‑ready logs with no per‑GB surprises.</p>
            <Link to="/docs/flight-recorder/intro">Read Docs →</Link>
          </div>
          <div className="col col--3">
            <h3>Pipe Audit</h3>
            <p>Trace every event through your pipeline with confidence.</p>
            <Link to="/docs/pipe-audit/intro">Read Docs →</Link>
          </div>
          <div className="col col--3">
            <h3>Gatehouse</h3>
            <p>Transparent, developer‑friendly policy enforcement.</p>
            <Link to="/docs/gatehouse/intro">Read Docs →</Link>
          </div>
          <div className="col col--3">
            <h3>Redeliver</h3>
            <p>Reliable retries and delivery guarantees, built‑in.</p>
            <Link to="/docs/redeliver/intro">Read Docs →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function GuidesByRole() {
  return (
    <section className={styles.guides}>
      <div className="container">
        <h2>Guides by role</h2>
        <div className="row">
          <div className="col col--4">
            <div className={styles.roleCard}>
              <h4 className={styles.roleTitle}>Developers</h4>
              <p className={styles.roleText}>SDKs, APIs, and integration examples.</p>
              <Link className={styles.roleLink} to="/docs/developer/overview">
                Start Coding →
              </Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.roleCard}>
              <h4 className={styles.roleTitle}>Compliance teams</h4>
              <p className={styles.roleText}>Audit workflows, reporting, and controls.</p>
              <Link className={styles.roleLink} to="/docs/compliance/overview">
                Explore Compliance →
              </Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.roleCard}>
              <h4 className={styles.roleTitle}>Operators</h4>
              <p className={styles.roleText}>Deployment, scaling, and observability.</p>
              <Link className={styles.roleLink} to="/docs/operators/overview">
                Ops Docs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


export default function Home(): ReactNode {
  return (
    <Layout
      title="Lokryn Docs"
      description="Documentation for Flight Recorder, Pipe Audit, Gatehouse, and Redeliver.">
      <DocsHero />
      <main>
        <QuickstartTiles />
        <GuidesByRole />
      </main>
    </Layout>
  );
}
