import React from 'react';
import {Redirect} from '@docusaurus/router';

export default function Home() {
  // Redirect to your "Get Started" page
  return <Redirect to="/docs/control-room/quickstart" />;
}