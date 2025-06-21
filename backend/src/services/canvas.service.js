import bcrypt from "bcryptjs";
import Canvas from "../models/canvas.model.js";

export const checkCanvasExistsService = async (canvasId) =>
  await Canvas.findOne({ _id: canvasId }).select("-password");

export const checkCanvasExistsByNameService = async (name) =>
  await Canvas.findOne({ name }).select("-password");

export const hashPasswordService = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const createCanvasService = async (canvasData) => {
  const newCanvas = new Canvas(canvasData);
  return await newCanvas.save();
};

export const getAllCanvasesService = async () =>
  await Canvas.find().select("-password");

export const getCanvasIdByNameService = async (name) =>
  await Canvas.findOne({ name }).select("_id");

export const updateCanvasColorsService = async (canvasId, colors) => {
  if (!Array.isArray(colors)) {
    throw new Error("Colors must be an array");
  }

  const updatedLobby = await Canvas.findByIdAndUpdate(
    canvasId,
    { allowedColors: colors },
    { new: true }
  );

  if (!updatedLobby) {
    throw new Error("Lobby not found");
  }

  return updatedLobby;
};
