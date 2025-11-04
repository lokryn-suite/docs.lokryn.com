---
id: dispatch-getting-started
title: Getting Started
slug: /dispatch/getting-started
sidebar_position: 1
---

# Getting Started with Dispatch

This guide covers the one-time admin setup and the developer installation for the Dispatch component.

## Step 1 (Admin): Activate Dispatch

Before you can use the Dispatch component, you must activate it in your Lokryn Control Room to generate your API Key.

1.  Log in to your Control Room dashboard.
2.  Find the **Dispatch** product card.
3.  Click **"Activate Free Tier"**. This creates a "free" subscription record for your organization.
4.  After activation, navigate to the **Account** page (by clicking your email in the top-right).
5.  Click the **"Product Settings"** tab.

## Step 2 (Admin): Configure API Key

Once activated, you must configure your API Key's security settings.

1.  On the "Product Settings" page, select **"Dispatch"** from the side menu.
2.  You will see your **Publishable Dispatch Token (API Key)**. Click **Copy** and store this key securely.
3.  In the **"Allowed Domains (CORS)"** section, enter the full domains where your component will be running. This is a critical security step.
    * **Production:** `https://www.mywebsite.com`
    * **Local Dev:** `http://localhost:3000`
4.  Click **"Save Domains"**.

## Step 3 (Developer): Installation

Install the component into your React application:

```bash
npm install @developyr/lokryn-dispatch
````

## Step 4 (Developer): Basic Usage

Import the component and render it in your application, typically in your main header.

```jsx
import React from 'react';
import { DispatchNotifications } from '@developyr/lokryn-dispatch';

// Assuming you have a way to get the current user and their org ID
const myUser = {
  id: "cognito-user-sub-12345",
  organizationId: "35" // Your internal Organization ID
};

function MyHeader() {
  const API_KEY = "YOUR_PUBLISHABLE_API_KEY_GOES_HERE";
  const API_URL = "[https://api.lokryn.com](https://api.lokryn.com)"; // Your deployed API URL
  
  return (
    <nav>
      {/* ... your other nav items ... */}
      
      <DispatchNotifications
        apiKey={API_KEY}
        apiBaseUrl={API_URL}
        group={myUser.organizationId}
        userId={myUser.id}
      />
    </nav>
  );
}
```
