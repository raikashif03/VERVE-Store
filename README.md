# VERVE Storefront — Premier Digital Marketplace & Order Experience

A production-grade direct-to-consumer e-commerce platform and marketplace inspired by Daraz and Shopify, engineered with clean modern typography, zero-compromise design standards, advanced faceted filtering, multi-channel payment integration, real-time courier GPS tracking, and a sleek client dashboard.

---

## 🌟 Key Features

### 1. Responsive Curated Product Catalog
- **Category Taxonomy**: Audio & Acoustics, Horology & Timepieces, Home & Precision Brew, Everyday Carry, and Technical Apparel.
- **Micro-Interactions**: Hover lift, image zoom preview, quick add to bag, and instant wishlist bookmarking.
- **Contiguous Purchase Module (PDP)**: Product modal with image gallery thumbnails, color finish swatches, dimension selectors, quantity steppers, technical specification sheets, and verified customer reviews.

### 2. Advanced Faceted Filters & Instant Search
- **Instant Live Search**: Real-time matching across product names, atelier brands, and category tags.
- **Faceted Attributes**: Dynamic price range slider ($50–$1500), atelier brand selectors, minimum star rating filters (4.5★, 4.7★, 4.9★), "Free Express Shipping" toggle, and "In Stock Only" toggle.
- **Multi-criteria Sorting**: Featured curations, Price (Low to High), Price (High to Low), Customer Rating, and Newest Arrivals.

### 3. Secure Multi-Method Checkout
- **256-Bit Escrow & Tokenization**: Stripe-style card input with automated card brand detection (Visa, Mastercard, American Express), formatting masks, and simulated 3D Secure verification.
- **Cash on Delivery (COD)**: Transparent payment terms with automated SMS OTP verification simulation (`849201`) to eliminate spoof orders.
- **Digital Wallets**: One-click instant checkout simulation for Apple Pay, Google Pay, and mobile wallets.
- **Promo Engine**: Dynamic discount codes (e.g. `WELCOME10` for 10% off) and free express shipping threshold progress bar.
- **Order Manifest & Receipt**: Instant printable receipt generation with itemized tax and courier dispatch code.

### 4. Real-Time Order & Courier Tracking
- **Interactive Waypoint Timeline**: 5 distinct fulfillment stages:
  1. *Order Verified & Authorized*
  2. *Inspected & Custom Boxed at Logistics Center*
  3. *In Transit (Line-Haul Highway Freight)*
  4. *Out for Doorstep Delivery (Local Delivery Van)*
  5. *Direct Hand-off & Signature at Door*
- **Live Courier GPS Telemetry**: Simulated SVG route map depicting movement between the regional hub and the recipient's city with animated vehicle pin and live progress percentage.
- **Interactive Stage Advancement**: Built-in "Advance Courier Stage (Demo)" control allowing users and evaluators to test real-time transit state transitions on the fly!
- **Driver Dossier**: Carrier name, vehicle license plate, driver contact shortcut, and estimated delivery window.

### 5. Sleek Customer Dashboard
- **My Orders**: Real-time status tags, itemized package previews, and direct "Track Delivery" shortcuts.
- **Wishlist Management**: One-click "Move to Bag" or remove items.
- **Address Book**: Add, edit, remove, and assign default delivery destinations with full form validation.
- **Payment Vault**: View and manage tokenized payment cards.
- **Account Preferences**: Toggle SMS delivery notices, electronic proof-of-delivery receipts, and restock notifications.

### 6. Interactive Asset Studio & Code Exporter
- **Live Image Customizer**: Swap any product photo or hero banner using built-in high-definition studio presets, direct image URLs, or local image file uploads directly in the browser!
- **One-Click Code Export**: Live generation of `mockData.ts` with your selected images, prices, and configurations.
- **Downloadable Catalog JSON**: Export headless JSON catalog for easy importing into Shopify, Daraz, or custom backend services.
- **Direct Modal Triggers**: Easily accessible from the top navigation bar, customer dashboard, hero banner, and product detail modals.

---

## 🛠️ Tech Stack

- **Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations & Layout**: CSS Compositor transitions & smooth state flows
- **Persistence**: LocalStorage with automatic hydration
- **Build Tool**: Vite 8

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-github-repo-url>
cd <repository-directory>

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 How to Push to GitHub

To push this project to your own GitHub repository:

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `verve-storefront`).
2. Run the following commands in the project directory:

```bash
# Initialize git if not already initialized
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: VERVE e-commerce storefront with real-time tracking and dashboard"

# Rename default branch to main
git branch -M main

# Add your GitHub remote repository URL
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push to GitHub
git push -u origin main
```

---

## 📂 Project Structure

```
├── public/
├── src/
│   ├── assets/images/       # High-fidelity studio product and hero photography
│   ├── components/
│   │   ├── Navbar.tsx             # 3-Zone top navigation bar
│   │   ├── HeroBanner.tsx         # Campaign visual showcase & guarantees
│   │   ├── ProductCard.tsx        # High-conversion product card with quick actions
│   │   ├── CatalogFilters.tsx     # Faceted filters, category tabs, and search
│   │   ├── ProductDetailModal.tsx # Contiguous purchase module & spec sheet
│   │   ├── CartDrawer.tsx         # Slide-over bag with free shipping bar
│   │   ├── CheckoutModal.tsx      # Multi-channel secure checkout
│   │   ├── OrderTrackingView.tsx  # Real-time GPS map & courier timeline
│   │   ├── UserDashboard.tsx      # Orders, wishlist, addresses & payments
│   │   └── Footer.tsx             # Corporate links and newsletter
│   ├── data/
│   │   └── mockData.ts      # Seed products, initial orders, addresses
│   ├── types/
│   │   └── index.ts         # TypeScript data contracts & models
│   ├── App.tsx              # Main application coordinator
│   ├── main.tsx             # Application entry point
│   └── index.css            # Tailwind CSS and typography tokens
├── index.html               # Meta tags and web font imports
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📄 License

Apache-2.0 License. Designed and crafted for modern production deployment.
