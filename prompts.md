# VaultPay Financial Core — Development Prompts & Problem Solving

This document records the main development doubts, debugging questions,
logic discussions, and problem-solving prompts used while developing
VaultPay Financial Core.

---

## 1. Project Architecture

### Doubt
How should the VaultPay application be structured for an Admin and Client
with different permissions?

### Problem Solving
The application was divided into authentication, invoice management,
payment processing, webhook handling, and receipt services.

Admin users manage invoices, while clients can only access invoices
belonging to their own account.

---

## 2. Authentication Logic

### Doubt
Is checking whether a user is logged in on the frontend enough to protect
invoice data?

### Solution
No. Frontend authentication alone cannot provide security.

The backend must verify the JWT on every protected API request and use
the authenticated user's identity when deciding whether the requested
resource can be accessed.

---

## 3. IDOR Security

### Doubt
What happens if Client A changes the invoice ID in the API request and
tries to access Client B's invoice?

### Solution
The backend must perform an ownership check.

The invoice ID cannot be trusted simply because the user is authenticated.
The server must verify that the requested invoice belongs to the logged-in
client.

If it belongs to another client, the API returns:

`403 Forbidden`

### Testing
A different client's invoice ID was requested using a valid client JWT.

### Result
The API correctly returned:

`Forbidden: You do not have access to this invoice`

This confirmed that IDOR protection was working.

---

## 4. Why Frontend Restrictions Are Not Enough

### Doubt
If the frontend only displays invoices belonging to the logged-in client,
is that enough for security?

### Solution
No.

A malicious user can bypass the frontend and directly call the API.

Therefore, authorization and ownership validation must always happen on
the backend.

---

## 5. Client Invoice Access

### Doubt
How should a client access an invoice without exposing invoices belonging
to other clients?

### Solution
The authenticated user's identity is used by the backend to determine
which invoices can be returned.

The frontend is responsible for displaying the permitted data, while the
backend is responsible for enforcing access control.

---

## 6. Invoice View Redirecting to Login

### Problem
Clicking the View button from the Client Dashboard redirected the user
back to the Login page.

### Investigation
The issue was traced to the frontend route/protection flow.

The invoice details page needed to receive the authenticated session
correctly instead of treating the user as unauthenticated.

### Result
The client could open the invoice details page successfully after clicking
View.

---

## 7. Stripe Payment Flow

### Doubt
What should happen after a client clicks Pay Now?

### Logic
The expected flow was:

Client Invoice
→ Pay Now
→ Stripe Checkout
→ Payment
→ Stripe Webhook
→ Verify Payment
→ Mark Invoice Paid

The frontend should not directly mark the invoice as paid.

---

## 8. Why Stripe Webhooks Are Required

### Doubt
Why can't the frontend simply tell the backend that the payment succeeded?

### Solution
The frontend cannot be trusted.

A user could modify the frontend request and attempt to mark an unpaid
invoice as paid.

Stripe's server-to-server webhook provides an independent payment
confirmation.

Therefore, the webhook becomes the source of truth for payment status.

---

## 9. Stripe Webhook Signature Verification

### Doubt
How can the application know that a webhook request really came from
Stripe?

### Solution
The webhook request must be verified using Stripe's cryptographic
signature verification mechanism.

If signature verification fails, the webhook request is rejected.

This prevents unauthorized requests from pretending to be Stripe.

---

## 10. Raw Body Webhook Error

### Doubt
Why does Stripe webhook signature verification require the raw request body?

### Solution
Stripe signs the original request payload.

If Express parses the body into JSON before signature verification,
the original payload can change and signature verification can fail.

Therefore, the Stripe webhook route must receive the raw request body
before the application's normal JSON parser processes requests.

---

## 11. Webhook Route Order

### Doubt
Why does the webhook route need to be registered before `express.json()`?

### Solution
The Stripe webhook needs the original raw body.

If `express.json()` processes the request first, the webhook may no longer
have the raw payload required for signature verification.

---

## 12. Duplicate Stripe Events

### Doubt
What happens if Stripe sends the same webhook event more than once?

### Solution
Webhook processing must be idempotent.

Stripe event IDs are stored in the database.

Before processing an event, the application checks whether that event ID
has already been processed.

If it already exists, the event is ignored instead of processing the
payment again.

---

## 13. Invoice Already Paid

### Doubt
What happens if a successful payment webhook is received for an invoice
that is already marked as paid?

### Solution
The webhook checks the current invoice status.

If the invoice is already paid, another payment update is not performed.

This prevents unnecessary duplicate processing.

---

## 14. Payment Status Verification

### Doubt
Is receiving `checkout.session.completed` alone enough to mark an invoice
as paid?

### Solution
The checkout session's payment status must also be checked.

The invoice should only be marked as paid when Stripe confirms that the
payment was actually successful.

---

## 15. Failed Payment Logic

### Doubt
What should happen when a Stripe payment fails?

### Solution
The invoice must remain unpaid.

The application keeps the invoice in a pending state and stores the
relevant Stripe PaymentIntent information for tracking.

A failed payment must never change the invoice to paid.

---

## 16. PDF Receipt Generation

### Doubt
When should the payment receipt PDF be generated?

### Solution
The receipt should only be generated after the verified Stripe webhook
confirms a successful payment.

The sequence is:

Verified Payment
→ Invoice Paid
→ Generate Receipt
→ Send Receipt

---

## 17. PDF Testing Problem

### Problem
When opening the generated PDF inside VS Code, the file initially appeared
as unreadable `%PDF` and compressed data.

### Investigation
The file itself was not necessarily corrupted.

VS Code was treating the PDF as a text/binary file instead of displaying it
as a PDF document.

### Result
Opening the generated file with a proper PDF viewer confirmed that the
receipt was generated successfully.

---

## 18. Email Service Error

### Problem
The webhook successfully generated the PDF but email delivery failed with:

`sendInvoiceReceiptEmail is not a function`

### Investigation
The function name imported by the webhook controller did not match the
function exported by the email service.

### Solution
The import/export naming was made consistent between the webhook controller
and email service.

### Result
The email service could be called successfully.

---

## 19. Gmail Authentication Error

### Problem
Email sending failed with:

`Missing credentials for "PLAIN"`

### Investigation
The SMTP transporter could not find the required email credentials from
the environment variables.

### Solution
The email environment variables were configured correctly.

A Gmail App Password was used instead of the normal Gmail account password.

---

## 20. Testing Gmail SMTP

### Doubt
How can the email system be tested separately from Stripe?

### Solution
A separate email test was performed using Nodemailer.

The test verified:

- Gmail SMTP connection
- Authentication
- Email sending
- Message ID generation

### Result
The SMTP connection and test email were successful.

This confirmed that the email configuration itself was working.

---

## 21. Email Receipt Not Arriving

### Doubt
If the backend says the email was sent successfully, why might the client
not immediately see it?

### Investigation
The email service was tested independently first.

After successful SMTP testing, the complete Stripe → Webhook → PDF → Email
flow was tested again.

### Result
The backend successfully reported:

`Receipt email sent successfully`

and the receipt was delivered to the configured client email address.

---

## 22. Environment Variables

### Doubt
Should real Gmail and Stripe credentials be written directly inside the
source code?

### Solution
No.

Sensitive credentials must be stored in environment variables.

The `.env` file must not be committed to the Git repository.

---

## 23. Currency Selection Problem

### Problem
The frontend allowed the administrator to select different currencies,
but the created invoice continued to use USD.

### Investigation
The selected currency existed in the React form state but was not included
in the invoice data sent to the backend.

### Solution
The selected currency must be included in the request payload and accepted
by the backend invoice creation logic.

### Lesson
A value displayed and changed in the UI is not automatically sent to the
server. The complete data flow must be checked:

UI
→ State
→ Request Payload
→ Backend
→ Database
→ Stripe

---

## 24. Client Registration

### Doubt
How can a new client be added to VaultPay?

### Logic
A new user must register through the authentication system with the
appropriate client role.

After registration, the client can log in and access only the invoices
assigned to that account.

---

## 25. Payment Status Not Updating

### Problem
A new client completed a Stripe test payment, but the invoice still
showed as pending.

### Investigation
The first step was checking the backend webhook terminal.

If no webhook event appears, the issue is likely with Stripe webhook
delivery or configuration.

If the webhook appears but the invoice remains pending, the next checks
are:

- Webhook signature verification
- Invoice ID in Stripe metadata
- Payment status
- Invoice lookup
- Invoice update
- Database save

### Lesson
When a payment-related UI value is incorrect, debug the complete backend
event flow rather than changing the frontend status manually.

---

## 26. Stripe Test Events

### Observation
Stripe sends multiple events during a payment, including events such as
payment intent and charge events.

### Doubt
Does every Stripe event need to be processed?

### Solution
No.

The application only needs to process the events required by the
application's payment logic.

Other events can safely be logged as unhandled while still returning a
successful webhook response when appropriate.

---

## 27. Final Payment Flow Verification

### Test

A complete payment was performed using a client account.

### Expected Flow

```text
Client Login
    ↓
Client Dashboard
    ↓
Invoice Details
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
Payment Verification
    ↓
Invoice Marked Paid
    ↓
PDF Receipt Generated
    ↓
Receipt Email Sent