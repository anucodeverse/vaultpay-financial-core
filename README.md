# VaultPay Financial Core

VaultPay Financial Core is a secure full-stack invoice and payment management application.

It allows administrators to create and manage invoices, while clients can securely view their invoices and make payments through Stripe.

The project focuses on:

* Zero-Trust API security
* IDOR prevention
* Stripe payments
* Secure Stripe Webhooks
* Automated PDF receipt generation
* Automated email delivery

## Project

* **Project Name:** VaultPay Financial Core
* **Internship:** Prodesk IT
* **Track:** Track B – Fullstack Engineers
* **Focus:** Node.js / Express / Stripe / Security

## Features

### Authentication & Authorization

* JWT-based authentication
* Admin and Client roles
* Role-based authorization
* Protected API routes
* Protected frontend routes

### Invoice Management

* Admin can create invoices
* Admin can view all invoices
* Clients can view their own invoices
* Invoice ownership verification
* Invoice status tracking

### Stripe Payments

* Stripe Checkout integration
* Secure payment processing
* Stripe Webhook integration
* Payment verification
* Automatic invoice status update

### Security

* Zero-Trust API architecture
* IDOR prevention
* JWT verification
* Backend ownership validation
* Stripe webhook signature verification
* Duplicate webhook protection

### Automated Receipt

* PDF receipt generation
* Automatic receipt storage
* Email delivery using Nodemailer
* PDF attachment in email

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT

### Payment & Services

* Stripe
* Stripe Webhooks
* PDFKit
* Nodemailer

### Tools

* VS Code
* Git
* GitHub
* Postman
* Stripe CLI
* MongoDB Atlas

## Project Structure

```text
vaultpay-financial-core/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── receipts/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── README.md
└── PROMPTS.md
```

## Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
EMAIL_USER=your_email
EMAIL_PASS=your_gmail_app_password
```

> Never commit your `.env` file or secret keys to GitHub.

## Stripe Webhook

For local development, run Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

### Payment Flow

```text
Client
   ↓
View Invoice
   ↓
Pay Now
   ↓
Stripe Checkout
   ↓
Successful Payment
   ↓
Stripe Webhook
   ↓
Signature Verification
   ↓
Invoice → PAID
   ↓
Generate PDF Receipt
   ↓
Send Email
```

## Security

VaultPay follows a **Zero-Trust API** approach.

Every protected invoice request verifies:

1. JWT authentication
2. User role
3. Invoice ownership

### IDOR Prevention Example

```text
Client A
   ↓
GET /api/invoices/456
   ↓
JWT Verification
   ↓
Ownership Check
   ↓
Invoice belongs to Client B
   ↓
403 Forbidden
```

The backend does not trust invoice IDs received from the frontend. It verifies that the authenticated client actually owns the requested invoice.

## Automated PDF Receipt & Email

After a successful payment:

```text
Stripe Webhook
      ↓
Invoice marked as PAID
      ↓
PDF Receipt Generated
      ↓
PDF saved
      ↓
Email sent
      ↓
Client receives receipt
```

## Track B Requirements

| Requirement                    | Status      |
| ------------------------------ | ----------- |
| JWT Authentication             | ✅ Completed |
| Zero-Trust API                 | ✅ Completed |
| IDOR Prevention                | ✅ Completed |
| Stripe Checkout                | ✅ Completed |
| Stripe Webhooks                | ✅ Completed |
| Webhook Signature Verification | ✅ Completed |
| Payment Verification           | ✅ Completed |
| Duplicate Webhook Protection   | ✅ Completed |
| PDF Receipt Generation         | ✅ Completed |
| Email Receipt Delivery         | ✅ Completed |

## Testing

The application was tested for:

* User registration and login
* Admin invoice creation
* Client invoice access
* IDOR protection
* Stripe test payments
* Stripe webhook processing
* Invoice status update
* PDF receipt generation
* Email receipt delivery

## Git Ignore

Never commit `.env` or generated receipt files to GitHub.

Add the following to `.gitignore`:

```gitignore
node_modules/
.env
receipts/
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/anucodeverse/vaultpay-financial-core
cd vaultpay-financial-core
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create the `.env` file and add the required MongoDB, JWT, Stripe, and email configuration.

### 4. Start the Backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

The frontend will run on the Vite development server.

## API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Invoices

```text
POST /api/invoices
GET  /api/invoices
GET  /api/invoices/:id
```

### Payments

```text
POST /api/payments/create-checkout-session
```

### Webhooks

```text
POST /api/webhooks/stripe
```

## Application Flow

```text
Admin
  ↓
Login
  ↓
Create Invoice
  ↓
Invoice Stored in MongoDB
  ↓
Client Login
  ↓
View Own Invoice
  ↓
Pay with Stripe
  ↓
Stripe Checkout
  ↓
Stripe Webhook
  ↓
Verify Signature
  ↓
Verify Payment
  ↓
Mark Invoice as PAID
  ↓
Generate PDF Receipt
  ↓
Send Receipt Email
```

## Security Principles

VaultPay implements the following security principles:

* Authentication before protected operations
* Role-based authorization
* Backend ownership validation
* Zero-Trust API design
* IDOR protection
* Stripe webhook signature verification
* Duplicate webhook protection
* Secrets stored in environment variables
* No sensitive payment information stored directly in the application

## Author

**VaultPay Financial Core**

Developed as part of the **Prodesk IT Full Stack Developer Internship – Track B**.

### Focus Areas

* Node.js
* Express.js
* React
* MongoDB
* Stripe
* Webhooks
* API Security
* PDF Generation
* Email Automation
