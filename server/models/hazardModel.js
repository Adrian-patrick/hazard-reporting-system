import mongoose from 'mongoose';

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
    minlength: [5, 'Title must be at least 5 characters']
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
      'road-damage',
      'flooding',
      'fallen-tree',
      'power-outage',
      'gas-leak',
      'structural-damage',
      'fire-hazard',
      'other'
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
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return validator.isURL(v);
      },
      message: 'Please provide valid image URLs'
    }
  }],
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionDetails: String,
  resolutionDate: Date
}, {
  timestamps: true
});

// Add index for geospatial queries
hazardSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });

// Add text index for search
hazardSchema.index({ title: 'text', description: 'text', 'location.address': 'text' });

const Hazard = mongoose.model('Hazard', hazardSchema);

export default Hazard;