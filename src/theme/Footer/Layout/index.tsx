import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/Footer/Layout';

export default function FooterLayout({
  copyright,
}: Props): ReactNode {
  if (!copyright) {
    return null;
  }

  return (
    <footer
      className={clsx('footer')}
      style={{
        backgroundColor: 'var(--color-brand-dark)',
        color: '#fff',
        padding: '0.75rem 0', // very slim bar
        textAlign: 'center',
      }}>
      <div className="container container-fluid">
        <small style={{opacity: 0.8, fontSize: '0.85rem'}}>
          {copyright}
        </small>
      </div>
    </footer>
  );
}
