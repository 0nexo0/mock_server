const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
// Use environment variable in production, fallback to local secret
const SECRET_KEY = process.env.JWT_SECRET || 'singhe_health_secret_key_2024';

// ==================== DATA DEFINITIONS ====================

// Specializations
const specializations = [
  { id: 1, name: 'Cardiologist', icon: '❤️', fee_range: [2500, 5000] },
  { id: 2, name: 'Pediatrician', icon: '👶', fee_range: [2000, 3500] },
  { id: 3, name: 'Dermatologist', icon: '🧴', fee_range: [2200, 4000] },
  { id: 4, name: 'Gynecologist', icon: '🤰', fee_range: [2500, 4500] },
  { id: 5, name: 'Orthopedic', icon: '🦴', fee_range: [2300, 4200] },
  { id: 6, name: 'Neurologist', icon: '🧠', fee_range: [3000, 6000] },
  { id: 7, name: 'Ophthalmologist', icon: '👁️', fee_range: [2000, 3500] },
  { id: 8, name: 'ENT Specialist', icon: '👂', fee_range: [2200, 3800] },
  { id: 9, name: 'Psychiatrist', icon: '🧘', fee_range: [2800, 5000] },
  { id: 10, name: 'Dentist', icon: '🦷', fee_range: [1800, 3000] },
  { id: 11, name: 'Urologist', icon: '💧', fee_range: [2500, 4500] },
  { id: 12, name: 'Endocrinologist', icon: '🩸', fee_range: [2600, 4800] },
  { id: 13, name: 'Rheumatologist', icon: '🦵', fee_range: [2700, 5000] },
  { id: 14, name: 'Oncologist', icon: '🎗️', fee_range: [3500, 7000] },
  { id: 15, name: 'Pulmonologist', icon: '🫁', fee_range: [2800, 5200] }
];

// Hospitals
const hospitals = [
  { id: 1, name: 'Singhe Hospital - Colombo', location: 'Colombo 07', rating: 4.8 },
  { id: 2, name: 'Singhe Hospital - Kandy', location: 'Kandy City', rating: 4.7 },
  { id: 3, name: 'Singhe Hospital - Galle', location: 'Galle Fort', rating: 4.6 },
  { id: 4, name: 'Singhe Hospital - Kurunegala', location: 'Kurunegala Town', rating: 4.5 },
  { id: 5, name: 'Singhe Hospital - Jaffna', location: 'Jaffna City', rating: 4.4 },
  { id: 6, name: 'Singhe Hospital - Negombo', location: 'Negombo Beach', rating: 4.6 }
];

// User tiers
const userTiers = [
  { tier: 'Bronze', min_points: 0, max_points: 499, color: '#CD7F32', benefits: ['Basic rewards'] },
  { tier: 'Silver', min_points: 500, max_points: 1499, color: '#C0C0C0', benefits: ['Basic rewards', '5% extra points'] },
  { tier: 'Gold', min_points: 1500, max_points: 2999, color: '#FFD700', benefits: ['Basic rewards', '10% extra points', 'Priority support'] },
  { tier: 'Platinum', min_points: 3000, max_points: 5999, color: '#E5E4E2', benefits: ['Basic rewards', '15% extra points', 'Priority support', 'Free health checkup'] },
  { tier: 'Diamond', min_points: 6000, max_points: 999999, color: '#B9F2FF', benefits: ['Basic rewards', '20% extra points', 'VIP support', 'Free health checkup', 'Annual health report'] }
];

// Redemption offers
const redemptionOffers = [
  {
    id: 1,
    title: 'Free Health Checkup Package',
    description: 'Complete health screening including blood tests, ECG, and doctor consultation',
    points_required: 500,
    original_price: 3500,
    discount_percentage: 100,
    category: 'health_checkup',
    valid_days: 90,
    terms: ['Valid for one person only', 'Appointment required', 'Valid for 3 months from redemption'],
    is_featured: true,
    is_active: true
  },
  {
    id: 2,
    title: '30% Off Lab Tests',
    description: 'Get 30% discount on all laboratory tests',
    points_required: 200,
    original_price: null,
    discount_percentage: 30,
    category: 'lab_tests',
    valid_days: 60,
    terms: ['Minimum order value LKR 2000', 'Cannot combine with other offers', 'Valid for 2 months'],
    is_featured: true,
    is_active: true
  },
  {
    id: 3,
    title: 'Free Medicine Delivery (5km)',
    description: 'Free home delivery for medicine orders within 5km radius',
    points_required: 100,
    original_price: 300,
    discount_percentage: 100,
    category: 'pharmacy',
    valid_days: 30,
    terms: ['Maximum order value LKR 5000', 'Valid only for selected areas', 'One-time use only'],
    is_featured: false,
    is_active: true
  },
  {
    id: 4,
    title: 'Dental Cleaning Session',
    description: 'Professional dental cleaning and scaling session',
    points_required: 400,
    original_price: 2500,
    discount_percentage: 100,
    category: 'dental',
    valid_days: 60,
    terms: ['Prior appointment required', 'Includes basic cleaning only', 'Valid for 2 months'],
    is_featured: true,
    is_active: true
  },
  {
    id: 5,
    title: 'LKR 500 Off on Consultation',
    description: 'Get LKR 500 discount on any doctor consultation',
    points_required: 150,
    original_price: null,
    discount_percentage: null,
    discount_amount: 500,
    category: 'consultation',
    valid_days: 45,
    terms: ['Minimum consultation fee LKR 1500', 'Valid for all doctors', 'Cannot be used with other offers'],
    is_featured: false,
    is_active: true
  },
  {
    id: 6,
    title: 'Free Eye Checkup',
    description: 'Comprehensive eye examination including vision test and eye pressure check',
    points_required: 250,
    original_price: 1200,
    discount_percentage: 100,
    category: 'eye_care',
    valid_days: 90,
    terms: ['Includes basic eye examination', 'Free eyeglass prescription', 'Valid at any Singhe Hospital'],
    is_featured: false,
    is_active: true
  },
  {
    id: 7,
    title: 'Premium Health Card (3 months)',
    description: 'Get premium health card with additional benefits',
    points_required: 1000,
    original_price: 5000,
    discount_percentage: 100,
    category: 'membership',
    valid_days: 90,
    terms: ['Priority appointment booking', '10% off on all services', 'Free health articles access'],
    is_featured: true,
    is_active: true
  },
  {
    id: 8,
    title: 'Pharmacy Coupon - LKR 200',
    description: 'LKR 200 off on pharmacy purchases',
    points_required: 80,
    original_price: null,
    discount_amount: 200,
    category: 'pharmacy',
    valid_days: 30,
    terms: ['Minimum purchase LKR 1000', 'Valid for one-time use', 'Cannot be combined'],
    is_featured: false,
    is_active: true
  },
  {
    id: 9,
    title: 'Wellness Workshop Ticket',
    description: 'Free ticket to wellness and health awareness workshop',
    points_required: 300,
    original_price: 1500,
    discount_percentage: 100,
    category: 'wellness',
    valid_days: 60,
    terms: ['Includes refreshments', 'Certificate of participation', 'Online and offline options'],
    is_featured: false,
    is_active: true
  },
  {
    id: 10,
    title: '20% Off on Physiotherapy',
    description: 'Discount on physiotherapy sessions',
    points_required: 180,
    original_price: null,
    discount_percentage: 20,
    category: 'therapy',
    valid_days: 45,
    terms: ['Minimum 3 sessions required', 'Valid for new patients only', 'Cannot combine with insurance'],
    is_featured: false,
    is_active: true
  }
];

// Generate doctors
const doctors = [];
for (let i = 1; i <= 50; i++) {
  const specialization = specializations[Math.floor(Math.random() * specializations.length)];
  const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
  const experience = Math.floor(Math.random() * 30) + 3;
  const rating = (3.5 + Math.random() * 1.5).toFixed(1);
  const consultationCount = Math.floor(Math.random() * 5000) + 100;
  const languages = ['English', 'Sinhala'];
  if (Math.random() > 0.5) languages.push('Tamil');
  
  doctors.push({
    id: i,
    name: `Dr. ${faker.person.fullName()}`,
    specialization_id: specialization.id,
    specialization_name: specialization.name,
    specialization_icon: specialization.icon,
    hospital_id: hospital.id,
    hospital_name: hospital.name,
    hospital_location: hospital.location,
    hospital_rating: hospital.rating,
    channel_fee: Math.floor(Math.random() * (specialization.fee_range[1] - specialization.fee_range[0]) + specialization.fee_range[0]),
    experience: experience,
    rating: parseFloat(rating),
    consultation_count: consultationCount,
    languages: languages,
    education: [
      `MBBS - University of Colombo`,
      `MD in ${specialization.name} - Postgraduate Institute of Medicine`,
      `Fellowship in ${specialization.name} - UK/India`
    ],
    achievements: [
      'Best Doctor Award 2023',
      'Excellence in Patient Care',
      'Research Publication in International Journal'
    ],
    image_url: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50) + 1}.jpg`,
    is_available_today: Math.random() > 0.3,
    next_available: new Date(Date.now() + (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    created_at: faker.date.past(5),
    updated_at: new Date()
  });
}

// Mock Database
let users = [
  {
    id: 1,
    name: 'John Silva',
    mobile: '0771234567',
    password: bcrypt.hashSync('password123', 10),
    role: 'patient',
    email: 'john@example.com',
    createdAt: new Date()
  }
];

let patients = [
  {
    id: 1,
    user_id: 1,
    name: 'John Silva',
    nic: '199012345678',
    dob: '1990-01-15',
    gender: 'male',
    relation: 'Self',
    phone: '0771234567',
    email: 'john@example.com',
    address: '123 Main Street, Colombo',
    blood_group: 'O+',
    height: 175,
    weight: 70,
    allergies: ['Peanuts', 'Pollen'],
    medical_conditions: ['Mild Asthma'],
    is_primary: true
  },
  {
    id: 2,
    user_id: 1,
    name: 'Mary Silva',
    nic: '199212345678',
    dob: '1992-05-20',
    gender: 'female',
    relation: 'Spouse',
    phone: '0771234568',
    email: 'mary@example.com',
    address: '123 Main Street, Colombo',
    blood_group: 'A+',
    height: 165,
    weight: 60,
    allergies: [],
    medical_conditions: [],
    is_primary: false
  }
];

let appointments = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 1,
    doctor_name: doctors[0].name,
    doctor_specialization: doctors[0].specialization_name,
    hospital_name: doctors[0].hospital_name,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time_slot: '10:00 AM',
    queue_number: 5,
    status: 'scheduled',
    fee: doctors[0].channel_fee,
    notes: 'First consultation',
    created_at: new Date()
  }
];

let reports = [
  {
    id: 1,
    patient_id: 1,
    patient_name: 'John Silva',
    report_type: 'Blood Test',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Complete blood count report',
    uploaded_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
];

let points = [
  {
    id: 1,
    patient_id: 1,
    points: 100,
    type: 'earn',
    description: 'Welcome bonus - First visit',
    category: 'bonus',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    patient_id: 1,
    points: 50,
    type: 'earn',
    description: `Appointment completed with ${doctors[0].name}`,
    category: 'appointment',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  }
];

// Helper functions
function calculateTotalPoints(patientId) {
  const patientPoints = points.filter(p => p.patient_id === patientId);
  const earned = patientPoints.filter(p => p.type === 'earn').reduce((sum, p) => sum + p.points, 0);
  const redeemed = patientPoints.filter(p => p.type === 'redeem').reduce((sum, p) => sum + p.points, 0);
  return earned - redeemed;
}

function generateLeaderboard() {
  const leaderboard = [];
  for (let i = 1; i <= 50; i++) {
    const totalPoints = Math.floor(Math.random() * 10000) + 100;
    let tier = userTiers[0];
    for (const t of userTiers) {
      if (totalPoints >= t.min_points && totalPoints <= t.max_points) {
        tier = t;
        break;
      }
    }
    leaderboard.push({
      rank: i,
      user_id: i,
      name: faker.person.fullName(),
      points: totalPoints,
      tier: tier.tier,
      avatar_url: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50) + 1}.jpg`
    });
  }
  return leaderboard.sort((a, b) => b.points - a.points);
}

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Auth endpoints
app.post('/api/register', async (req, res) => {
  const { name, mobile, password, nic, dob, gender } = req.body;
  
  const existingUser = users.find(u => u.mobile === mobile);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    mobile,
    password: bcrypt.hashSync(password, 10),
    role: 'patient',
    email: `${mobile}@example.com`,
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  const newPatient = {
    id: patients.length + 1,
    user_id: newUser.id,
    name,
    nic,
    dob,
    gender,
    relation: 'Self',
    phone: mobile,
    email: `${mobile}@example.com`,
    address: '',
    blood_group: 'O+',
    height: null,
    weight: null,
    allergies: [],
    medical_conditions: [],
    is_primary: true
  };
  
  patients.push(newPatient);
  
  const token = jwt.sign({ userId: newUser.id }, SECRET_KEY, { expiresIn: '7d' });
  
  res.json({
    success: true,
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      mobile: newUser.mobile,
      role: newUser.role,
      patient: newPatient
    }
  });
});

app.post('/api/login', async (req, res) => {
  const { mobile, password } = req.body;
  
  const user = users.find(u => u.mobile === mobile);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  
  const patient = patients.find(p => p.user_id === user.id);
  
  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '7d' });
  
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      patient
    }
  });
});

app.post('/api/verify-otp', (req, res) => {
  res.json({ success: true, message: 'OTP verified' });
});

// Profile endpoints
app.get('/api/profile', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.userId);
  const patient = patients.find(p => p.user_id === req.userId);
  
  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      patient
    }
  });
});

app.put('/api/profile/update', verifyToken, (req, res) => {
  const { name, email, address } = req.body;
  const user = users.find(u => u.id === req.userId);
  const patient = patients.find(p => p.user_id === req.userId);
  
  if (user) user.name = name;
  if (patient) {
    patient.name = name;
    patient.email = email;
    patient.address = address;
  }
  
  res.json({ success: true, message: 'Profile updated' });
});

// Family members
app.get('/api/family-members', verifyToken, (req, res) => {
  const familyMembers = patients.filter(p => p.user_id === req.userId);
  res.json({ success: true, data: familyMembers });
});

app.post('/api/family-members', verifyToken, (req, res) => {
  const newMember = {
    id: patients.length + 1,
    user_id: req.userId,
    ...req.body,
    is_primary: false
  };
  patients.push(newMember);
  res.json({ success: true, data: newMember });
});

app.put('/api/family-members/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = patients.findIndex(p => p.id === id && p.user_id === req.userId);
  if (index !== -1) {
    patients[index] = { ...patients[index], ...req.body };
    res.json({ success: true, data: patients[index] });
  } else {
    res.status(404).json({ success: false, message: 'Family member not found' });
  }
});

app.delete('/api/family-members/:id', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = patients.findIndex(p => p.id === id && p.user_id === req.userId);
  if (index !== -1) {
    patients.splice(index, 1);
    res.json({ success: true, message: 'Family member removed' });
  } else {
    res.status(404).json({ success: false, message: 'Family member not found' });
  }
});

// Doctors endpoints
app.get('/api/doctors', verifyToken, (req, res) => {
  const { specialization, hospital, min_fee, max_fee, min_rating, search, page = 1, limit = 20 } = req.query;
  
  let filteredDoctors = [...doctors];
  
  if (specialization && specialization !== 'all') {
    filteredDoctors = filteredDoctors.filter(d => d.specialization_name === specialization);
  }
  
  if (hospital && hospital !== 'all') {
    filteredDoctors = filteredDoctors.filter(d => d.hospital_name === hospital);
  }
  
  if (min_fee) {
    filteredDoctors = filteredDoctors.filter(d => d.channel_fee >= parseInt(min_fee));
  }
  
  if (max_fee) {
    filteredDoctors = filteredDoctors.filter(d => d.channel_fee <= parseInt(max_fee));
  }
  
  if (min_rating) {
    filteredDoctors = filteredDoctors.filter(d => d.rating >= parseFloat(min_rating));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredDoctors = filteredDoctors.filter(d => 
      d.name.toLowerCase().includes(searchLower) ||
      d.specialization_name.toLowerCase().includes(searchLower) ||
      d.hospital_name.toLowerCase().includes(searchLower)
    );
  }
  
  filteredDoctors.sort((a, b) => b.rating - a.rating);
  
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  
  res.json({
    success: true,
    data: filteredDoctors.slice(start, end),
    pagination: {
      current_page: parseInt(page),
      total_pages: Math.ceil(filteredDoctors.length / limit),
      total_items: filteredDoctors.length,
      items_per_page: parseInt(limit)
    },
    filters: {
      specializations: [...new Set(doctors.map(d => d.specialization_name))],
      hospitals: [...new Set(doctors.map(d => d.hospital_name))],
      fee_range: {
        min: Math.min(...doctors.map(d => d.channel_fee)),
        max: Math.max(...doctors.map(d => d.channel_fee))
      },
      languages: ['English', 'Sinhala', 'Tamil']
    }
  });
});

app.get('/api/doctors/:id', verifyToken, (req, res) => {
  const doctor = doctors.find(d => d.id === parseInt(req.params.id));
  if (doctor) {
    res.json({ success: true, data: doctor });
  } else {
    res.status(404).json({ success: false, message: 'Doctor not found' });
  }
});

app.get('/api/doctors/:id/available-slots', verifyToken, (req, res) => {
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];
  const availableSlots = timeSlots.filter(() => Math.random() > 0.3);
  res.json({ success: true, data: availableSlots });
});

// Appointments
app.get('/api/appointments', verifyToken, (req, res) => {
  const patient = patients.find(p => p.user_id === req.userId);
  const userAppointments = appointments.filter(a => a.patient_id === patient?.id);
  res.json({ success: true, data: userAppointments });
});

app.post('/api/appointments/book', verifyToken, (req, res) => {
  const { doctor_id, date, time_slot, notes } = req.body;
  const patient = patients.find(p => p.user_id === req.userId);
  const doctor = doctors.find(d => d.id === doctor_id);
  
  const newAppointment = {
    id: appointments.length + 1,
    patient_id: patient.id,
    doctor_id: doctor.id,
    doctor_name: doctor.name,
    doctor_specialization: doctor.specialization_name,
    hospital_name: doctor.hospital_name,
    date,
    time_slot,
    queue_number: Math.floor(Math.random() * 20) + 1,
    status: 'scheduled',
    fee: doctor.channel_fee,
    notes: notes || '',
    created_at: new Date()
  };
  
  appointments.push(newAppointment);
  
  // Add points for booking
  const newPoints = {
    id: points.length + 1,
    patient_id: patient.id,
    points: 10,
    type: 'earn',
    description: `Appointment booked with ${doctor.name}`,
    category: 'appointment',
    created_at: new Date()
  };
  points.push(newPoints);
  
  res.json({ success: true, data: newAppointment });
});

app.delete('/api/appointments/:id/cancel', verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = appointments.findIndex(a => a.id === id);
  if (index !== -1) {
    appointments[index].status = 'cancelled';
    res.json({ success: true, message: 'Appointment cancelled' });
  } else {
    res.status(404).json({ success: false, message: 'Appointment not found' });
  }
});

// Reports
app.get('/api/reports', verifyToken, (req, res) => {
  const patient = patients.find(p => p.user_id === req.userId);
  const userReports = reports.filter(r => r.patient_id === patient?.id);
  res.json({ success: true, data: userReports });
});

app.get('/api/reports/:id/download', verifyToken, (req, res) => {
  res.json({ success: true, data: { url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' } });
});

// Rewards endpoints
app.get('/api/points', verifyToken, (req, res) => {
  const patient = patients.find(p => p.user_id === req.userId);
  const totalPoints = calculateTotalPoints(patient.id);
  res.json({ success: true, points: totalPoints });
});

app.get('/api/rewards/tier', verifyToken, (req, res) => {
  const patient = patients.find(p => p.user_id === req.userId);
  const totalPoints = calculateTotalPoints(patient.id);
  
  let userTier = userTiers[0];
  for (const tier of userTiers) {
    if (totalPoints >= tier.min_points && totalPoints <= tier.max_points) {
      userTier = tier;
      break;
    }
  }
  
  let nextTier = null;
  for (let i = 0; i < userTiers.length; i++) {
    if (userTiers[i].tier === userTier.tier && i < userTiers.length - 1) {
      nextTier = userTiers[i + 1];
      break;
    }
  }
  
  res.json({
    success: true,
    data: {
      current_tier: userTier,
      points_to_next_tier: nextTier ? nextTier.min_points - totalPoints : 0,
      next_tier: nextTier,
      total_points: totalPoints,
      benefits: userTier.benefits
    }
  });
});

app.get('/api/rewards/history', verifyToken, (req, res) => {
  const patient = patients.find(p => p.user_id === req.userId);
  const userPoints = points.filter(p => p.patient_id === patient?.id);
  res.json({ success: true, data: userPoints });
});

app.get('/api/rewards/offers', verifyToken, (req, res) => {
  const { category, featured } = req.query;
  let filteredOffers = [...redemptionOffers];
  
  if (category && category !== 'all') {
    filteredOffers = filteredOffers.filter(o => o.category === category);
  }
  
  if (featured === 'true') {
    filteredOffers = filteredOffers.filter(o => o.is_featured);
  }
  
  res.json({ success: true, data: filteredOffers });
});

app.post('/api/redeem', verifyToken, (req, res) => {
  const { offer_id } = req.body;
  const patient = patients.find(p => p.user_id === req.userId);
  const offer = redemptionOffers.find(o => o.id === offer_id);
  
  const totalPoints = calculateTotalPoints(patient.id);
  
  if (totalPoints >= offer.points_required) {
    const newPoints = {
      id: points.length + 1,
      patient_id: patient.id,
      points: offer.points_required,
      type: 'redeem',
      description: `Redeemed: ${offer.title}`,
      category: 'redemption',
      created_at: new Date()
    };
    points.push(newPoints);
    res.json({ success: true, message: 'Redeemed successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Insufficient points' });
  }
});

app.get('/api/rewards/leaderboard', verifyToken, (req, res) => {
  const { limit = 20 } = req.query;
  const leaderboard = generateLeaderboard();
  
  const patient = patients.find(p => p.user_id === req.userId);
  const userRank = leaderboard.findIndex(l => l.user_id === patient.id) + 1;
  
  res.json({
    success: true,
    data: {
      top_users: leaderboard.slice(0, parseInt(limit)),
      user_rank: userRank,
      total_participants: leaderboard.length
    }
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', verifyToken, (req, res) => {
  const patient = patients.find(p => p.user_id === req.userId);
  const patientAppointments = appointments.filter(a => a.patient_id === patient?.id);
  const totalPoints = calculateTotalPoints(patient.id);
  
  res.json({
    success: true,
    data: {
      upcoming_appointments: patientAppointments.filter(a => a.status === 'scheduled').length,
      total_appointments: patientAppointments.length,
      total_points: totalPoints,
      total_reports: reports.filter(r => r.patient_id === patient?.id).length
    }
  });
});


// ==================== SERVER STARTUP ====================

// Start server locally, but export for Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Mock API Server is running locally!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`\n📝 Test Credentials:`);
    console.log(`   Mobile: 0771234567`);
    console.log(`   Password: password123`);
    console.log(`\n📊 Statistics:`);
    console.log(`   Total Doctors: ${doctors.length}`);
    console.log(`   Total Specializations: ${specializations.length}`);
    console.log(`   Total Hospitals: ${hospitals.length}`);
    console.log(`   Total Offers: ${redemptionOffers.length}`);
    console.log(`\n✨ Ready to accept requests!\n`);
  });
}

// Export the app for Vercel's serverless environment
module.exports = app;