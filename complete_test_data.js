// Complete Test Data for Singhe Health App
const { faker } = require('@faker-js/faker');

// ==================== DOCTORS DATA ====================

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

const hospitals = [
  { id: 1, name: 'Singhe Hospital - Colombo', location: 'Colombo 07', rating: 4.8 },
  { id: 2, name: 'Singhe Hospital - Kandy', location: 'Kandy City', rating: 4.7 },
  { id: 3, name: 'Singhe Hospital - Galle', location: 'Galle Fort', rating: 4.6 },
  { id: 4, name: 'Singhe Hospital - Kurunegala', location: 'Kurunegala Town', rating: 4.5 },
  { id: 5, name: 'Singhe Hospital - Jaffna', location: 'Jaffna City', rating: 4.4 },
  { id: 6, name: 'Singhe Hospital - Negombo', location: 'Negombo Beach', rating: 4.6 }
];

// Generate 50 doctors with rich data
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
    availability: generateAvailability(),
    time_slots: generateTimeSlots(),
    is_available_today: Math.random() > 0.3,
    next_available: getNextAvailableDate(),
    created_at: faker.date.past(5),
    updated_at: new Date()
  });
}

function generateAvailability() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const morning = ['9:00 AM', '10:00 AM', '11:00 AM'];
  const afternoon = ['2:00 PM', '3:00 PM', '4:00 PM'];
  
  const availability = [];
  for (let day of days) {
    if (Math.random() > 0.3) {
      const slots = [];
      if (Math.random() > 0.5) slots.push(...morning);
      if (Math.random() > 0.5) slots.push(...afternoon);
      availability.push({
        day: day,
        slots: slots,
        is_available: true
      });
    } else {
      availability.push({
        day: day,
        slots: [],
        is_available: false
      });
    }
  }
  return availability;
}

function generateTimeSlots() {
  const allSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM'
  ];
  
  const slots = [];
  const numSlots = Math.floor(Math.random() * 8) + 4;
  for (let i = 0; i < numSlots; i++) {
    const slot = allSlots[Math.floor(Math.random() * allSlots.length)];
    if (!slots.includes(slot)) {
      slots.push(slot);
    }
  }
  return slots.sort();
}

function getNextAvailableDate() {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 7) + 1);
  return date.toISOString().split('T')[0];
}

// ==================== REWARDS DATA ====================

// Points earning rules
const earningRules = [
  { id: 1, action: 'first_visit', points: 100, description: 'First appointment bonus', max_per_user: 1 },
  { id: 2, action: 'appointment_complete', points: 50, description: 'Complete an appointment', max_per_user: null },
  { id: 3, action: 'refer_friend', points: 200, description: 'Refer a friend who registers', max_per_user: 10 },
  { id: 4, action: 'write_review', points: 30, description: 'Write a doctor review', max_per_user: 50 },
  { id: 5, action: 'birthday_bonus', points: 150, description: 'Birthday bonus points', max_per_user: 1 },
  { id: 6, action: 'monthly_visit', points: 100, description: 'Monthly visit streak', max_per_user: 12 },
  { id: 7, action: 'share_feedback', points: 20, description: 'Share feedback about hospital', max_per_user: 10 },
  { id: 8, action: 'social_share', points: 15, description: 'Share on social media', max_per_user: 20 },
  { id: 9, action: 'report_download', points: 10, description: 'Download medical report', max_per_user: null },
  { id: 10, action: 'pharmacy_order', points: 25, description: 'Order medicines online', max_per_user: null }
];

// Points redemption offers
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
    image_url: 'https://example.com/health-checkup.jpg',
    terms: [
      'Valid for one person only',
      'Appointment required',
      'Valid for 3 months from redemption'
    ],
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
    image_url: 'https://example.com/lab-tests.jpg',
    terms: [
      'Minimum order value LKR 2000',
      'Cannot combine with other offers',
      'Valid for 2 months'
    ],
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
    image_url: 'https://example.com/delivery.jpg',
    terms: [
      'Maximum order value LKR 5000',
      'Valid only for selected areas',
      'One-time use only'
    ],
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
    image_url: 'https://example.com/dental.jpg',
    terms: [
      'Prior appointment required',
      'Includes basic cleaning only',
      'Valid for 2 months'
    ],
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
    image_url: 'https://example.com/consultation.jpg',
    terms: [
      'Minimum consultation fee LKR 1500',
      'Valid for all doctors',
      'Cannot be used with other offers'
    ],
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
    image_url: 'https://example.com/eye-checkup.jpg',
    terms: [
      'Includes basic eye examination',
      'Free eyeglass prescription',
      'Valid at any Singhe Hospital'
    ],
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
    image_url: 'https://example.com/health-card.jpg',
    terms: [
      'Priority appointment booking',
      '10% off on all services',
      'Free health articles access'
    ],
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
    image_url: 'https://example.com/coupon.jpg',
    terms: [
      'Minimum purchase LKR 1000',
      'Valid for one-time use',
      'Cannot be combined'
    ],
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
    image_url: 'https://example.com/workshop.jpg',
    terms: [
      'Includes refreshments',
      'Certificate of participation',
      'Online and offline options'
    ],
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
    image_url: 'https://example.com/physio.jpg',
    terms: [
      'Minimum 3 sessions required',
      'Valid for new patients only',
      'Cannot combine with insurance'
    ],
    is_featured: false,
    is_active: true
  }
];

// Points transaction history for different user tiers
const userTiers = [
  { tier: 'Bronze', min_points: 0, max_points: 499, color: '#CD7F32', benefits: ['Basic rewards'] },
  { tier: 'Silver', min_points: 500, max_points: 1499, color: '#C0C0C0', benefits: ['Basic rewards', '5% extra points'] },
  { tier: 'Gold', min_points: 1500, max_points: 2999, color: '#FFD700', benefits: ['Basic rewards', '10% extra points', 'Priority support'] },
  { tier: 'Platinum', min_points: 3000, max_points: 5999, color: '#E5E4E2', benefits: ['Basic rewards', '15% extra points', 'Priority support', 'Free health checkup'] },
  { tier: 'Diamond', min_points: 6000, max_points: 999999, color: '#B9F2FF', benefits: ['Basic rewards', '20% extra points', 'VIP support', 'Free health checkup', 'Annual health report'] }
];

// Generate points history for a user
function generatePointsHistory(userId, patientId, daysHistory = 365) {
  const history = [];
  let currentPoints = 0;
  
  // First visit bonus
  history.push({
    id: 1,
    user_id: userId,
    patient_id: patientId,
    points: 100,
    type: 'earn',
    description: 'Welcome bonus - First visit',
    category: 'bonus',
    reference_id: null,
    reference_type: null,
    created_at: faker.date.past(daysHistory, new Date(Date.now() - daysHistory * 24 * 60 * 60 * 1000))
  });
  currentPoints += 100;
  
  // Generate appointment completions
  const numAppointments = Math.floor(Math.random() * 20) + 5;
  for (let i = 1; i <= numAppointments; i++) {
    const date = faker.date.past(daysHistory);
    const points = 50 + (Math.random() > 0.8 ? 25 : 0); // Bonus points sometimes
    history.push({
      id: history.length + 1,
      user_id: userId,
      patient_id: patientId,
      points: points,
      type: 'earn',
      description: `Appointment completed with Dr. ${faker.person.fullName()}`,
      category: 'appointment',
      reference_id: Math.floor(Math.random() * 100) + 1,
      reference_type: 'appointment',
      created_at: date
    });
    currentPoints += points;
  }
  
  // Birthday bonus (if applicable)
  const birthdayDate = new Date();
  birthdayDate.setMonth(Math.floor(Math.random() * 12));
  birthdayDate.setDate(Math.floor(Math.random() * 28) + 1);
  if (birthdayDate < new Date()) {
    history.push({
      id: history.length + 1,
      user_id: userId,
      patient_id: patientId,
      points: 150,
      type: 'earn',
      description: 'Birthday bonus',
      category: 'bonus',
      reference_id: null,
      reference_type: null,
      created_at: birthdayDate
    });
    currentPoints += 150;
  }
  
  // Referral points
  const numReferrals = Math.floor(Math.random() * 5);
  for (let i = 1; i <= numReferrals; i++) {
    history.push({
      id: history.length + 1,
      user_id: userId,
      patient_id: patientId,
      points: 200,
      type: 'earn',
      description: `Referred friend: ${faker.person.fullName()}`,
      category: 'referral',
      reference_id: Math.floor(Math.random() * 1000) + 1000,
      reference_type: 'referral',
      created_at: faker.date.past(daysHistory - 30)
    });
    currentPoints += 200;
  }
  
  // Reviews written
  const numReviews = Math.floor(Math.random() * 10);
  for (let i = 1; i <= numReviews; i++) {
    history.push({
      id: history.length + 1,
      user_id: userId,
      patient_id: patientId,
      points: 30,
      type: 'earn',
      description: `Review for Dr. ${faker.person.fullName()}`,
      category: 'review',
      reference_id: Math.floor(Math.random() * 50) + 1,
      reference_type: 'doctor',
      created_at: faker.date.past(daysHistory - 15)
    });
    currentPoints += 30;
  }
  
  // Redeem some points
  const numRedemptions = Math.floor(Math.random() * Math.min(5, Math.floor(currentPoints / 200)));
  for (let i = 1; i <= numRedemptions; i++) {
    const pointsToRedeem = [100, 150, 200, 250, 300, 400, 500][Math.floor(Math.random() * 7)];
    if (pointsToRedeem <= currentPoints) {
      const offer = redemptionOffers[Math.floor(Math.random() * redemptionOffers.length)];
      history.push({
        id: history.length + 1,
        user_id: userId,
        patient_id: patientId,
        points: pointsToRedeem,
        type: 'redeem',
        description: `Redeemed: ${offer.title}`,
        category: 'redemption',
        reference_id: offer.id,
        reference_type: 'offer',
        created_at: faker.date.past(60)
      });
      currentPoints -= pointsToRedeem;
    }
  }
  
  // Sort by date
  return history.sort((a, b) => b.created_at - a.created_at);
}

// Generate monthly points summary
function generateMonthlyPoints(userId, year = new Date().getFullYear()) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const summary = [];
  
  for (let i = 0; i < 12; i++) {
    summary.push({
      month: months[i],
      year: year,
      points_earned: Math.floor(Math.random() * 500) + 50,
      points_redeemed: Math.floor(Math.random() * 300),
      net_points: Math.floor(Math.random() * 400) + 20
    });
  }
  
  return summary;
}

// ==================== LEADERBOARD DATA ====================

function generateLeaderboard() {
  const leaderboard = [];
  
  for (let i = 1; i <= 50; i++) {
    const totalPoints = Math.floor(Math.random() * 10000) + 100;
    let tier = userTiers[0];
    for (let t of userTiers) {
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
      badges: generateBadges(totalPoints),
      avatar_url: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50) + 1}.jpg`
    });
  }
  
  return leaderboard.sort((a, b) => b.points - a.points);
}

function generateBadges(points) {
  const badges = [];
  
  if (points >= 100) badges.push({ name: 'First Steps', icon: '👣', earned_at: faker.date.past(300) });
  if (points >= 500) badges.push({ name: 'Silver Star', icon: '⭐', earned_at: faker.date.past(200) });
  if (points >= 1000) badges.push({ name: 'Health Enthusiast', icon: '🏃', earned_at: faker.date.past(150) });
  if (points >= 2000) badges.push({ name: 'Wellness Warrior', icon: '🛡️', earned_at: faker.date.past(100) });
  if (points >= 3000) badges.push({ name: 'Gold Champion', icon: '🏆', earned_at: faker.date.past(50) });
  if (points >= 5000) badges.push({ name: 'Health Legend', icon: '👑', earned_at: faker.date.past(30) });
  
  return badges;
}

// ==================== CHALLENGES DATA ====================

const activeChallenges = [
  {
    id: 1,
    title: 'Monthly Health Check',
    description: 'Complete 3 appointments this month',
    type: 'appointment_count',
    target: 3,
    current_progress: 1,
    points_reward: 150,
    bonus_points: 50,
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    icon: '📅',
    is_completed: false
  },
  {
    id: 2,
    title: 'Share & Care',
    description: 'Share your health report on social media',
    type: 'social_share',
    target: 1,
    current_progress: 0,
    points_reward: 50,
    bonus_points: 0,
    start_date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
    icon: '📱',
    is_completed: false
  },
  {
    id: 3,
    title: 'Family Care',
    description: 'Add 2 family members to your account',
    type: 'family_members',
    target: 2,
    current_progress: 1,
    points_reward: 200,
    bonus_points: 100,
    start_date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 30)),
    icon: '👨‍👩‍👧',
    is_completed: false
  },
  {
    id: 4,
    title: 'Review Master',
    description: 'Write 5 doctor reviews',
    type: 'reviews',
    target: 5,
    current_progress: 2,
    points_reward: 100,
    bonus_points: 50,
    start_date: new Date(),
    end_date: new Date(new Date().setDate(new Date().getDate() + 45)),
    icon: '✍️',
    is_completed: false
  }
];

// ==================== EXPORT ALL DATA ====================

module.exports = {
  doctors,
  specializations,
  hospitals,
  earningRules,
  redemptionOffers,
  userTiers,
  generatePointsHistory,
  generateMonthlyPoints,
  generateLeaderboard,
  activeChallenges
};