import bcryptjs from "bcryptjs";
import prisma from "../lib/prisma.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;

  const tokenUserId = req.userId;

  const { password, avatar, ...data } = req.body;

  if (tokenUserId !== id) {
    return res.status(403).json({
      message: "No tienes permisos para actualizar este usuario",
    });
  }

  let updataPassword = null;

  try {
    if (password) {
      updataPassword = await bcryptjs.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...(updataPassword && { password: updataPassword }),
        ...(avatar && { avatar }),
      },
    });
    const { password: userPassword, ...userData } = user;
    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  const tokenUserId = req.userId;

  if (tokenUserId !== id) {
    return res.status(403).json({
      message: "No tienes permisos para actualizar este usuario",
    });
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const userId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: { id: savedPost.id },
      });
      res.status(200).json({
        message: "Post eliminado de favoritos",
      });
    } else {
      await prisma.savedPost.create({
        data: {
          userId,
          postId,
        },
      });
      res.status(200).json({
        message: "Post guardado en favoritos",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};

export const getProfilePost = async (req, res) => {
  const id = req.userId;
  console.log(id);
  try {
    const userPosts = await prisma.post.findMany({
      where: {
        userId: id,
      },
    });

    const saved = await prisma.savedPost.findMany({
      where: {
        userId: id,
      },
      include: {
        post: true,
      },
    });

    const savedPosts = saved.map((post) => post.post);

    res.status(200).json({
      userPosts,
      savedPosts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};

export const getNotification = async (req, res) => {
  const id = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: {
          hasSome: [id],
        },
        NOT: {
          seenBy: {
            hasSome: [id],
          },
        },
      },
    });

    res.status(200).json(number);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error al obtener los usuarios",
    });
  }
};
