---
id: dispatch-index
title: Dispatch
slug: /dispatch
sidebar_position: 0
---

Our Dispatch product is a real-time notification component you can drop into any website to send in-app messages and track user interactions.

## 1. Admin Setup: Activation

Before you can use the Dispatch component, you must activate it in your Lokryn Control Room to generate your organization's API Key.

1.  Log in to your Control Room dashboard.
2.  Find the **Dispatch** product card.
3.  Click **"Activate Free Tier"**.
4.  After activation, navigate to the **Account** page (by clicking your email in the top-right).
5.  Click the **"Product Settings"** tab.

## 2. Admin Setup: Configuration

Once activated, you must configure your API Key's security settings.

1.  On the "Product Settings" page, select **"Dispatch Settings"** from the side menu.
2.  You will see your **Publishable Dispatch Token (API Key)**. Click **Copy** and store this key securely. You will need it for your website's configuration.
3.  In the **"Allowed Domains (CORS)"** section, enter the full domains where your website component will be running. This is a critical security step.
    * **Production Example:** `https://www.mywebsite.com`
    * **Local Development Example:** `http://localhost:3000`
4.  Click **"Save Domains"**. Your API key will now only accept requests from these domains.

## 3. Component Installation (In Your Website)

Install the component into your React application using your package manager:

```bash
npm install @developyr/lokryn-dispatch
````

## 4\. Component Usage

Import the component and render it anywhere in your application. It is a "fixed" component that will float in the bottom-right corner.

Provide the `apiKey` you copied from the admin panel and the `group` you want this user to receive notifications for.

```jsx
import React from 'react';
import { DispatchNotifications } from '@developyr/lokryn-dispatch';

function App() {
  // Get these values from your application's state or environment
  const API_KEY = "YOUR_PUBLISHABLE_API_KEY_GOES_HERE";
  const USER_ID = "current_user_database_id_123"; // Optional: User's unique ID
  const USER_GROUP = "all"; // The target group you want to fetch

  return (
    <div className="App">
      {/* Your application's layout */}
      <header>...</header>
      
      {/* Render the component anywhere. It will position itself. */}
      <DispatchNotifications
        apiKey={API_KEY}
        group={USER_GROUP}
        userId={USER_ID}
        apiBaseUrl="[https://api-test.lokryn.com](https://api-test.lokryn.com)" // Your API endpoint
      />
    </div>
  );
}
```

## 5\. Sending Events (Backend API)

You can automatically send a notification (e.g., "Payment Received") by making a `POST` request from your backend to our event-tracking endpoint.

