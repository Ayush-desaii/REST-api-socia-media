import blog from "../models/blog.js";
import bcrypt from "bcryptjs";
import user from "../models/user.js";
import mongoose from "mongoose";

export const getAllBlogs = async (req, res, next) => {
    let blogs;
    try{
        blogs = await blog.find();

    } catch(err) {
        console.log(err);
    }

    if (!blogs) {
        return res.status(404).json({message:"no blog found"});
    }
    return res.status(200).json({blogs})
}

export const addBlog = async (req, res, next) => {
    const { title, description, image, user } = req.body;
    const blogg = new blog({
        title, description, image, user
    })
    let existingUser;
    try {
        existingUser = await blog.findById(user);
    } catch (error) {
        console.log(error);       
    }
    if (!existingUser) {
        return res.status(400).json({message:"unable to find user"})
    }
    try {
        const session = mongoose.startSession();
        (await session).startTransaction();
        await blogg.save({session});
        existingUser.blog.push(blogg);
        await existingUser.save({session});
        (await session).commitTransaction();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error})
    }
    return res.status(200).json({blogg})
}

export const updateBlog = async (req, res, next) => {
    const blogId = req.params.id;
    const { title, description } = req.body;
    let blogg;
    try {
        blogg =  await blog.findByIdAndUpdate(blogId, {title, description})
    } catch (error) {
        console.log(error);
    }
    if(!blogg){
        return res.status(500).json({message:"couldn't update the blog"})
    }
    return res.status(200).json({blogg})
}

export const getById = async (req, res, next) => {
    const blogId = req.params.id;
    let blogg;
    try {
        blogg =  await blog.findById(blogId);
    } catch (error) {
        console.log(error);
    }
    if(!blogg){
        return res.status(404).json({message:"couldn't find the blog"})
    }
    return res.status(200).json({blogg})
}

export const deleteById = async (req, res, next) => {
    const blogId = req.params.id;
    let blogg;
    try {
        blogg =  await blog.findByIdAndRemove(blogId).populate("user");
        await blog.user.blogs.pull(blogg);
        await blog.user.save();
    } catch (error) {
        console.log(error);
    }
    if(!blogg){
        return res.status(404).json({message:"couldn't find the blog"})
    }
    return res.status(200).json({message:"deleted the blog"})
}

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await user.findById(userId).populate("blogs");
    } catch (error) {
        console.log(error);
    }
    if(!userBlogs){
        return res.status(404).json({message:"couldn't find the blog"})
    }
    return res.status(200).json({blogs:userBlogs})
}