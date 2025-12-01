const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController.js");
const { protect } = require("../middleware/authMiddleware.js");
const {
  createContactValidation,
  addMessageValidation,
  updateMessageValidation,
} = require("../validation/contactValidation.js");

// ==========================
// GET CONTACTS FOR USER
// ==========================
router.get("/contact/user/:userId", protect, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const contacts = await contactController.getContacts(req.params.userId);
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
});

// ==========================
// CREATE CONTACT
// ==========================
router.post("/contact", protect, async (req, res) => {
  const { error } = createContactValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { contactUserId } = req.body;

    const contact = await contactController.createContact(req.user.id, contactUserId);
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================
// GET SINGLE CONTACT
// ==========================
router.get("/contact/:id", protect, async (req, res) => {
  try {
    const contact = await contactController.getContact(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    const isParticipant =
      contact.user._id.toString() === req.user.id ||
      contact.contactUser._id.toString() === req.user.id;

    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
});

// ==========================
// ADD MESSAGE
// ==========================
router.post("/contact/:id/message", protect, async (req, res) => {
  const { error } = addMessageValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { message } = req.body;
    const updatedContact = await contactController.addMessage(req.params.id, req.user.id, message);
    res.status(201).json({ success: true, data: updatedContact });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
});

// ==========================
// UPDATE MESSAGE
// ==========================
router.put("/contact/:id/message/:messageId", protect, async (req, res) => {
  const { error } = updateMessageValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { message } = req.body;
    const updatedContact = await contactController.updateMessage(
      req.params.id,
      req.params.messageId,
      req.user.id,
      message
    );
    res.status(200).json({ success: true, data: updatedContact });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
});

// ==========================
// DELETE MESSAGE
// ==========================
router.delete("/contact/:id/message/:messageId", protect, async (req, res) => {
  try {
    const updatedContact = await contactController.deleteMessage(
      req.params.id,
      req.params.messageId,
      req.user.id
    );
    res.status(200).json({ success: true, data: updatedContact });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
});

// ==========================
// DELETE CONTACT
// ==========================
router.delete("/contact/:id", protect, async (req, res) => {
  try {
    const deleted = await contactController.deleteContact(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.status(200).json({ success: true, message: "Contact deleted successfully" });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
});

module.exports = router;