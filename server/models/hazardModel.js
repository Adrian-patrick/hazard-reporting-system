import mongoose from 'mongoose';
import validator from 'validator'; // ✅ URL validation for image URLs

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: [true, 'Please add latitude'],
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: [true, 'Please add longitude'],
    min: -180,
    max: 180
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  }
});

const hazardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify hazard type'],
    enum: [
      'Road',
      'Water',
      'Garbage',
      'Flooding',
      'Fallen Tree',
      'Power Outage',
      'Gas Leak',
      'Structural Damage',
      'Fire Hazard',
      'Other'
    ]
  },
  severity: {
    type: String,
    required: [true, 'Please specify hazard severity'],
    enum: ['low', 'medium', 'high', 'critical']
  },
  status: {
    type: String,
    required: [true, 'Please specify hazard status'],
    enum: ['reported', 'in-progress', 'resolved', 'dismissed'],
    default: 'reported'
  },
  location: {
    type: locationSchema,
    required: [true, 'Please add location details']
  },
  images: {
    type: [String], // ✅ Supports both URLs and Base64 images
    validate: {
      validator: function (images) { 
        if (!images || images.length === 0) return true;
        return images.every(img => validator.isURL(img) || img.startsWith('data:image/'));
      },
      message: 'Please provide valid image URLs or Base64-encoded images'
    }
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ReportedBy (User ID) is required']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    validate: {
      validator: function (value) {
        return value === null || mongoose.Types.ObjectId.isValid(value);
      },
      message: 'Invalid assigned user ID'
    }
  },
  resolutionDetails: {
    type: String,
    default: 'Pending resolution'
  },
  resolutionDate: {
    type: Date,
    default: null
  },
  predictedPriority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  }

}, { timestamps: true });

// ✅ Improve geospatial queries with `2dsphere` index
hazardSchema.index({ location: '2dsphere' });

// ✅ Add text index for full-text search
hazardSchema.index({ title: 'text', description: 'text', 'location.address': 'text' });

const Hazard = mongoose.model('Hazard', hazardSchema);

export default Hazard;
