export async function getListByUserId(db, userIdParam) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC", [userIdParam], (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

export async function getByIdAndUserId(db, userId, noteId) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM notes WHERE user_id = ? AND id = ? ", [userId, noteId], (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

export async function insert(db, data) {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO notes SET ? ", [data], (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

export async function update(db, data, id) {
    return new Promise((resolve, reject) => {
        db.query("UPDATE notes SET ? WHERE id = ? ", [data, id], (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}

export async function destroy(db, dataId) {
    return new Promise((resolve, reject) => {
        db.query("DELETE FROM notes WHERE id = ? ", [dataId], (error, result) => {
            if (error) reject(error)
            else resolve(result)
        })
    })
}