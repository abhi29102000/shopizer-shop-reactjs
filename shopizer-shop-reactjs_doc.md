# Shopizer Shop React.js — Documentation

## Overview

This is the React.js storefront/shop frontend for the **Shopizer** open-source e-commerce platform. It provides a customer-facing shopping experience that communicates with the Shopizer Java backend via REST APIs. The project is built with Create React App (react-scripts 4.x) and uses Redux for state management.

**Version:** 3.0.0

---

## Technical Perspective

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 16.x (functional components with hooks) |
| State Management | Redux 4 + Redux Thunk (async actions) |
| Routing | React Router DOM 5.x (BrowserRouter, Switch/Route) |
| HTTP Client | Axios 0.21 with interceptors for auth tokens |
| Styling | SCSS/Sass, Bootstrap 4.5, React Bootstrap 1.0 |
| Payment | Stripe (@stripe/react-stripe-js, @stripe/stripe-js), Nuvei (script-loaded) |
| Forms | React Hook Form 6.x |
| i18n | redux-multilanguage (English, French) |
| Build Tool | react-scripts 4.x (Webpack, Babel under the hood) |
| Dev Tools | redux-devtools-extension, Sass compiler |
| Containerization | Docker (multi-stage: Node 13 build → Nginx Alpine) |
| CI/CD | CircleCI (.circleci/config.yml) |

### Architecture

The application follows a component-wrapper-page architecture:

```
src/
├── index.js              # Redux store creation, app entry point
├── App.js                # Router definition, all routes
├── layouts/Layout.js     # Shared layout (Header + children + Footer)
├── pages/                # Route-level page components
│   ├── home/
│   ├── category/
│   ├── product-details/
│   ├── search-product/
│   ├── content/
│   └── other/            # Cart, Checkout, MyAccount, Login, etc.
├── components/           # Reusable presentational components
│   ├── header/           # Logo, NavMenu, IconGroup, MobileMenu, HeaderTop
│   ├── product/          # ProductGridSingle, ProductModal, ShopCategories, etc.
│   ├── footer/           # FooterCopyright, FooterNewsletter
│   ├── hero-slider/
│   ├── feature-icon/
│   ├── newsletter/
│   ├── loader/
│   ├── consent/          # Cookie consent banner
│   ├── contact/
│   ├── promos/
│   └── section-title/
├── wrappers/             # Container components connecting Redux to presentational components
│   ├── header/Header.js
│   ├── footer/Footer.js
│   ├── product/          # TabProduct, ProductGrid, ShopSidebar, ShopTopbar, etc.
│   ├── hero-slider/
│   ├── breadcrumb/
│   ├── newsletter/
│   ├── promos/
│   └── feature-icon/
├── redux/
│   ├── actions/          # cartActions, userAction, productActions, storeAction, etc.
│   └── reducers/         # rootReducer combining 7 sub-reducers
├── util/
│   ├── webService.js     # Axios wrapper (WebService class with interceptors)
│   ├── constant.js       # API endpoint path constants
│   └── helper.js         # localStorage utilities, validation helpers
├── helpers/product.js    # Product filtering, sorting, discount calculation
├── translations/         # english.json, french.json
├── data/                 # Static JSON data (hero sliders, feature icons)
└── assets/               # SCSS stylesheets, fonts (FontAwesome, Pe-icon-7-stroke)
```

### Redux State Management

The Redux store is created in `index.js` with `redux-thunk` middleware for async API calls and `redux-localstorage-simple` for state persistence to localStorage.

**Root Reducer slices:**

| Slice | Reducer | Purpose |
|---|---|---|
| `multilanguage` | redux-multilanguage | Current language code and translations |
| `productData` | productReducer | Products list, active product ID, active category ID |
| `merchantData` | storeReducer | Merchant/store info and default store code |
| `cartData` | cartReducer | Cart items, cart ID (cookie-synced), cart count, order ID |
| `loading` | loaderReducer | Global loading spinner state |
| `userData` | userReducer | User profile, countries, shipping countries, states, current address |
| `content` | contentReducer | Active CMS content page ID |

### API Integration

All API calls go through `src/util/webService.js`, an Axios-based service class with:
- Base URL constructed from `window._env_.APP_BASE_URL + window._env_.APP_API_VERSION` (default: `http://localhost:8080/api/v1/`)
- Request interceptor that attaches JWT Bearer token from localStorage
- Response interceptor for 401/404 error handling
- Methods: `get`, `post`, `put`, `delete`, `patch`

**API endpoint constants** are defined in `src/util/constant.js` covering: store, category, content, products, cart, customer, auth, shipping, country, zones, orders, newsletter, checkout, password reset, search, and more.

**Key API flows:**
- Cart operations use cookie-based cart ID (`{MERCHANT}_shopizer_cart`) synced between cookies and Redux
- Authentication stores JWT token in localStorage under key `token`
- Product listing fetches from `products/group/FEATURED_ITEM` endpoint
- Category browsing, product search, and checkout all call the Shopizer REST API

### Routing

Defined in `App.js` using React Router v5 with lazy-loaded pages:

| Route | Component | Description |
|---|---|---|
| `/` | Home | Landing page with hero slider, promos, featured products, newsletter |
| `/category/:id` | Category | Product listing by category with sidebar filters |
| `/product/:id` | ProductDetail | Product detail with image gallery, description, add-to-cart |
| `/content/:id` | Content | CMS content pages |
| `/search/:id` | SearchProduct | Product search results |
| `/contact` | Contact | Contact page with Google Maps |
| `/my-account` | MyAccount | User dashboard (profile, addresses, orders, password change) |
| `/login`, `/register` | LoginRegister | Login and registration tabs |
| `/forgot-password` | ForgotPassword | Password recovery |
| `/customer/:code/reset/:id` | ResetPassword | Password reset with token |
| `/cart` | Cart | Shopping cart with quantity management |
| `/checkout` | Checkout | Billing/shipping forms, payment (Stripe/Nuvei) |
| `/order-confirm` | OrderConfirm | Order confirmation page |
| `/recent-order` | RecentOrder | Recent orders list |
| `/order-details/:id` | OrderDetails | Individual order detail view |
| `/not-found` | NotFound | 404 page |

All routes use `React.lazy()` and `Suspense` for code splitting.

### Build System & Configuration

- **Build:** `npm run build` (react-scripts build, outputs to `build/`)
- **Dev:** `npm start` or `npm run dev` (react-scripts start)
- **Integration:** `npm run intergartion` — runs `env.sh` to generate `env-config.js` from environment variables, then starts dev server

**Environment configuration** uses a runtime config pattern (`window._env_`) loaded from `env-config.js` in `public/`, allowing config changes without rebuilding:

| Variable | Default | Purpose |
|---|---|---|
| `APP_BASE_URL` | `http://localhost:8080` | Shopizer backend API URL |
| `APP_API_VERSION` | `/api/v1/` | API version path |
| `APP_MERCHANT` | `DEFAULT` | Merchant/store code |
| `APP_PRODUCT_GRID_LIMIT` | `15` | Products per page |
| `APP_PAYMENT_TYPE` | `STRIPE` | Payment gateway (STRIPE or NUVEI) |
| `APP_STRIPE_KEY` | (empty) | Stripe publishable key |
| `APP_NUVEI_TERMINAL_ID` | (empty) | Nuvei terminal ID |
| `APP_NUVEI_SECRET` | (empty) | Nuvei secret |
| `APP_MAP_API_KEY` | (empty) | Google Maps API key |
| `APP_THEME_COLOR` | `#D1D1D1` | Theme accent color (CSS custom property) |

**Docker deployment:** Multi-stage Dockerfile builds with Node 13 Alpine, then serves via Nginx Alpine. The `env.sh` script runs at container startup to inject environment variables into `env-config.js`.

### Key Dependencies

- **UI:** react-bootstrap, animate.css, swiper/react-id-swiper, react-lightgallery, react-modal-video
- **UX:** react-toast-notifications, react-bootstrap-sweetalert, react-spinners, react-sticky-el, react-scroll, react-countdown-now, react-countup
- **Forms:** react-hook-form
- **Maps:** google-maps-react, react-geocode
- **Auth/Security:** js-sha512, universal-cookie, react-idle-timer (30-min session timeout)
- **SEO:** react-meta-tags
- **Navigation:** react-breadcrumbs-dynamic, react-paginate
- **Printing:** react-to-print
- **Consent:** react-cookie-consent

---

## Functional Perspective

### Storefront / Home Page

- Hero image slider (Swiper-based) with configurable slides from JSON data
- Promotional banners section
- Featured products displayed in category tabs (fetched from `FEATURED_ITEM` product group API)
- Newsletter subscription form
- Dynamic merchant name in page title from store API
- Cookie consent banner

### Product Browsing

- **Category pages** (`/category/:id`): Product grid/list view with sidebar filters for categories, manufacturers, sizes, colors, and tags
- **Product grid controls:** Sort by price (high-to-low, low-to-high), toggle grid/list layout, pagination (react-paginate)
- **Product cards:** Display product image, name, price (with discount/original price), star ratings, quick-view modal, and add-to-cart button
- **Product quick view modal:** Full product details in a modal overlay without navigating away
- **Product search** (`/search/:id`): Search results page with autocomplete support

### Product Details

- Image gallery with thumbnail navigation (react-id-swiper, react-lightgallery for zoom)
- Product description, pricing (original + discounted), stock status
- Product variant selection (size, color, and custom options)
- Quantity selector with add-to-cart
- Product description tabs (additional info, reviews)
- Related products slider

### Shopping Cart

- Add/remove items with quantity management
- Cart persisted via cookies and Redux localStorage sync
- Cart ID cookie (`{MERCHANT}_shopizer_cart`) with 6-month expiry
- Mini cart dropdown in header (MenuCart sub-component) showing items and totals
- Full cart page (`/cart`) with line items, quantities, subtotals, and cart total
- Server-side cart management — all cart operations (add, update, delete) call the Shopizer API

### Checkout

- Multi-section checkout form with billing and shipping address fields
- Country and state/zone dropdowns populated from API
- Separate shipping address support
- **Payment integration:**
  - **Stripe:** Card element embedded via @stripe/react-stripe-js
  - **Nuvei:** Script-loaded payment form
  - Payment type configurable via `APP_PAYMENT_TYPE` environment variable
- Order total calculation via API
- Order confirmation page after successful checkout
- Form validation via react-hook-form

### User Account Management

- **Registration:** Email, password (with strength validation — min 8 chars, number, special char), first/last name, country/state selection
- **Login:** Email/password authentication, JWT token stored in localStorage
- **Session management:** 30-minute idle timeout via react-idle-timer, auto-logout
- **My Account dashboard** (`/my-account`): Accordion-based sections for:
  - Profile information editing
  - Billing address management
  - Shipping address management
  - Password change
- **Password recovery:** Forgot password flow with email-based reset link (`/forgot-password` → `/customer/:code/reset/:id`)

### Order Management

- **Recent orders** (`/recent-order`): List of past orders
- **Order details** (`/order-details/:id`): Full order breakdown with line items, totals, and status
- Print order support (react-to-print)

### Multi-language Support

- English and French translations via redux-multilanguage
- Translation files in `src/translations/` (english.json, french.json)
- Language-aware API calls (pass `lang` parameter)

### Contact Page

- Contact form
- Google Maps integration (google-maps-react) with geocoding (react-geocode)
- Store location display

### CMS Content

- Dynamic content pages (`/content/:id`) fetched from Shopizer CMS API
- Supports pages and content boxes

### Header & Navigation

- Responsive header with logo, navigation menu, and icon group (search, user account, cart)
- Mobile menu (hamburger) with offcanvas navigation
- Header top bar (configurable visibility)
- Search functionality with product search integration
- Cart count badge on cart icon
- User login/logout state reflected in header

### Footer

- Multi-column footer with newsletter subscription
- Copyright section
- Configurable background color and spacing

### Additional Features

- Global loading spinner overlay (Redux-controlled)
- Cookie consent banner (react-cookie-consent)
- Breadcrumb navigation (react-breadcrumbs-dynamic)
- SEO meta tags per page (react-meta-tags)
- Scroll-to-top on route change
- 404 Not Found page
- Theming via CSS custom property (`--theme-color`) set from environment config
- IE11 support (react-app-polyfill)
- Service worker support (currently unregistered)
