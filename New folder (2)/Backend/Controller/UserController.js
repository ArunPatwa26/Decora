const User = require("../module/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary"); // ✅ Correct Import

const upload = require("../config/multer"); // Multer Config

module.exports = {
  // ✅ CREATE USER (REGISTER)
  createUser: async (req, res) => {
    try {
      // Handle image upload with multer
      upload.single("profilePicture")(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: "File upload failed", error: err.message });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ message: "❌ Email already in use" });
        }

        let cloudinaryImageUrl = "";
        if (req.file) {
          try {
            const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
              folder: "users/images",
              public_id: req.file.filename, // Optional: Set public ID
            });
            cloudinaryImageUrl = cloudinaryUpload.secure_url; // ✅ Get Cloudinary URL
          } catch (uploadError) {
            return res.status(500).json({ message: "❌ Cloudinary upload failed", error: uploadError.message });
          }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create new user
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          address: req.body.address,
          profilePicture: cloudinaryImageUrl,
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: "✅ User Created Successfully", user: newUser });
      });
    } catch (error) {
      res.status(500).json({ message: "❌ Registration failed", error: error.message });
    }
  },

  // ✅ LOGIN USER
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(401).json({ message: "❌ Invalid email or password" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "❌ Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Send user data without password
      const { password, __v, createdAt, updatedAt, ...userData } = user._doc;
      res.status(200).json({ message: "✅ Login successful", ...userData, token });

    } catch (error) {
      res.status(500).json({ message: "❌ Login failed", error: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "❌ User not found" });
      }
      
      // Handle image upload with multer
      upload.single("profilePicture")(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: "File upload failed", error: err.message });
        }
        
        let cloudinaryImageUrl = user.profilePicture; // Keep old image if not updating
        if (req.file) {
          try {
            const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {
              folder: "users/images",
              public_id: req.file.filename,
            });
            cloudinaryImageUrl = cloudinaryUpload.secure_url;
          } catch (uploadError) {
            return res.status(500).json({ message: "❌ Cloudinary upload failed", error: uploadError.message });
          }
        }
        
        // Hash new password if provided
        let newPassword = user.password;
        if (req.body.password) {
          newPassword = await bcrypt.hash(req.body.password, 10);
        }

        // Update user details
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            name: req.body.name || user.name,
            email: req.body.email || user.email,
            password: newPassword,
            address: req.body.address || user.address,
            profilePicture: cloudinaryImageUrl,
          },
          { new: true } // Return updated user
        );

        res.status(200).json({ message: "✅ User updated successfully", user: updatedUser });
      });
    } catch (error) {
      res.status(500).json({ message: "❌ Update failed", error: error.message });
    }
  },
};
