const axios = require('axios');

const strapiUrl = 'http://127.0.0.1:1337';

const usersData = [
  {
    username: 'ahmed_khan',
    email: 'ahmed.khan@example.com',
    password: '123456',
    fullName: 'Ahmed Khan',
    university: 'LCWU',
    degree: 'MS Software Engineering',
    courses: ['DSA', 'OOP', 'French'],
    interests: ['AI', 'Web Dev', 'drawing'],
    bio: 'Passionate about AI and web development.',
  },
  {
    username: 'fatima_ali',
    email: 'fatima.ali@example.com',
    password: '123456',
    fullName: 'Fatima Ali',
    university: 'LCWU',
    degree: 'MS Software Engineering',
    courses: ['DSA', 'SOC', 'English Literature'],
    interests: ['Web Dev', 'GD'],
    bio: 'Exploring the world of web development and design.',
  },
  {
    username: 'bilal_hassan',
    email: 'bilal.hassan@example.com',
    password: '123456',
    fullName: 'Bilal Hassan',
    university: 'LUMS',
    degree: 'BS Computer Science',
    courses: ['Software Engineering', 'Ecom'],
    interests: ['drawing', 'AI'],
    bio: 'A software engineer passionate about AI and innovation.',
  },
  {
    username: 'zainab_naeem',
    email: 'zainab.naeem@example.com',
    password: '123456',
    fullName: 'Zainab Naeem',
    university: 'NED University',
    degree: 'BEng Electrical Engineering',
    courses: ['SRE', 'GAD'],
    interests: ['Embedded Systems', 'IoT'],
    bio: 'Exploring IoT and embedded systems design.',
  },
  {
    username: 'umer_shaikh',
    email: 'umer.shaikh@example.com',
    password: '123456',
    fullName: 'Umer Shaikh',
    university: 'UET Lahore',
    degree: 'BS Civil Engineering',
    courses: ['FYP-II', 'SOC'],
    interests: ['Construction Management', 'Structural Design'],
    bio: 'A civil engineer focused on structural design and construction management.',
  },
  {
    username: 'saira_qureshi',
    email: 'saira.qureshi@example.com',
    password: '123456',
    fullName: 'Saira Qureshi',
    university: 'University of Punjab',
    degree: 'BBA Business Administration',
    courses: ['English Literature', 'French'],
    interests: ['Marketing', 'Entrepreneurship'],
    bio: 'Business enthusiast with a passion for marketing and entrepreneurship.',
  },
  {
    username: 'mohsin_javed',
    email: 'mohsin.javed@example.com',
    password: '123456',
    fullName: 'Mohsin Javed',
    university: 'FAST-NU',
    degree: 'BS Data Science',
    courses: ['DSA', 'Python Programming'],
    interests: ['Data Visualization', 'Machine Learning'],
    bio: 'Data scientist passionate about machine learning and data visualization.',
  },
  {
    username: 'laiba_farooq',
    email: 'laiba.farooq@example.com',
    password: '123456',
    fullName: 'Laiba Farooq',
    university: 'IBA Karachi',
    degree: 'BS Economics',
    courses: ['Ecom', 'GAD'],
    interests: ['Financial Markets', 'Macroeconomics'],
    bio: 'Economist with a keen interest in financial markets and macroeconomics.',
  },
  {
    username: 'hamza_rashid',
    email: 'hamza.rashid@example.com',
    password: '123456',
    fullName: 'Hamza Rashid',
    university: 'Quaid-i-Azam University',
    degree: 'MS Mathematics',
    courses: ['OOP', 'Algorithms'],
    interests: ['Statistics', 'Research'],
    bio: 'Mathematician and researcher with a passion for statistics and algorithms.',
  },
  {
    username: 'hina_abbasi',
    email: 'hina.abbasi@example.com',
    password: '123456',
    fullName: 'Hina Abbasi',
    university: 'GCU Lahore',
    degree: 'BS Psychology',
    courses: ['English Literature'],
    interests: ['Cognitive Psychology', 'Mental Health'],
    bio: 'Psychologist interested in cognitive psychology and mental health awareness.',
  },
];

async function createUser(user) {
  try {
    console.log(`🔄 Registering: ${user.username}`);

    // Step 1: Register user
    const registerRes = await axios.post(`${strapiUrl}/api/auth/local/register`, {
      username: user.username,
      email: user.email,
      password: user.password,
    });

    const { jwt, user: createdUser } = registerRes.data;
    console.log(`✅ Registered: ${createdUser.username}`);

    // Step 2: Update user profile fields (PUT to /api/users/:id)
    await axios.put(
      `${strapiUrl}/api/users/${createdUser.id}`,
      {
        fullName: user.fullName,
        university: user.university,
        degree: user.degree,
        courses: user.courses,
        interests: user.interests,
        bio: user.bio,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    console.log(`🎯 Updated profile for: ${user.username}`);
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.response?.data || err.message;
    console.error(`❌ Error for ${user.username}:`, msg);
  }
}

(async () => {
  for (const user of usersData) {
    await createUser(user);
  }
  console.log('🚀 All dummy users created and updated.');
})();
