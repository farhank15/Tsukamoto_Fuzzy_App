# Project Setup Guide

This project consists of a client and server application. Follow the steps below to get both running locally.

## Prerequisites

- Node.js and Bun installed
- PostgreSQL database
- Make utility

## Client Setup

Navigate to the client directory and install dependencies:

```bash
cd client
bun install
bun dev
```

The client application will start and be available for development.

## Server Setup

### 1. Navigate to Server Directory

```bash
cd server
```

### 2. Environment Configuration

Create a `.env` file in the server directory with the following variables:

```env
PORT=8080
APP_ENV=local
BLUEPRINT_DB_HOST=localhost
BLUEPRINT_DB_PORT=5432
BLUEPRINT_DB_DATABASE=your_database_name
BLUEPRINT_DB_USERNAME=your_username
BLUEPRINT_DB_PASSWORD=your_password
BLUEPRINT_DB_SCHEMA=public
```

> **Note:** Replace the database credentials with your actual PostgreSQL configuration.

### 3. Database Migration

Run the migration to set up your database schema:

```bash
make migrate
```

### 4. Start the Server

You have two options to run the server:

**Standard run:**

```bash
make run
```

**Development with hot reload:**

```bash
make watch
```

## Getting Started

1. Set up your PostgreSQL database
2. Configure the server environment variables
3. Run database migrations
4. Start both client and server applications
5. Your application should now be running locally

## Development Notes

- The server uses hot reload when started with `make watch`
- Make sure your PostgreSQL service is running before starting the server
- Update the database credentials in your `.env` file according to your local setup
