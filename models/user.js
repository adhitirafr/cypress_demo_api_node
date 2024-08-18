// check duplicate email
export async function checkDuplicateEmail(db, emailParam) {
    return new Promise((resolve, reject) => {
        db.query("SELECT email FROM users WHERE email = ? ", [emailParam], (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
        
    })
}

export async function getByEmail(db, emailParam) {
    return new Promise((resolve, reject) => {
        db.query("SELECT id, name, email, password FROM users WHERE email = ? ", [emailParam], (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

export async function insert(db, data) {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO users SET ? ", [data], (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}