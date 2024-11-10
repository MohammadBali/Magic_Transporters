# 🌠🌠 Magic Transporters By Mohammad Bali

Welcome to **Magic Transporters** - a streamlined, magical way to handle item logistics. This application provides a robust and RESTful API for managing *Magic Workers*, who perform item transportation missions with the power of virtual magic. With a well-structured TypeScript/Express backend, MongoDB integration, and comprehensive documentation, Magic Transporters ensures reliable handling of transportation tasks with a touch of enchantment.

## 🚀 Features

1. **Add and Manage Magic Workers** - Create and manage the "workers" responsible for item transport missions.
2. **Add and Manage Magic Items** - Register items, each with a defined weight, to be moved by Magic Workers.
3. **Mission Management**:
    - **Loading** - Load items onto a Magic Mover, updating their state to "loading".
    - **On-Mission** - Start a mission, locking the mover into the "on-mission" state and preventing additional loading.
    - **Mission Completion** - Complete a mission, resetting the mover’s state to "resting" and clearing all loaded items.
4. **Leaderboard** - View a list of the Magic Workers who have completed the most missions.
5. **Authentication** - Authentication middleware secures mission and item management.
6. **Swagger Documentation** - Live documentation with Swagger UI.

> *Bonus: This project includes several advanced features that go beyond the requirements, including Swagger documentation, authentication & data population for a better experience.*

---

## 🛠️ Technologies

- **Node.js** (Express) - Backend server
- **TypeScript** - Type safety and improved developer experience
- **MongoDB** (Mongoose) - NoSQL database using Mongoose Driver
- **Swagger** - API documentation

---

## 📂 Project Structure

- **`index.ts`** - Entry point, setting up the server, routes, and Swagger documentation.
- **Models**
    - **Worker** - Schema for Magic Workers with fields for name, weight limit, password, state, and authentication tokens.
    - **Item** - Schema for Magic Items with name and weight.
    - **Mission** - Schema defining missions, tracking items, state, and completion status.
- **Middleware**
    - **Authentication** - Validates tokens to secure access to mission and item management.
- **Routes** - RESTful endpoints for managing workers, items, and missions.

---

## 🖥️ Setup

### Prerequisites
- **Node.js** and **npm**
- **Docker** (optional, if using Dockerized setup)
- **MongoDB** instance

### Installation

1. **Clone the Repository**
    ```bash
    git clone https://gitlab.com/eng.mohammadbali/magic-transporters
    cd magic-transporters
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Environment Setup**
    - Create a `.env` file in the root directory and specify the following environment variables:
      ```plaintext
      PORT=3000
      MONGODB_URI=<your_mongo_db_connection_string>
      SIGN_KEY=<your_sign_key>
      ```

4. **Run the Application**
   ```bash
   npm start
   ```
   
   ```bash
   nodemon src/index.ts
   ```

## 📋 API Endpoints

**Magic Workers**

1. POST /worker/add - Add a new Magic Worker.
2. GET /worker/all - List all Magic Workers. 
3. GET /worker/:id - Get Worker Details by his ID
4. GET /worker/mostCompleted - Get Best Workers in Finishing Missions

**Magic Items**

1. POST /item/add - Add a new Magic Item.
2. GET /item/all - List all Magic Items.
3. GET /item/:id - Get Item Details by its ID

**Missions**

1. POST /mission/start/ - Start a mission with a specific worker.
2. PATCH /mission/load/ - Load a Magic Mover with items. 
3. PATCH /mission/end/ - End the mission and reset the worker.
4. GET /mission/all - Get All Missions ~ Should be paginated
5. GET /mission/:id - Get a Mission details by its ID

## Swagger Documentation
- Interactive API documentation is accessible at /api-docs.
- Code Comments - JSDoc comments enhance readability and maintainability.

## Postman API
- Postman JSON file is provided; so endpoints can be inspected Easily.
- Can be found at:
> *./Magic_Transporters_Postman_File.json*

## Thank You For This Opportunity
# Mohammad Bali

   
