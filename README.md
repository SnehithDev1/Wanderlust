# 🌍 Wanderlust - Enterprise-Grade Property Rental Marketplace

> A sophisticated, production-ready Airbnb-inspired full-stack application demonstrating enterprise architecture patterns, security best practices, and scalable MERN development. Built with Express.js, MongoDB, Passport authentication, and cloud-native integrations.

![Node.js](https://img.shields.io/badge/Node.js-24.14.0-green?style=flat-square&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-5.2.1-black?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8.5.0-green?style=flat-square&logo=mongodb)
![Passport.js](https://img.shields.io/badge/Passport.js-0.7.0-blue?style=flat-square)
![Cloudinary](https://img.shields.io/badge/Cloudinary-2.10.0-blue?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-58.3%25-yellow?style=flat-square)
![EJS](https://img.shields.io/badge/EJS-35.6%25-red?style=flat-square)
![CSS](https://img.shields.io/badge/CSS-6.1%25-1572B6?style=flat-square)

---

## 📑 Table of Contents

- [Executive Summary](#executive-summary)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation & Configuration](#installation--configuration)
- [API Documentation](#api-documentation)
- [Code Organization](#code-organization)
- [Security Implementation](#security-implementation)
- [Advanced Features](#advanced-features)
- [Performance Optimizations](#performance-optimizations)
- [Best Practices Demonstrated](#best-practices-demonstrated)
- [Development Roadmap](#development-roadmap)

---

## 🎯 Executive Summary

**Wanderlust** is a comprehensive real estate marketplace platform that showcases professional-grade full-stack development capabilities. The application implements industry-standard architectural patterns, security protocols, and cloud integrations commonly found in enterprise SaaS platforms.

### Project Statistics
| Metric | Value |
|--------|-------|
| **Code Composition** | 58.3% JavaScript, 35.6% EJS, 6.1% CSS |
| **Total Dependencies** | 14 Production Packages |
| **Architecture Pattern** | MVC with Middleware Stack |
| **Database** | MongoDB Atlas (Cloud) |
| **Authentication** | Passport.js + Local Strategy |
| **Image Hosting** | Cloudinary CDN Integration |
| **Session Management** | MongoDB-backed Sessions |
| **API Style** | RESTful with Async/Await |

---

## ✨ Core Features

### 🔐 Authentication & Authorization System
```javascript
 Passport.js Session-Based Authentication
✓ User Registration with credential validation
✓ Secure login/logout with session persistence
✓ Password hashing via bcrypt (passport-local-mongoose)
✓ 7-day session expiration with auto-refresh
✓ Role-based access control middleware
✓ Protected route authorization
✓ Flash messages for user feedback

🏗️ System Architecture

Wanderlust/
├── app.js                           # Express initialization & middleware
├── index.js                         # Server entry point
├── cloudConfig.js                   # Cloudinary configuration
│
├── models/                          # Database schemas (Mongoose)
│   ├── listing.js                   # Property document model
│   ├── reviews.js                   # Review document model
│   └── user.js                      # User document model
│
├── controllers/                     # Business logic handlers
│   ├── listing.js                   # Listing CRUD operations (5 methods)
│   └── review.js                    # Review operations (2 methods)
│
├── routes/                          # API endpoint definitions
│   ├── listings.js                  # Property routes (CRUD + search)
│   ├── reviews.js                   # Review routes (Create, Delete)
│   └── user.js                      # Auth routes (signup, login, logout)
│
├── middlewares.js                   # Custom middleware stack
│   ├── isLoggedIn()                 # Authentication check
│   ├── isOwner()                    # Listing ownership validation
│   ├── isReviewAuthor()             # Review author verification
│   ├── Validatelisting()            # Joi schema validation
│   └── Validatereview()             # Review schema validation
│
├── utils/                           # Utility functions
│   ├── WrapAsync.js                 # Async error wrapper
│   └── ExpresssError.js             # Custom error class
│
├── schema.js                        # Joi validation for listings
├── reviewschema.js                  # Joi validation for reviews
│
├── views/                           # EJS template files
├── public/                          # Static assets (CSS, JS, images)
├── init/                            # Database initialization
│
├── package.json                     # Dependencies & metadata
└── .env                             # Sensitive configuration

REQUEST FLOW DIAGRAM

┌─────────────────────────────────────────────────────────────┐
│                      HTTP REQUEST                            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│            Express Router (routes/*.js)                     │
│         Maps request to appropriate controller              │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│        Middleware Stack (isLoggedIn, isOwner, etc)         │
│    Validates authentication, authorization, ownership      │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│     Joi Schema Validation (schema.js, reviewschema.js)     │
│      Sanitizes and validates user input/payload            │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│      Controller Business Logic (controllers/*.js)           │
│    Executes database operations and business rules         │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│    Mongoose ODM (models/*.js) → MongoDB Atlas              │
│   CRUD operations with schema validation and relationships  │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              Error Handling Middleware                      │
│     Catches errors and renders error templates             │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│        EJS Template Rendering (views/*.ejs)                │
│      Server-side HTML generation with dynamic data         │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    HTTP RESPONSE                            │
│              (HTML + Session Cookie)                        │
└─────────────────────────────────────────────────────────────┘
