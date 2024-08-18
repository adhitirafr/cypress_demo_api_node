# == Demo Note API ==

## About this project
This is a simple API for demo cypress purpose.
only containing simple login and simple CRUD that use expressjs.

## Table needed for this API

### users:
id: INT
name: VARCHAR
email: VARCHAR
password: VARCHAR

### notes:
id: INT
user_id: INT
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
  cp .env.example
```

7. Start the server

```bash
  npm run dev
```

## License
[MIT](https://choosealicense.com/licenses/mit/)