const Blog = require('../models/blog');
const { uploadImageToBucket } = require('../helpers/uploadHelper');

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        let imageUrl = null;

        if (req.file) {
            imageUrl = await uploadImageToBucket(req.file);
        }

        const newBlog = new Blog({
            title,
            content,
            image: imageUrl
        });

        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ error: 'Error creating blog' });
    }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving blogs' });
    }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving blog' });
    }
};

// Update blog
exports.updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;

        if (req.file) {
            blog.image = await uploadImageToBucket(req.file);
        }

        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Error updating blog' });
    }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting blog' });
    }
};
