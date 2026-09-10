# Zurich meets Tanzania

A modern, server-side rendered web platform for the **zurich meets tanzania** association — a non-profit organization supported by hospital staff in Zurich. The website provides information about the main project, subsidiary projects, news, finances, member areas, donation options and more.

The application is built as an **Angular SSR** project and is served by an **Express** backend. It supports, among other things, member management, newsletter functionality, contact forms, donation and payment flows, as well as German-language content and strong SEO metadata.

## Contents

* [About the Project](#about-the-project)
* [Features](#features)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Local Development](#local-development)
* [Build & Start](#build--start)
* [Environment Variables](#environment-variables)
* [Important Routes](#important-routes)
* [External Services](#external-services)
* [Contributing](#contributing)
* [License](#license)

## About the Project

`zurich meets tanzania` is the website of the association of the same name. Its focus is on providing information, communication, and support for work in Tanzania and for the association's activities in Switzerland.

The website provides, among other things:

* Project information and the history of the association
* Blog and news content
* Contact options
* Member and account functionality
* Donation and payment processes
* Financial and association documents
* Redirects and SEO-friendly routes
* SSR for improved loading times and search engine indexing

## Features

* **Angular SSR** for server-side rendering
* **Express backend** as the runtime and API/routing layer
* **Session-based authentication**
* **Protected areas** for logged-in users and admins
* **Redirect handling** for legacy and alternative paths
* **SEO metadata per route**
* **Newsletter and email templates**
* **Donation and payment integration with Stripe**
* **MySQL integration** for persistent data
* **Media and upload support**

## Technology Stack

* **Frontend:** Angular, Angular Router, Angular SSR
* **Backend:** Node.js, Express
* **Styling:** SCSS
* **Database:** MySQL
* **Auth / Sessions:** express-session, bcryptjs
* **Email:** node-mailjet (nodemailer in the future)
* **Payments:** Stripe
* **Uploads / Data Processing:** multer, xlsx
* **Utilities:** dotenv, cors, compression, rxjs

## Project Structure

```text
src/

  app/

    app.component.*         Main app shell, routing, layout, theme/metadata

    app.config.*            Angular client/server configuration

    app.routes.*            Routing configuration

    components/             UI components such as Header, Footer, Banner

    services/               Business and UI services

    middleware/             Express middleware for auth/session

    router/                 Backend router

    shared/                 Shared types and utility logic

    styles/                 Global styles, colors, fonts, layout

    home/                   Home page

    contact/                Contact page

    donate/                 Donation section

    blog/                   Blog/news views

    gallery/                Image gallery

    privacy/                Privacy policy

    imprint/                Legal notice

    membership/             Membership

    login/                  Login

    signup/                 Registration

    password-recovery/      Password reset

    secured/                Protected user areas

    admin/                  Administration area

    ...                     Additional project/content pages

public/

  assets, images, icons, pdfs, backups

dev/

  compose.yaml             Local development services
```

**How it works together:**

`src/main.ts` bootstraps the Angular application in the browser, `src/main.server.ts` starts the same application for SSR, and `src/server.ts` connects Express, sessions, CORS, static assets, redirects, and the Angular Node App Engine renderer. Route-specific metadata and redirects are centrally controlled through `PUBLIC_CONFIG`. This allows content, SEO titles, and legacy URLs to be maintained consistently.

## Prerequisites

The following are required for local development:

* Node.js
* npm
* Docker + Docker Compose
* A MySQL instance
* The required environment variables
* Optional: Stripe CLI for webhooks

## Local Development

The easiest way to get started is through the development setup defined in the project:

```bash
npm install

npm run dev
```

According to `package.json`, the development workflow starts:

* MySQL and other local services via Docker Compose
* Angular Dev Server on port `8080`

If payment flows need to be tested, run the following in a second terminal:

```bash
npm run stripe
```

## Build & Start

```bash
npm install

npm run build

npm start
```

Other useful commands:

```bash
npm test

npm run watch

npm run format

npm run stripe

npm run stop
```

## Environment Variables

The file `src/config.ts` shows which values are required at runtime. These include, among others:

* `ENV`
* `HOST`
* `PORT`
* `ALLOWED_HOSTS`
* `HTTPS_ACTIVE`
* `HTTPS_PORT`
* `HTTPS_CERT_PASSPHRASE`
* `SESSION_SECRET_KEY`
* `MYSQL_HOST`
* `MYSQL_PORT`
* `MYSQL_USER`
* `MYSQL_PW`
* `MYSQL_DB`
* `MAILJET_PUBLIC_KEY`
* `MAILJET_PRIVATE_KEY`
* `ORIGIN`
* `EMAIL_SENDER_ADDRESS`
* `EMAIL_SENDER_NAME`
* `DELIVAPI_URL`
* `DELIVAPI_USER`
* `DELIVAPI_KEY`
* `PASSWORD_*` Account/service passwords
* `EMAIL_*` Account/service addresses
* `TIANJI_*`
* `STRIPE_PRIVATE_KEY`
* `STRIPE_PUBLIC_KEY`
* `STRIPE_PRIVATE_KEY_TEST`
* `STRIPE_PUBLIC_KEY_TEST`
* `STRIPE_ENDPOINT_SECRET`
* `STRIPE_ENDPOINT_SECRET_TEST`
* `STRIPE_PRICE_MEMBERSHIP`
* `STRIPE_PRICE_MEMBERSHIP_TEST`

## Important Routes

The following areas are defined by the project's configuration:

* `/` – Home page
* `/zurich-meets-tanzania` – Main project
* `/bajaji` – Subsidiary project
* `/cardiology`
* `/gynecology`
* `/mbuzi`
* `/meducation`
* `/surgery`
* `/tanzania-meets-zurich`
* `/blog`
* `/archive`
* `/current-team`
* `/donate`
* `/contact`
* `/membership`
* `/login`
* `/signup`
* `/password-recovery`
* `/account`
* `/admin`
* `/privacy`
* `/imprint`
* `/statutes`
* `/vision`
* `/gallery`
* `/general-meeting`
* `/finances`
* `/income-statement`
* `/newsletter/confirm`
* `/newsletter/unsubscribe`
* `/payment-success`
* `/payment-cancelled`

There are also redirects for legacy or alternative URL variants, such as `/zmt`, `/tmz`, `/vorstand`, `/impressum`, `/mitglied-werden`, `/kardiologie`, `/gyno`, and many others.

## External Services

The application integrates with or references several external services:

* **Stripe** for payments and webhooks
* **Mailjet** for email delivery
* **Delivapi** as a separate service in the development setup
* **Tianji** for analytics/tracking
* **Unikat** as a shop redirect
* **Instagram** and **Facebook** for social links

## Contributing

If you want to make changes:

1. Clone the repository
2. Install the dependencies
3. Start the app locally
4. Make changes in `src/`
5. Run the tests and build
6. Open a pull request

Recommended checks:

```bash
npm test

npm run build

npm run format
```

## License

This project is licensed under the **Mozilla Public License 2.0 (MPL-2.0)**.
