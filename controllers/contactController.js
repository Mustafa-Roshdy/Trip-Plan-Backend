const Contact = require("../models/contactModel.js");

const USER_FIELDS = "firstName lastName email photo role";

const populateContact = (query) =>
  query
    .populate("user", USER_FIELDS)
    .populate("contactUser", USER_FIELDS);

const isParticipant = (contact, userId) => {
  if (!contact || !userId) return false;
  const normalizedId = userId.toString();
  return (
    contact.user?.toString() === normalizedId ||
    contact.contactUser?.toString() === normalizedId
  );
};

const createAuthError = () => {
  const error = new Error("Not authorized");
  error.statusCode = 403;
  return error;
};

// Get all contacts for a user (owner or guest)
async function getContacts(userId) {
  return await populateContact(
    Contact.find({
      $or: [{ user: userId }, { contactUser: userId }],
    })
  ).sort({ updatedAt: -1, createdAt: -1 });
}

// Create a new contact (conversation)
async function createContact(userId, contactUserId) {
  // Avoid creating duplicates regardless of who started the chat first
  const existing = await populateContact(
    Contact.findOne({
      $or: [
        { user: userId, contactUser: contactUserId },
        { user: contactUserId, contactUser: userId },
      ],
    })
  );
  if (existing) return existing;

  const contact = await Contact.create({
    user: userId,
    contactUser: contactUserId,
  });

  return await populateContact(Contact.findById(contact._id));
}

// Get single contact
async function getContact(contactId) {
  return await populateContact(Contact.findById(contactId));
}

// Add message to contact
async function addMessage(contactId, senderId, message) {
  const contact = await Contact.findById(contactId);
  if (!contact) throw new Error("Contact not found");
  if (!isParticipant(contact, senderId)) throw createAuthError();

  const role = contact.user.toString() === senderId.toString() ? "me" : "other";
  contact.messages.push({ role, message });
  contact.markModified("messages");
  contact.updatedAt = new Date();
  await contact.save();

  return await getContact(contactId);
}

// Update message
async function updateMessage(contactId, messageId, senderId, newMessage) {
  const contact = await Contact.findById(contactId);
  if (!contact) throw new Error("Contact not found");
  if (!isParticipant(contact, senderId)) throw createAuthError();

  const msg = contact.messages.id(messageId);
  if (!msg) throw new Error("Message not found");

  msg.message = newMessage;
  msg.updatedAt = new Date();
  contact.markModified("messages");
  contact.updatedAt = new Date();
  await contact.save();

  return await getContact(contactId);
}

// Delete message
async function deleteMessage(contactId, messageId, senderId) {
  const contact = await Contact.findById(contactId);
  if (!contact) throw new Error("Contact not found");
  if (!isParticipant(contact, senderId)) throw createAuthError();

  contact.messages.pull(messageId);
  contact.markModified("messages");
  contact.updatedAt = new Date();
  await contact.save();

  return await getContact(contactId);
}

// Delete contact
async function deleteContact(contactId, requesterId) {
  const contact = await Contact.findById(contactId);
  if (!contact) return null;
  if (!isParticipant(contact, requesterId)) throw createAuthError();

  return await Contact.findByIdAndDelete(contactId);
}

module.exports = {
  getContacts,
  createContact,
  getContact,
  addMessage,
  updateMessage,
  deleteMessage,
  deleteContact,
};