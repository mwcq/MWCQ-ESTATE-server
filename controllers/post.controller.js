import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        property: query.property || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 1000000000,
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        PostDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    let userId;

    const token = req.cookies?.token;

    if (!token) {
      userId = null;
    } else {
      jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
          userId = null;
        } else {
          userId = payload.id;
        }
      });
    }

    const saved = await prisma.SavedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: req.params.id,
        },
      },
    });

    res.status(200).json({ ...post, isSaved: saved ? true : false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        PostDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

export const updatePost = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    const deletedPost = await prisma.post.delete({
      where: { id },
    });
    res.status(200).json(deletedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};
