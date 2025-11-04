---
id: dispatch-reference
title: API & Styling Reference
slug: /dispatch/reference
sidebar_position: 2
---

# API & Styling Reference

This is a detailed reference for all component props, custom styling keys, and conceptual logic for the Dispatch component.

## Component Props

  * **`apiKey`** (string, required): The Publishable Dispatch Token you copied from the admin panel.
  * **`group`** (string, required): The primary group this user belongs to (e.g., `organizationId`). The component will fetch notifications for this group *and* the global `"all"` group.
  * **`userId`** (string, required): A unique, stable identifier for the currently logged-in user (e.g., a database ID or a Cognito `sub`). This is **required** to track "read" or "dismissed" notifications.
  * **`apiBaseUrl`** (string, optional): The public URL of your deployed API. Defaults to `https://api.lokryn.com`.
  * **`styleOverrides`** (object, optional): An object containing `React.CSSProperties` to override default styles. See "Custom Styling" below.

## Custom Styling

You can pass a `styleOverrides` prop to customize the look and feel.

```jsx
const myStyles = {
  bellButton: { color: 'blue' },
  badge: { backgroundColor: 'orange' },
  modalContentList: { width: '400px' },
};

<DispatchNotifications
  {...props}
  styleOverrides={myStyles}
/>
````

### Overrideable Keys

  * `bellWrapper`
  * `bellButton`
  * `badge`
  * `modalOverlay`
  * `modalContentList` (The list dropdown)
  * `modalHeader`
  * `closeButton`
  * `backButton`
  * `emptyState`
  * `notificationItemClickable`
  * `listItemTitle`
  * `listItemMessage`
  * `detailModalCard` (The detail modal)
  * `detailModalHeader`
  * `detailModalTitle`
  * `detailModalBody`
  * `detailModalHeroImage`
  * `detailModalMessage`
  * `detailModalCustomFields`
  * `detailModalFooter`
  * `detailFooterText`
  * `signatureContainer`
  * `signatureLabel`
  * `signatureInput`
  * `signatureCheckboxLabel`
  * `signatureCheckbox`
  * `actionButton` (The "Dismiss" button)
  * `actionButtonPrimary` (The "Accept" button)

## How the Component Works

1.  **Bell Icon:** The component renders as a bell icon.
2.  **Badge Count:** On load, it fetches all notifications for the user's `group` and `"all"`. It queries your backend to see which ones the `userId` has already interacted with. The badge displays the count of **unread** notifications.
3.  **List Modal:** Clicking the bell opens a dropdown list of all notifications, with "read" items grayed out.
4.  **"Read" Event:** Clicking a notification in the list marks it as "read" (a billable event) and opens the Detail Modal.
5.  **Detail Modal:** A centered modal appears, showing the full content.
6.  **Action Event:** Clicking "Accept," "Decline," or "Dismiss" in the detail modal sends the corresponding event (a billable event) and closes the modal.

