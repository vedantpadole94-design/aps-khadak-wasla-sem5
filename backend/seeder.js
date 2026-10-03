const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./src/models/User');
const Principal = require('./src/models/Principal');
const Faculty = require('./src/models/Faculty');
const Result = require('./src/models/Result');
const Notice = require('./src/models/Notice');
const Event = require('./src/models/Event');
const Popup = require('./src/models/Popup');
const SiteSettings = require('./src/models/SiteSettings');
const PageContent = require('./src/models/PageContent');
const Gallery = require('./src/models/Gallery');

const seedableModels = [Principal, Faculty, Result, Notice, Event, Popup, SiteSettings, PageContent, Gallery];

const SCHOOL_DATA = {
  name: "Army Public School Khadakwasla",
  affiliation: "1180026",
  schoolCode: "34114",
  email: "apskhadakwasla1@gmail.com",
  contact: "020-25290084",
  website: "www.apskhadakwasla.in",
  address: "Barrack No. 03, Opp Gole Market, NDA Khadakwasla, Pune 411023",
  principal: {
    name: "Dr. Yasmin Kaur",
    qualification: "BSc(Chemistry), MSc(Organic Chemistry), B.Ed, PGDEA",
    since: "2020",
    message: "Greetings, dear students, parents, and educators,\n\nAt APS Khadakwasla, we believe in the power of education to transform lives and shape a brighter future. As we embark on this academic journey together, I am thrilled to share our commitment to providing an inspiring and holistic learning environment for all. With the recent implementation of the National Education Policy (NEP), we are embracing innovative pedagogical approaches that cater to individual learning styles, foster critical thinking, and nurture a lifelong love for learning.\n\nOur dedicated team of educators is steadfast in their pursuit of excellence, adapting teaching methodologies to align with the evolving needs of our students and the dynamic world around us. As the principal, my vision is to empower our students to become confident, compassionate, and responsible global citizens."
  },
  motto: "Truth is God | Service Before Self"
};

const resultsClassX = [
  { classLevel: "X", year: "2021-22", registered: 119, passed: 119, percentage: "100%", remarks: "Centum Pass" },
  { classLevel: "X", year: "2022-23", registered: 121, passed: 120, percentage: "99.11%", remarks: "Excellent performance" },
  { classLevel: "X", year: "2023-24", registered: 111, passed: 111, percentage: "100%", remarks: "100% Pass Rate" },
  { classLevel: "X", year: "2024-25", registered: 124, passed: 124, percentage: "100%", remarks: "Centum Pass" },
];

const resultsClassXII = [
  { classLevel: "XII", year: "2022-23", registered: 53, passed: 52, percentage: "98.11%", remarks: "Compartment cleared" },
  { classLevel: "XII", year: "2023-24", registered: 46, passed: 46, percentage: "100%", remarks: "100% First Division" },
  { classLevel: "XII", year: "2024-25", registered: 64, passed: 64, percentage: "100%", remarks: "Outstanding Results" },
];

const rawTGT = [
  { name: "Veena Nair", qual: "B.A.BP Ed.", dept: "Physical Education" },
  { name: "Rumpi", qual: "MA (Eng)", dept: "English" },
  { name: "Deepali Mane", qual: "M.Sc.(Micro.)", dept: "Science" },
  { name: "Shanmuga", qual: "M.Sc.(Maths)", dept: "Mathematics" },
  { name: "Anamika", qual: "MBA, MA(Hindi)", dept: "Hindi" },
  { name: "Manita Thapa", qual: "M.A. B.Ed", dept: "Social Science" },
  { name: "Vaibhav Bende", qual: "M.A.", dept: "Social Science" },
  { name: "Manju Tiwari", qual: "M.Sc", dept: "Science" },
  { name: "Deepak Nalawade", qual: "B.A. B.Ed", dept: "Marathi" },
  { name: "Sumana Nayak", qual: "M.Sc", dept: "Science" },
  { name: "Poonam Sharma", qual: "MA B Ed", dept: "English" },
  { name: "Supriya Dhas", qual: "M.Sc.", dept: "Mathematics" },
  { name: "Hema Addapaka", qual: "M.Sc.(Statistics)", dept: "Mathematics" },
  { name: "Pratibha A", qual: "M.Sc B.Ed", dept: "Science" },
  { name: "Dipali Dani", qual: "M.A.(Eng)", dept: "English" },
  { name: "Rani Tiwari", qual: "MCA", dept: "Computer Science" },
  { name: "Rashmi Khanojia", qual: "MSC(Org. Chemistry)", dept: "Science" },
  { name: "Sharad Bhoite", qual: "M.A. (Hin.Eco.)", dept: "Hindi" }
];

const rawPRT = [
  { name: "Jaswinder Kaur", qual: "M.A.", dept: "Primary" },
  { name: "Savita Kulkarni", qual: "B.Sc.(Elect.)", dept: "Primary" },
  { name: "ShashiBala Sharma", qual: "B.Sc", dept: "Primary" },
  { name: "Smita Ghadge", qual: "B.Sc", dept: "Primary" },
  { name: "Ritu Ghatnekar", qual: "M.Sc(G.C.)", dept: "Primary" },
  { name: "Rashika Singh", qual: "B.Sc", dept: "Primary" },
  { name: "Krishna Sathisan", qual: "B.Sc.(Micro.)", dept: "Primary" },
  { name: "Laxmi Pol", qual: "B.Sc.", dept: "Primary" },
  { name: "Swati Sagar", qual: "M.B.A", dept: "Primary" },
  { name: "Arundhati Kale", qual: "M.B.A", dept: "Primary" },
  { name: "Heena Chauhan", qual: "B.Tech", dept: "Primary" },
  { name: "Gauri Singh", qual: "M.A.(Hindi)", dept: "Primary" },
  { name: "Chetana Bhat", qual: "B.Sc.,M.C.A.", dept: "Primary / Computers" },
  { name: "Maya Luthra", qual: "B.A.", dept: "Primary" },
  { name: "Megha Wankhade", qual: "B.Com/M.A", dept: "Primary" },
  { name: "Sarita Mukkawar", qual: "M.Sc.", dept: "Primary" },
  { name: "Shikha", qual: "M.Sc", dept: "Primary" },
  { name: "Akriti Thapliyal", qual: "B.Ed, M.A.", dept: "Primary" },
  { name: "Kavita Khodke", qual: "B.Sc(Comp), M.A.(Dance)", dept: "Arts & Dance" },
  { name: "Swati Gaikwad", qual: "M.A.(Music/Eng.)", dept: "Music" }
];

const rawAdmin = [
  { name: "Bharat Singh", desig: "ADM Supervisor", dept: "Administration", qual: "Ex-Serviceman" },
  { name: "Satish Jadhav", desig: "Computer Lab Tech", dept: "Technical Support", qual: "B.Sc (Comp Sci)" },
  { name: "Puja", desig: "LDC", dept: "Accounts & Administration", qual: "B.Com" },
  { name: "Deepa", desig: "LDC", dept: "Office Staff", qual: "B.A." },
  { name: "Namita", desig: "LDC", dept: "Office Staff", qual: "B.Sc" },
  { name: "Priti Wakade", desig: "Science Lab Tech", dept: "Science Labs", qual: "B.Sc Chemistry" }
];

const importData = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
    // In development, fall back to 'aps123' if ADMIN_PASSWORD is not set or is still a placeholder.
    const isPlaceholder =
      !process.env.ADMIN_PASSWORD ||
      process.env.ADMIN_PASSWORD.startsWith('replace-with');
    const adminPassword = isPlaceholder ? 'aps123' : process.env.ADMIN_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    const existingDataCount = (await Promise.all(
      seedableModels.map((Model) => Model.countDocuments())
    )).reduce((total, count) => total + count, 0);
    if (existingDataCount > 0 && !process.argv.includes('--force')) {
      throw new Error('The database already contains site data. Seeding would replace it; rerun with --force only if that is intended.');
    }
    if (existingDataCount > 0) {
      console.warn('WARNING: --force will replace seeded site content in the configured database.');
    }

    // Create or update only the configured administrator account.
    let admin = await User.findOne({ username: adminUsername });
    if (!admin) admin = new User({ username: adminUsername, password: adminPassword });
    else admin.password = adminPassword;
    await admin.save();
    console.log(`✅ Administrator account configured: ${adminUsername}`);

    // 2. Principal
    await Principal.deleteMany();
    await Principal.create({
      name: SCHOOL_DATA.principal.name,
      qualification: SCHOOL_DATA.principal.qualification,
      since: SCHOOL_DATA.principal.since,
      message: SCHOOL_DATA.principal.message,
      photo: '/assets/aps-logo.svg'
    });
    console.log('✅ Principal profile seeded');

    // 3. Results
    await Result.deleteMany();
    await Result.insertMany([...resultsClassX, ...resultsClassXII]);
    console.log('✅ Class X & XII results seeded');

    // 4. Faculty
    await Faculty.deleteMany();
    const facultyDocs = [
      {
        name: "Dr. Yasmin Kaur",
        designation: "Principal",
        department: "Administration",
        qualification: "BSc(Chemistry), MSc(Organic Chemistry), B.Ed, PGDEA",
        experience: 22,
        email: "principal@apskhadakwasla.in"
      },
      {
        name: "Miss. Preeti Madhuri",
        designation: "Special Educator",
        department: "Special Education",
        qualification: "B.Ed (Special Education), M.A. Psychology",
        experience: 8
      },
      {
        name: "Miss. Prerna Gosain",
        designation: "Counsellor",
        department: "Student Wellness",
        qualification: "M.Sc Clinical Psychology, PGD Guidance",
        experience: 6
      },
      ...rawTGT.map(t => ({
        name: t.name,
        designation: "TGT",
        department: t.dept,
        qualification: t.qual,
        experience: 10
      })),
      ...rawPRT.map(p => ({
        name: p.name,
        designation: "PRT",
        department: p.dept,
        qualification: p.qual,
        experience: 7
      })),
      ...rawAdmin.map(a => ({
        name: a.name,
        designation: a.desig,
        department: a.dept,
        qualification: a.qual,
        experience: 9
      }))
    ];
    await Faculty.insertMany(facultyDocs);
    console.log(`✅ Faculty seeded (${facultyDocs.length} members)`);

    // 5. Notices
    await Notice.deleteMany();
    await Notice.insertMany([
      {
        title: "Admissions Information",
        content: "Contact the school for current admissions information and eligibility guidance.",
        priority: "high",
        isActive: true,
        isTicker: true,
        category: "Admission"
      },
      {
        title: "Inter-House Folk Song Competition Winners Announced",
        content: "Hearty congratulations to the winners: Pragati Sonar, Vaibhavi Sonawane, Devansh Ghadage, Avanti Salunke, Prachi Singh, Shravani Devare, Lara Gawade, Kumari Saloni, Abhijeet Dhokrat, and Jyoti Sarode.",
        priority: "medium",
        isActive: true,
        isTicker: true,
        category: "CCA"
      },
      {
        title: "CBSE Board Examination 100% Pass Result Celebration",
        content: "APS Khadakwasla achieves 100% pass rate in CBSE Class X & Class XII. Commendations to all educators and students.",
        priority: "high",
        isActive: true,
        isTicker: true,
        category: "Academics"
      },
      {
        title: "Quarterly Fee Payment Guidelines via Digi-Campus",
        content: "Parents are requested to pay quarterly tuition fees online before the 15th of the corresponding quarter month to avoid late fee penalties.",
        priority: "low",
        isActive: true,
        isTicker: false,
        category: "Fees"
      }
    ]);
    console.log('✅ Notices seeded');

    // 6. Events / Calendar
    await Event.deleteMany();
    await Event.insertMany([
      {
        title: "Annual Sports Day & NDA March Past",
        description: "Inter-house athletic meet and NDA parade display on the school grounds.",
        date: new Date(Date.now() + 10 * 86400000),
        category: "Sports",
        color: "#138808"
      },
      {
        title: "Periodic Assessment - II",
        description: "Unit exams for Classes VI through XII as per CBSE curriculum.",
        date: new Date(Date.now() + 20 * 86400000),
        category: "Exam",
        color: "#DC143C"
      },
      {
        title: "Parent-Teacher Meeting (PTM)",
        description: "Discussion of student progress, academic milestones and feedback.",
        date: new Date(Date.now() + 27 * 86400000),
        category: "PTM",
        color: "#D4AF37"
      },
      {
        title: "National Science & Robotics Exhibition",
        description: "Interactive student exhibits showcasing AI, green energy, and science models.",
        date: new Date(Date.now() + 35 * 86400000),
        category: "Academic",
        color: "#0A1628"
      }
    ]);
    console.log('✅ Events seeded');

    // 7. Popups
    await Popup.deleteMany();
    await Popup.create({
      title: "Welcome to APS Khadakwasla",
      message: "Visit the admissions page for school information and contact details.",
      isActive: true,
      delay: 2,
      autoDismiss: 10,
      showOnPages: ["home", "admission", "contact"]
    });
    console.log('✅ Welcome Popup created');

    // 8. Site Settings
    await SiteSettings.deleteMany();
    await SiteSettings.create({
      schoolName: SCHOOL_DATA.name,
      email: SCHOOL_DATA.email,
      phone: SCHOOL_DATA.contact,
      address: SCHOOL_DATA.address,
      principalName: SCHOOL_DATA.principal.name,
      enquiryEmail: process.env.ENQUIRY_EMAIL || '',
      facebook: "https://facebook.com/apskhadakwasla",
      instagram: "https://instagram.com/apskhadakwasla",
      youtube: "https://youtube.com/apskhadakwasla"
    });
    console.log('✅ Site Settings seeded');

    // 9. Gallery
    await Gallery.deleteMany();
    await Gallery.insertMany([
      { caption: "National Defence Academy (NDA) Alma Mater Premises", url: "/assets/hero.png", category: "Campus", isCover: true },
      { caption: "Modern Science & Robotics Laboratory Session", url: "/assets/hero.png", category: "Academics" },
      { caption: "Inter-House Athletics & March-Past Championship", url: "/assets/hero.png", category: "Sports" },
      { caption: "Annual Cultural Fest & Folk Song Symphony", url: "/assets/hero.png", category: "Cultural" },
      { caption: "Smart Digital Classrooms & Interactive Learning", url: "/assets/hero.png", category: "Campus" }
    ]);
    console.log('✅ Gallery items seeded');

    // 10. Page Contents
    await PageContent.deleteMany();
    await PageContent.insertMany([
      {
        pageKey: 'about',
        title: 'About Us',
        content: {
          eyebrow: 'Our story and values',
          title: 'About Us',
          intro: 'A legacy of academic excellence, holistic development and disciplined service to defence families.',
          sections: [
            {
              id: 'history',
              title: 'History',
              text: 'NDA English School was established on 1st February 1955. In 1975, it was taken over by the National Defence Academy (NDA) from the Pune Jesuits Society. The following year, in 1976, the school was registered under the Society Registration Act and later under the Zilla Parishad in 1980. A major milestone came in 2012 when the school was upgraded to Army Public School (APS) Khadakwasla, with Class VI as the highest class at the time.\n\nThe school continued to grow steadily, receiving affiliation from the Central Board of Secondary Education (CBSE) on 10th February 2014. In 2016, it was further upgraded to include Class X, effective from 1st April. Another significant achievement came on 11th August 2021, when APS Khadakwasla was upgraded to a Senior Secondary School, offering education up to Class XII.\n\nAt present, the school comprises 38 well-equipped classrooms and provides quality education from Classes I to XII. With a student strength of over 1,700, APS Khadakwasla continues to uphold its legacy of academic excellence and holistic development in a disciplined and nurturing environment.'
            },
            {
              id: 'vision',
              title: 'Vision and Mission',
              text: 'Be an organization committed to excellence for holistic development of children, making them global citizens for nation building. To provide enabling learning environment with empowered faculty and required Infrastructure for children to realise full potential and face challenges of life.'
            },
            {
              id: 'awes',
              title: 'Army Welfare Education Society (AWES)',
              text: 'Army Public School Khadakwasla is part of the wide network of schools governed by Army Welfare Education Society, which aims to provide quality education to wards of defence personnel.'
            },
            {
              id: 'rules',
              title: 'School Rules & Discipline',
              text: '1. Identity card must be worn to school on all days and the school diary must be brought every day.\n2. Minimum 75% attendance is required; leave should be applied for in advance and supported by a medical certificate when needed.\n3. Students are expected to greet teachers and elders, show behavioural excellence.\n4. Students must be present 10 minutes before the scheduled time (Gate closes at 7:40 AM).\n5. Uniforms must be neat, washed and ironed, with well-groomed hair.\n6. Mobile phones are strictly prohibited on campus.'
            }
          ]
        }
      },
      {
        pageKey: 'infrastructure',
        title: 'Infrastructure',
        content: {
          eyebrow: 'Our campus',
          title: 'Infrastructure',
          intro: 'A safe, modern and stimulating campus designed to help every learner explore, create and grow.',
          sections: [
            {
              title: 'Campus at a glance',
              type: 'stats',
              items: [['38', 'Classrooms'], ['2', 'Computer labs'], ['3', 'Science labs'], ['9,000+', 'Library books'], ['136', 'Computers'], ['146', 'CCTV cameras'], ['34', 'Smart boards'], ['2', 'Gardens']]
            },
            {
              title: 'Smart Classrooms',
              text: 'Each of the 38 classrooms is well equipped with quality study furniture, racks, cupboards, bulletin boards and 34 interactive smart boards for multimedia-rich pedagogical instruction.'
            },
            {
              title: 'Computer & AI Labs',
              text: 'Our labs house 136 computer systems including Dell and HP PCs, thin clients and dedicated servers, facilitating modern computer education from Class I through XII.'
            },
            {
              title: 'Library',
              text: 'Our resource-rich library features over 9,000 curated titles, 20 magazines, daily periodicals, and 12 digital Kindles covering literature, sciences, and competitive exams.'
            },
            {
              title: 'Sports & NDA Grounds',
              text: 'Access to extensive physical training amenities including athletics tracks, badminton courts, football, cricket, basketball, Kho-Kho, Kabbadi, and yoga.'
            }
          ]
        }
      },
      {
        pageKey: 'cca',
        title: 'Co-Curricular Activities',
        content: {
          eyebrow: 'Beyond the classroom',
          title: 'Co-Curricular Activities',
          intro: 'Students discover their talents, build collaboration and express creativity through an enriching co-curricular calendar.',
          sections: [
            {
              title: 'House System',
              text: 'Active four-house system comprising Shivaji House, RanaPratap House, Ashoka House, and Ranjit House participating in literary, athletic, and cultural competitions.'
            },
            {
              title: 'Inter-House Folk Song Champions',
              text: 'Hearty congratulations to the winning students: Pragati Sonar, Vaibhavi Sonawane, Devansh Ghadage, Avanti Salunke, Prachi Singh, Shravani Devare, Lara Gawade, Kumari Saloni, Abhijeet Dhokrat, and Jyoti Sarode.'
            }
          ]
        }
      }
    ]);
    console.log('✅ Page Contents seeded');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error during seeding:', err);
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  }
};

importData();
