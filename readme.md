# == Demo Note API ==

## About this project
This is a simple API for demo cypress purpose.
only containing simple login and simple CRUD that use expressjs.

## Table needed for this API

### users:
id: INT (Primary key)
name: VARCHAR
email: VARCHAR
password: VARCHAR

### notes:
id: INT (Primary key)
user_id: INT (foreign key)
title: VARCHAR
note: TEXT
created_at: DATETIME

## How to Use
1. Make sure you have installed node in your computer.

2. Clone the project

```bash
  git clone https://github.com/adhitirafr/cypress_demo_api_node
```

3. Go to the project directory

```bash
  cd cypress_demo_api_node
```

4. Install dependencies

```bash
  npm install
```

5. Create table with specification in "Table needed for this API"

6. copy the .env.example to .env, fill the variable that needed to access the table
```bash
  cp .env.example .env
```

Then fill the .env with your current database config

sample:
```bash
  APP_ENV = development
  APP_PORT = 5003

  # Database
  DB_HOST = 127.0.0.1
  DB_NAME = democypress
  DB_USER = root
  DB_PASS = 

  SALTROUNDS = 12
  SECRET_KEY = test123
```

7. Start the server

```bash
  npm run dev

```

## License
[MIT](https://choosealicense.com/licenses/mit/)