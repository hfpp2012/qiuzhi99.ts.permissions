import { Request, Response } from "express";
import { IUserDocument } from "../models/User";
import Post from "../models/Post";
import {
  throwPostNotFoundError,
  throwActionNotAllowedError
} from "../utils/throwError";
import { checkBody } from "../utils/validator";
import { wrapAsync } from "../helpers/wrap-async";

export const getPosts = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { page } = req.query;

    const options = {
      page: page || 1,
      limit: 20,
      sort: { createdAt: -1 }
    };

    const posts = await Post.paginate({}, options);

    res.json({
      success: true,
      data: posts
    });
  }
);

export const getPost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (post) {
      res.json({
        success: true,
        data: { post }
      });
    } else {
      throwPostNotFoundError();
    }
  }
);

export const updatePost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    const { body } = req.body;

    checkBody(body);

    const user = req.currentUser as IUserDocument;

    if (post) {
      if (post.user._id.toString() === user._id.toString()) {
        const resPost = await Post.findByIdAndUpdate(
          id,
          { body },
          { new: true }
        );

        res.json({
          success: true,
          data: { message: "updated successfully", post: resPost }
        });
      } else {
        throwActionNotAllowedError();
      }
    } else {
      throwPostNotFoundError();
    }
  }
);

export const deletePost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    const user = req.currentUser as IUserDocument;

    if (post) {
      if (post.user._id.toString() === user._id.toString()) {
        await Post.findByIdAndDelete(id);

        res.json({
          success: true,
          data: { message: "deleted successfully" }
        });
      } else {
        throwActionNotAllowedError();
      }
    } else {
      throwPostNotFoundError();
    }
  }
);

export const createPost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.currentUser as IUserDocument;

    const { body } = req.body;

    checkBody(body);

    const newPost = new Post({
      body,
      user: user._id
    });

    const post = await newPost.save();

    res.json({
      success: true,
      data: { message: "created successfully", post }
    });
  }
);

export const likePost = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const post = await Post.findById(id);

    const user = req.currentUser as IUserDocument;

    if (post) {
      if (
        post.likes.find(like => like._id.toString() === user._id.toString())
      ) {
        post.likes = post.likes.filter(
          like => like._id.toString() !== user._id.toString()
        );
      } else {
        post.likes.push(user._id);
      }

      post.populate("likes", "-password").execPopulate();

      await post.save();

      res.json({
        success: true,
        data: { post }
      });
    } else {
      throwPostNotFoundError();
    }
  }
);