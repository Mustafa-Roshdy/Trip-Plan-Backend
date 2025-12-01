const express = require('express');
const router = express.Router();

// Import controller functions
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController.js');

const {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace
} = require('../controllers/placeController.js');

const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController.js');

const {
  createTripPlan,
  getAllTripPlans,
  getTripPlanById,
  updateTripPlan,
  deleteTripPlan
} = require('../controllers/tripPlanController.js');

const {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController.js');

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
} = require('../controllers/postController.js');

const {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram
} = require('../controllers/programController.js');

// Users routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Places routes
router.get('/places', getAllPlaces);
router.get('/places/:id', getPlaceById);
router.post('/places', createPlace);
router.put('/places/:id', updatePlace);
router.delete('/places/:id', deletePlace);

// Booking routes
router.get('/bookings', getAllBookings);
router.get('/bookings/:id', getBookingById);
router.post('/bookings', createBooking);
router.put('/bookings/:id', updateBooking);
router.delete('/bookings/:id', deleteBooking);

// Trip Plan routes
router.get('/trip-plans', getAllTripPlans);
router.get('/trip-plans/:id', getTripPlanById);
router.post('/trip-plans', createTripPlan);
router.put('/trip-plans/:id', updateTripPlan);
router.delete('/trip-plans/:id', deleteTripPlan);

// Contact routes
router.get('/contacts', getAllContacts);
router.get('/contacts/:id', getContactById);
router.post('/contacts', createContact);
router.put('/contacts/:id', updateContact);
router.delete('/contacts/:id', deleteContact);

// Posts routes
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.post('/posts', createPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

// Programs routes
router.get('/programs', getAllPrograms);
router.get('/programs/:id', getProgramById);
router.post('/programs', createProgram);
router.put('/programs/:id', updateProgram);
router.delete('/programs/:id', deleteProgram);

module.exports = router;