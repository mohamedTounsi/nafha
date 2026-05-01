# nafha.tn - Gaming E-commerce Platform

A premium, game-inspired e-commerce platform built with Next.js, Tailwind CSS, and MongoDB.

## Features
- **Gamer Aesthetic**: Neon accents, glassmorphism, and bold typography.
- **Dynamic Inventory**: Real-time stock management (sold out when stock hits 0).
- **Tunisian Context**: Delivery fixed at 8 DT, prices in DT.
- **Admin Dashboard**: Manage products and track orders.
- **Responsive Cart**: Sidebar inventory management with smooth animations.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB (Mongoose)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## Setup Instructions
1. **Database**: Create a MongoDB database (Atlas or local).
2. **Environment**: Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Usage
- **Home**: Browse and buy gaming gear.
- **Admin**: Go to `/admin` to add products and view customer orders.
- **Stock**: If a product has 0 stock, it will automatically show "Sold Out" and disable the buy button.
