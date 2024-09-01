import db from "../configs/database.js";
import * as modelNote from "../models/note.js";

// Fetch the list of notes for a user
export async function getList(req, res) {
  try {
    const user_id = req?.user?.id;

    if (!user_id) {
      return res.status(401).json({
        message: "401: Unauthorized. Please login with correct user",
      });
    }

    // Get list by user
    const listData = await modelNote.getListByUserId(db, user_id);

    if (!listData || listData.length === 0) {
      return res.status(200).json({
        message: "200: Success. No data found."
      });
    }

    return res.status(200).json({
      message: "200: Success. Data retrieved.",
      data: listData,
    });
    
  } catch (error) {
    return res.status(500).json({
      message: "500: Internal Server Error. Failed to get list of notes.",
      data: [],
    });
  }
}

// Create a new note
export async function create(req, res) {
  try {
    const { note, title } = req.body;

    if (!note) {
      return res.status(400).json({
        message: "400: Bad Request. 'note' is required.",
      });
    }

    const insertData = {
      user_id: req.user.id,
      title,
      note,
      created_at: new Date(),
    };

    await modelNote.insert(db, insertData);

    // Get current list
    const listData = await modelNote.getListByUserId(db, req.user.id);

    return res.status(201).json({
      message: "201: Created. Note added.",
      data: listData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "500: Internal Server Error. Failed to create note.",
      data: [],
    });
  }
}

// Delete a note by id
export async function destroy(req, res) {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "400: Bad Request. 'id' is required.",
      });
    }

    // check data exist
    const userData = await modelNote.getByIdAndUserId(db, req.user.id, id);

    if (!userData || userData.length == 0) {
      return res.status(404).json({
        message: "404: Not Found. Note not exist."
      });
    }

    // Remove data
    await modelNote.destroy(db, id);

    // Get current list
    const listData = await modelNote.getListByUserId(db, req.user.id);

    return res.status(200).json({
      message: "200: Success. Note deleted.",
      data: listData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "500: Internal Server Error. Failed to delete note.",
      data: [],
    });
  }
}
