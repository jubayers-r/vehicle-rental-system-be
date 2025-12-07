# 🚗 Vehicle Rental System

A comprehensive backend API for managing vehicle rentals, built with Node.js, TypeScript, Express.js, and PostgreSQL.

## 🎯 Overview

The Vehicle Rental System is a robust backend API designed to streamline vehicle rental operations. It provides comprehensive functionality for managing vehicle inventory, customer accounts, bookings, and secure role-based authentication.

## 🌐 Live API

**Base URL:** `https://vehicle-rental-system-be.vercel.app/api/v1/`

## ✨ Features

### Core Functionality

- **Vehicle Management** - Complete CRUD operations for vehicle inventory with availability tracking
- **Customer Management** - User registration, profile management, and account administration
- **Booking System** - Handle vehicle rentals with automated pricing, availability checks, and return processing
- **Authentication & Authorization** - Secure JWT-based authentication with role-based access control

### Key Capabilities

- ✅ Real-time vehicle availability tracking
- ✅ Automated rental cost calculation based on duration
- ✅ Role-based permissions (Admin & Customer)
- ✅ Booking lifecycle management (active, cancelled, returned)
- ✅ Secure password hashing with bcrypt
- ✅ Input validation and error handling

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **Validation:** Custom middleware

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher)
- **pnpm** or **npm** or **yarn**
- **PostgreSQL** (v12.x or higher)
- **Git**

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jubayers-r/vehicle-rental-system-be
   cd vehicle-rental-system-be
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

## 💾 Database Setup

1. **Create a PostgreSQL database**

   ```sql
   CREATE DATABASE vehicle_rental_db;
   ```

2. **Run database migrations**

   ```bash
   npm run migrate
   ```

   Or manually create tables using the schema:

   ```sql

   -- enum types inuse

   DO $$
   BEGIN
    -- user_role
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
      CREATE TYPE user_role AS ENUM ('admin', 'customer');
    END IF;

    -- car_types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'car_types') THEN
      CREATE TYPE car_types AS ENUM ('car', 'bike', 'van', 'SUV');
    END IF;

    -- car_availability
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'car_availability') THEN
      CREATE TYPE car_availability AS ENUM ('available', 'booked');
    END IF;

    -- booking_status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
      CREATE TYPE booking_status AS ENUM ('active', 'cancelled', 'returned');
    END IF;
   END
   $$;

   -- Users Table
    CREATE TABLE IF NOT EXISTS users(
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email TEXT UNIQUE NOT NULL CHECK (email ~ '[a-z]'),
          password TEXT NOT NULL,
            CHECK (char_length(password) >= 6),
          phone VARCHAR(15) NOT NULL,
          role user_role NOT NULL
          )

   -- Vehicles Table
   CREATE TABLE IF NOT EXISTS vehicles(
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          vehicle_name VARCHAR(150) NOT NULL,
          type car_types NOT NULL,
          registration_number VARCHAR(100) UNIQUE NOT NULL,
          daily_rent_price INT NOT NULL,
              CHECK (daily_rent_price > 0),
          availability_status car_availability NOT NULL
          )

   -- Bookings Table
   CREATE TABLE bookings (
       CREATE TABLE IF NOT EXISTS bookings(
          id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          customer_id INT REFERENCES users(id) ON DELETE CASCADE,
          vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
          rent_start_date DATE NOT NULL,
          rent_end_date DATE NOT NULL,
             CHECK (rent_end_date > rent_start_date),
          total_price INT NOT NULL,
             CHECK (total_price > 0),
          status booking_status NOT NULL
          )
   );
   ```

## ⚙️ Configuration

1. **Create a `.env` file** in the root directory:

   ```env
   # Server Configuration

   # Database Configuration
    DATABASE_URL=your_serverless_postres_string

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

2. **Update database credentials** with your PostgreSQL configuration

## 🎮 Running the Application

### Development Mode

```bash
pnpm dev
```

### Production Mode

```bash
pnpm build
pnpm start
```

The API will be available at `http://localhost:5000`

## 📖 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | `/auth/signup` | Register a new user         |
| POST   | `/auth/signin` | Login and receive JWT token |

### Vehicle Endpoints

| Method | Endpoint               | Access | Description        |
| ------ | ---------------------- | ------ | ------------------ |
| POST   | `/vehicles`            | Admin  | Create new vehicle |
| GET    | `/vehicles`            | Public | Get all vehicles   |
| GET    | `/vehicles/:vehicleId` | Public | Get vehicle by ID  |
| PUT    | `/vehicles/:vehicleId` | Admin  | Update vehicle     |
| DELETE | `/vehicles/:vehicleId` | Admin  | Delete vehicle     |

### User Endpoints

| Method | Endpoint         | Access    | Description   |
| ------ | ---------------- | --------- | ------------- |
| GET    | `/users`         | Admin     | Get all users |
| PUT    | `/users/:userId` | Admin/Own | Update user   |
| DELETE | `/users/:userId` | Admin     | Delete user   |

### Booking Endpoints

| Method | Endpoint               | Access         | Description    |
| ------ | ---------------------- | -------------- | -------------- |
| POST   | `/bookings`            | Customer/Admin | Create booking |
| GET    | `/bookings`            | Role-based     | Get bookings   |
| PUT    | `/bookings/:bookingId` | Role-based     | Update booking |

For detailed API specifications with request/response examples, see [API_REFERENCE.md](API_REFERENCE.md)

## 📁 Project Structure

```
vehicle-rental-system-be/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.routes.ts
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.routes.ts
│   │   ├── vehicles/
│   │   │   ├── vehicles.controller.ts
│   │   │   ├── vehicles.service.ts
│   │   │   └── vehicles.routes.ts
│   │   └── bookings/
│   │       ├── bookings.controller.ts
│   │       ├── bookings.service.ts
│   │       └── bookings.routes.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   ├── config/
│   │   └── database.ts
│   ├── utils/
│   │   ├── jwt.utils.ts
│   │   └── password.utils.ts
│   ├── types/
│   │   └── index.ts
│   └── app.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentication

### User Roles

- **Admin** - Full system access
- **Customer** - Limited to personal operations

### Authentication Flow

1. User registers via `/auth/signup` (password is hashed)
2. User logs in via `/auth/signin` and receives JWT token
3. Client includes token in headers: `Authorization: Bearer <token>`
4. Protected routes validate token and check permissions
5. Access granted if authorized

### Example Authentication Header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

- Md. Jubayer Shikder

## 📞 Support

For support, email jubayer.shikder.007@gmail.com or open an issue in the repository.

---

**Made with ❤️ using Node.js and TypeScript**
