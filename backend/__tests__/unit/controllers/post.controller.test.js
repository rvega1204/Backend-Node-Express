describe("Post Controller", () => {
  let req, res, Post, controller;

  // Setup mocks and test fixtures before each test
  beforeEach(() => {
    // Mock Post model methods
    Post = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    // Mock Express request and response objects
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Controller with all CRUD operations
    controller = {
      // Fetch all posts
      getAllPosts: async (req, res) => {
        try {
          const posts = await Post.find();
          res.status(200).json(posts);
        } catch (error) {
          res.status(500).json({ message: "Internal server error" });
        }
      },

      // Fetch a single post by ID
      getPostById: async (req, res) => {
        try {
          const post = await Post.findById(req.params.id);
          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
          res.status(200).json(post);
        } catch (error) {
          res.status(500).json({ message: "Internal server error" });
        }
      },

      // Create a new post
      createPost: async (req, res) => {
        try {
          const post = await Post.create(req.body);
          res.status(201).json({ message: "Post created successfully", post });
        } catch (error) {
          res.status(400).json({ message: "Validation error" });
        }
      },

      // Update an existing post
      updatePost: async (req, res) => {
        try {
          if (!Object.keys(req.body).length) {
            return res
              .status(400)
              .json({ message: "No data provided for update" });
          }
          const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
          });
          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
          res.status(200).json({ message: "Post updated successfully", post });
        } catch (error) {
          res.status(500).json({ message: "Internal server error" });
        }
      },

      // Delete a post
      deletePost: async (req, res) => {
        try {
          const post = await Post.findByIdAndDelete(req.params.id);
          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
          res.status(200).json({ message: "Post deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: "Internal server error" });
        }
      },
    };

    jest.clearAllMocks();
  });

  // Tests for getAllPosts
  describe("getAllPosts", () => {
    it("should return all posts", async () => {
      const mockPosts = [
        { _id: "1", name: "Post 1", age: 20 },
        { _id: "2", name: "Post 2", age: 30 },
      ];

      Post.find.mockResolvedValue(mockPosts);

      await controller.getAllPosts(req, res);

      expect(Post.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPosts);
    });

    // Error handling test
    it("should handle errors", async () => {
      Post.find.mockRejectedValue(new Error("DB Error"));

      await controller.getAllPosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  // Tests for getPostById
  describe("getPostById", () => {
    it("should return a post by id", async () => {
      const mockPost = { _id: "123", name: "Test", age: 25 };
      req.params.id = "123";

      Post.findById.mockResolvedValue(mockPost);

      await controller.getPostById(req, res);

      expect(Post.findById).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });

    // Test when post doesn't exist
    it("should return 404 if not found", async () => {
      req.params.id = "999";
      Post.findById.mockResolvedValue(null);

      await controller.getPostById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Post not found" });
    });
  });

  // Tests for createPost
  describe("createPost", () => {
    it("should create a new post", async () => {
      const newPost = { name: "New Post", description: "Desc", age: 30 };
      const savedPost = { _id: "123", ...newPost };

      req.body = newPost;
      Post.create.mockResolvedValue(savedPost);

      await controller.createPost(req, res);

      expect(Post.create).toHaveBeenCalledWith(newPost);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post created successfully",
        post: savedPost,
      });
    });

    // Test validation error handling
    it("should handle validation errors", async () => {
      req.body = { description: "No name" };
      Post.create.mockRejectedValue(new Error("Validation error"));

      await controller.createPost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // Tests for updatePost
  describe("updatePost", () => {
    it("should update a post", async () => {
      const updateData = { name: "Updated", age: 35 };
      const updatedPost = { _id: "123", ...updateData };

      req.params.id = "123";
      req.body = updateData;
      Post.findByIdAndUpdate.mockResolvedValue(updatedPost);

      await controller.updatePost(req, res);

      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith("123", updateData, {
        new: true,
        runValidators: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post updated successfully",
        post: updatedPost,
      });
    });

    // Test empty request body validation
    it("should return 400 if no data provided", async () => {
      req.params.id = "123";
      req.body = {};

      await controller.updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "No data provided for update",
      });
    });

    // Test when post to update doesn't exist
    it("should return 404 if not found", async () => {
      req.params.id = "999";
      req.body = { name: "Updated" };
      Post.findByIdAndUpdate.mockResolvedValue(null);

      await controller.updatePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // Tests for deletePost
  describe("deletePost", () => {
    it("should delete a post", async () => {
      const deletedPost = { _id: "123", name: "Deleted" };
      req.params.id = "123";

      Post.findByIdAndDelete.mockResolvedValue(deletedPost);

      await controller.deletePost(req, res);

      expect(Post.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Post deleted successfully",
      });
    });

    // Test when post to delete doesn't exist
    it("should return 404 if not found", async () => {
      req.params.id = "999";
      Post.findByIdAndDelete.mockResolvedValue(null);

      await controller.deletePost(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
