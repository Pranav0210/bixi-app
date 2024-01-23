# Bixi-app
REST API for a real-time rental electronic vehicle booking mobile application.

#### ! Please see that certain test files and their contents have been redacted in view of keeping crucial test insights protected. However the folder in structure persists to show their management. 

## Manual Installation

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env
# open .env and modify the environment variables
```

## Table of Contents

- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## Commands

Running in development:

```bash
npm start
# or
npm run dev
```
Running in production:

```bash
# build
npm run build
# start
npm run prod
```

## Environment Variables

The environment variables can be found and modified in the `.env` file.

```bash
# Port
PORT = # default 3000

# URL of the Mongo DB
MONGO_URI = 

# Cookies
COOKIE-SECRET =

#Buffer b/w rides
BUFFER_TIME=15

# Third Party Integrations
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_MOBILE=
AWS_S3_ACCESS_KEY_ID=
AWS_S3_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
```

## Project Structure

```
\                       # Root folder
 |--controllers\        # Controllers
 |--middleware\         # Custom express middlewares
 |--models\             # Mongoose models
 |--routes\             # Routes
 |--test\               # Unit Tests and Load Tests
 |--util\               # Utility functions
 |--.env                # Environment variables
 |--.gitignore          # Folders to ignore from upload to repository
 |--app.js              # App entry point
 |--db.js               # Database driver
 |--package-lock.json   # Dependency management
 |--package.json        # Repository metadata, dependencies
```

### API Endpoints

List of available routes:

**Auth routes**: `api/v1/auth`
- `POST /send-otp` - Send OTP for mobile based login
- `POST /verify-otp` - Verify the OTP input by user
- `GET /logout` - Logout

**User routes**: `api/v1/user`
- `GET /profile` - Get user profile
- `POST /create-profile` - Create user profile
- `DELETE /delete` - Delete user profile
- `PATCH /update` - Update user profile

**Admin routes**: `api/v1/admin`
- `GET /user` - Get user
- `POST /user` - Save user
- `GET /access` - Get access
- `POST /access` - Post access
- `POST /new-admin` - Create new admin
- `GET /all-users` - Get all users
- `GET /all-ev` - Get all EVs
- `GET /all-rides` - Get all rides
- `GET /end-requests` - Get finish requests
- `GET /ev` - Get EV
- `POST /ev` - Save EV
- `DELETE /ev` - Delete EV
- `GET /ride` - Get ride
- `POST /ride` - New ride
- `POST /ride-start` - Start ride
- `POST /ride-finish` - Finish ride
- `GET /ongoing` - Get ongoing rides
- `GET /bookings` - Get bookings
- `POST /bookings` - Add bookings
- `POST /cancel_ride` - Cancel ride
- `POST /edit_ride` - Edit ride

**Ev routes**: `api/v1/ev`
- `GET /data` - Get data of an e-vehicle
- `DELETE /data` - Delete an ev
- `POST /new` - Add a new ev to database
- `PATCH /update` - Save changes to ev details

**Rides routes**:`api/v1/rides`
- `GET /get-past-bookings` - Get past bookings
- `GET /user-rides` - Get all rides for a user
- `POST /book` - Book a new ride
- `POST /request-end` - Request finishing of a ride 
- `GET /recent-user-booking` - Get recent user bookings
- `POST /bill` - Get bill for the ride just finished
- `PATCH /update-ride-txns` - Update ride transactions
- `PATCH /cancel` - Cancel ride currently booked
- `POST /available` - Get all available e-vehicles for specified filters
- `GET /stations` - Get all nearby stations
- `GET /admin` - Get admin of the specified e-vehicle
- `POST /admin-by-station` - Get admin details of a station

**Image routes**:
- `POST api/v1/images/upload` - Upload image to AWS S3 bucket

