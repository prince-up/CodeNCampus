/**
 * Seed Script for CodeNCampus School Management System
 * Creates comprehensive demo data for development/testing
 * Run: npm run seed
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Models
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Exam = require('../models/Exam');
const Result = require('../models/Result');
const Fee = require('../models/Fee');
const Notice = require('../models/Notice');
const Timetable = require('../models/Timetable');

// ─────────────────────────────────────────────
// Helper utilities
// ─────────────────────────────────────────────
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const datesBetween = (start, end) => {
  const dates = [];
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) dates.push(new Date(cur)); // skip weekends
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};

// ─────────────────────────────────────────────
// Static seed data
// ─────────────────────────────────────────────
const CLASSES = ['1','2','3','4','5','6','7','8','9','10','11','12'];

const TEACHER_DATA = [
  { name: 'Rajesh Kumar',    email: 'rajesh@codencampus.com',   phone: '9876543001', gender: 'male',   employeeId: 'EMP001', qualification: 'M.Sc Mathematics',      designation: 'Senior Teacher', salary: 45000, subjects: ['Mathematics'], classes: ['9','10','11','12'] },
  { name: 'Priya Sharma',    email: 'priya@codencampus.com',    phone: '9876543002', gender: 'female', employeeId: 'EMP002', qualification: 'M.A. English',           designation: 'Teacher',        salary: 40000, subjects: ['English'],     classes: ['6','7','8','9','10'] },
  { name: 'Amit Verma',      email: 'amit@codencampus.com',     phone: '9876543003', gender: 'male',   employeeId: 'EMP003', qualification: 'M.Sc Physics',           designation: 'Senior Teacher', salary: 42000, subjects: ['Physics'],     classes: ['11','12'] },
  { name: 'Sunita Gupta',    email: 'sunita@codencampus.com',   phone: '9876543004', gender: 'female', employeeId: 'EMP004', qualification: 'M.Sc Chemistry',         designation: 'Teacher',        salary: 41000, subjects: ['Chemistry'],   classes: ['11','12'] },
  { name: 'Mohan Patel',     email: 'mohan@codencampus.com',    phone: '9876543005', gender: 'male',   employeeId: 'EMP005', qualification: 'B.A. History, B.Ed',     designation: 'Teacher',        salary: 38000, subjects: ['History'],     classes: ['6','7','8'] },
  { name: 'Kavita Singh',    email: 'kavita@codencampus.com',   phone: '9876543006', gender: 'female', employeeId: 'EMP006', qualification: 'M.Sc Computer Science',  designation: 'Lab Teacher',    salary: 43000, subjects: ['Computer'],    classes: ['9','10','11','12'] },
];

const SUBJECT_DATA = [
  // Classes 1-5
  { name: 'Mathematics', code: 'MATH-1-5', class: '1' },
  { name: 'English',     code: 'ENG-1-5',  class: '1' },
  { name: 'Mathematics', code: 'MATH-5',   class: '5' },
  { name: 'English',     code: 'ENG-5',    class: '5' },
  // Classes 6-8
  { name: 'Mathematics', code: 'MATH-6',   class: '6' },
  { name: 'English',     code: 'ENG-6',    class: '6' },
  { name: 'History',     code: 'HIST-6',   class: '6' },
  { name: 'Mathematics', code: 'MATH-7',   class: '7' },
  { name: 'English',     code: 'ENG-7',    class: '7' },
  { name: 'History',     code: 'HIST-7',   class: '7' },
  { name: 'Mathematics', code: 'MATH-8',   class: '8' },
  { name: 'English',     code: 'ENG-8',    class: '8' },
  { name: 'History',     code: 'HIST-8',   class: '8' },
  // Classes 9-10
  { name: 'Mathematics', code: 'MATH-9',   class: '9' },
  { name: 'English',     code: 'ENG-9',    class: '9' },
  { name: 'Computer',    code: 'COMP-9',   class: '9' },
  { name: 'Mathematics', code: 'MATH-10',  class: '10' },
  { name: 'English',     code: 'ENG-10',   class: '10' },
  { name: 'Computer',    code: 'COMP-10',  class: '10' },
  // Classes 11-12
  { name: 'Mathematics', code: 'MATH-11',  class: '11' },
  { name: 'Physics',     code: 'PHY-11',   class: '11' },
  { name: 'Chemistry',   code: 'CHEM-11',  class: '11' },
  { name: 'Computer',    code: 'COMP-11',  class: '11' },
  { name: 'Mathematics', code: 'MATH-12',  class: '12' },
  { name: 'Physics',     code: 'PHY-12',   class: '12' },
  { name: 'Chemistry',   code: 'CHEM-12',  class: '12' },
  { name: 'Computer',    code: 'COMP-12',  class: '12' },
];

const STUDENT_DATA = [
  { name: 'Aarav Sharma',     email: 'aarav@student.com',     phone: '9900001001', rollNo: 'STU001', class: '10', section: 'A', gender: 'male',   parentName: 'Ramesh Sharma',   parentPhone: '9800001001', bloodGroup: 'A+', address: '12 MG Road, Delhi' },
  { name: 'Priya Patel',      email: 'priya.s@student.com',   phone: '9900001002', rollNo: 'STU002', class: '10', section: 'A', gender: 'female', parentName: 'Suresh Patel',    parentPhone: '9800001002', bloodGroup: 'B+', address: '45 Park Street, Mumbai' },
  { name: 'Rohan Mehta',      email: 'rohan@student.com',     phone: '9900001003', rollNo: 'STU003', class: '10', section: 'A', gender: 'male',   parentName: 'Vijay Mehta',     parentPhone: '9800001003', bloodGroup: 'O+', address: '78 Lake View, Pune' },
  { name: 'Ananya Singh',     email: 'ananya@student.com',    phone: '9900001004', rollNo: 'STU004', class: '10', section: 'A', gender: 'female', parentName: 'Arun Singh',      parentPhone: '9800001004', bloodGroup: 'AB+','address': '23 Gandhi Nagar, Jaipur' },
  { name: 'Karan Gupta',      email: 'karan@student.com',     phone: '9900001005', rollNo: 'STU005', class: '10', section: 'A', gender: 'male',   parentName: 'Deepak Gupta',    parentPhone: '9800001005', bloodGroup: 'A-', address: '56 Station Road, Agra' },
  { name: 'Sneha Reddy',      email: 'sneha@student.com',     phone: '9900001006', rollNo: 'STU006', class: '11', section: 'A', gender: 'female', parentName: 'Venkat Reddy',    parentPhone: '9800001006', bloodGroup: 'B-', address: '89 IT Park, Hyderabad' },
  { name: 'Amit Joshi',       email: 'amit.j@student.com',    phone: '9900001007', rollNo: 'STU007', class: '11', section: 'A', gender: 'male',   parentName: 'Sunil Joshi',     parentPhone: '9800001007', bloodGroup: 'O-', address: '34 Hill View, Shimla' },
  { name: 'Divya Nair',       email: 'divya@student.com',     phone: '9900001008', rollNo: 'STU008', class: '11', section: 'A', gender: 'female', parentName: 'Rajesh Nair',     parentPhone: '9800001008', bloodGroup: 'A+', address: '67 Beach Road, Kochi' },
  { name: 'Siddharth Roy',    email: 'siddharth@student.com', phone: '9900001009', rollNo: 'STU009', class: '12', section: 'A', gender: 'male',   parentName: 'Subhash Roy',     parentPhone: '9800001009', bloodGroup: 'B+', address: '12 College Street, Kolkata' },
  { name: 'Meera Iyer',       email: 'meera@student.com',     phone: '9900001010', rollNo: 'STU010', class: '12', section: 'A', gender: 'female', parentName: 'Rajan Iyer',      parentPhone: '9800001010', bloodGroup: 'AB-','address': '45 Anna Nagar, Chennai' },
  { name: 'Arjun Kumar',      email: 'arjun@student.com',     phone: '9900001011', rollNo: 'STU011', class: '9',  section: 'A', gender: 'male',   parentName: 'Ashok Kumar',     parentPhone: '9800001011', bloodGroup: 'O+', address: '78 Sector 21, Noida' },
  { name: 'Pooja Mishra',     email: 'pooja@student.com',     phone: '9900001012', rollNo: 'STU012', class: '9',  section: 'A', gender: 'female', parentName: 'Rakesh Mishra',   parentPhone: '9800001012', bloodGroup: 'A+', address: '23 Civil Lines, Allahabad' },
  { name: 'Rahul Verma',      email: 'rahul@student.com',     phone: '9900001013', rollNo: 'STU013', class: '9',  section: 'A', gender: 'male',   parentName: 'Manoj Verma',     parentPhone: '9800001013', bloodGroup: 'B+', address: '56 Vikas Nagar, Lucknow' },
  { name: 'Ishaan Chopra',    email: 'ishaan@student.com',    phone: '9900001014', rollNo: 'STU014', class: '8',  section: 'A', gender: 'male',   parentName: 'Naresh Chopra',   parentPhone: '9800001014', bloodGroup: 'O-', address: '89 Model Town, Amritsar' },
  { name: 'Tanvi Shah',       email: 'tanvi@student.com',     phone: '9900001015', rollNo: 'STU015', class: '8',  section: 'A', gender: 'female', parentName: 'Nilesh Shah',     parentPhone: '9800001015', bloodGroup: 'A-', address: '34 CG Road, Ahmedabad' },
  { name: 'Vikram Malhotra',  email: 'vikram@student.com',    phone: '9900001016', rollNo: 'STU016', class: '7',  section: 'A', gender: 'male',   parentName: 'Rajiv Malhotra',  parentPhone: '9800001016', bloodGroup: 'B-', address: '67 Rajouri Garden, Delhi' },
  { name: 'Nisha Tiwari',     email: 'nisha@student.com',     phone: '9900001017', rollNo: 'STU017', class: '7',  section: 'A', gender: 'female', parentName: 'Satish Tiwari',   parentPhone: '9800001017', bloodGroup: 'AB+','address': '12 Cantonment, Meerut' },
  { name: 'Dev Pandey',       email: 'dev@student.com',       phone: '9900001018', rollNo: 'STU018', class: '6',  section: 'A', gender: 'male',   parentName: 'Vivek Pandey',    parentPhone: '9800001018', bloodGroup: 'O+', address: '45 Indiranagar, Bangalore' },
  { name: 'Riya Bose',        email: 'riya@student.com',      phone: '9900001019', rollNo: 'STU019', class: '6',  section: 'A', gender: 'female', parentName: 'Sanjay Bose',     parentPhone: '9800001019', bloodGroup: 'A+', address: '78 Salt Lake, Kolkata' },
  { name: 'Aditya Rao',       email: 'aditya@student.com',    phone: '9900001020', rollNo: 'STU020', class: '5',  section: 'A', gender: 'male',   parentName: 'Prasad Rao',      parentPhone: '9800001020', bloodGroup: 'B+', address: '23 Banjara Hills, Hyderabad' },
  { name: 'Sakshi Jain',      email: 'sakshi@student.com',    phone: '9900001021', rollNo: 'STU021', class: '5',  section: 'A', gender: 'female', parentName: 'Dinesh Jain',     parentPhone: '9800001021', bloodGroup: 'O-', address: '56 Vaishali, Ghaziabad' },
  { name: 'Harsh Agarwal',    email: 'harsh@student.com',     phone: '9900001022', rollNo: 'STU022', class: '4',  section: 'A', gender: 'male',   parentName: 'Mohit Agarwal',   parentPhone: '9800001022', bloodGroup: 'A-', address: '89 Lal Bagh, Lucknow' },
  { name: 'Shruti Yadav',     email: 'shruti@student.com',    phone: '9900001023', rollNo: 'STU023', class: '4',  section: 'A', gender: 'female', parentName: 'Umesh Yadav',     parentPhone: '9800001023', bloodGroup: 'AB-','address': '34 Sigra, Varanasi' },
  { name: 'Kunal Bajaj',      email: 'kunal@student.com',     phone: '9900001024', rollNo: 'STU024', class: '3',  section: 'A', gender: 'male',   parentName: 'Puneet Bajaj',    parentPhone: '9800001024', bloodGroup: 'B+', address: '67 Sindhi Colony, Nagpur' },
  { name: 'Palak Srivastava', email: 'palak@student.com',     phone: '9900001025', rollNo: 'STU025', class: '3',  section: 'A', gender: 'female', parentName: 'Hemant Srivastava',parentPhone:'9800001025', bloodGroup: 'O+', address: '12 Aminabad, Lucknow' },
  { name: 'Yash Trivedi',     email: 'yash@student.com',      phone: '9900001026', rollNo: 'STU026', class: '2',  section: 'A', gender: 'male',   parentName: 'Girish Trivedi',  parentPhone: '9800001026', bloodGroup: 'A+', address: '45 Vastrapur, Ahmedabad' },
  { name: 'Zoya Khan',        email: 'zoya@student.com',      phone: '9900001027', rollNo: 'STU027', class: '2',  section: 'A', gender: 'female', parentName: 'Imran Khan',      parentPhone: '9800001027', bloodGroup: 'B-', address: '78 Nizamuddin, Delhi' },
  { name: 'Ishan Desai',      email: 'ishan@student.com',     phone: '9900001028', rollNo: 'STU028', class: '1',  section: 'A', gender: 'male',   parentName: 'Ketan Desai',     parentPhone: '9800001028', bloodGroup: 'O+', address: '23 Paldi, Ahmedabad' },
  { name: 'Diya Kulkarni',    email: 'diya@student.com',      phone: '9900001029', rollNo: 'STU029', class: '1',  section: 'A', gender: 'female', parentName: 'Milind Kulkarni', parentPhone: '9800001029', bloodGroup: 'A-', address: '56 Deccan, Pune' },
  { name: 'Advait Pillai',    email: 'advait@student.com',    phone: '9900001030', rollNo: 'STU030', class: '12', section: 'A', gender: 'male',   parentName: 'Gopal Pillai',    parentPhone: '9800001030', bloodGroup: 'AB+','address': '89 Pattom, Trivandrum' },
];

const NOTICE_DATA = [
  { title: 'Annual Day Celebration', body: 'We are pleased to announce that the Annual Day celebration will be held on December 15, 2024. All students and parents are cordially invited. Cultural programs will be performed by students from all classes.', targetRole: 'all', priority: 'normal' },
  { title: 'URGENT: Fee Submission Deadline', body: 'Last date for fee submission is November 30, 2024. Students who have not paid their fees will not be allowed to sit for exams. Please contact the accounts office for any queries.', targetRole: 'student', priority: 'urgent' },
  { title: 'Staff Meeting - Mandatory Attendance', body: 'All teaching staff are required to attend the monthly staff meeting on November 5, 2024 at 3:00 PM in the conference room. Agenda: curriculum updates, exam schedule, and student performance review.', targetRole: 'teacher', priority: 'urgent' },
  { title: 'Winter Vacation Schedule', body: 'Winter vacations will be from December 25, 2024 to January 5, 2025. School will reopen on January 6, 2025. Students are advised to complete their holiday homework before the school reopens.', targetRole: 'all', priority: 'normal' },
  { title: 'Science Exhibition 2024', body: 'The Annual Science Exhibition will be organized on November 20, 2024. Students from classes 6 to 12 are encouraged to participate. Last date for project submission is November 15, 2024. Contact your science teacher for more details.', targetRole: 'student', priority: 'normal' },
];

// ─────────────────────────────────────────────
// Main seeder function
// ─────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // ── Clear all collections ──────────────────
    console.log('\n🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Student.deleteMany({}),
      Teacher.deleteMany({}),
      Class.deleteMany({}),
      Subject.deleteMany({}),
      Attendance.deleteMany({}),
      Exam.deleteMany({}),
      Result.deleteMany({}),
      Fee.deleteMany({}),
      Notice.deleteMany({}),
      Timetable.deleteMany({}),
    ]);
    console.log('✅ All collections cleared');

    // ── Create Admin ───────────────────────────
    console.log('\n👤 Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@codencampus.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '9876500000',
    });
    console.log(`✅ Admin created: admin@codencampus.com / Admin@123`);

    // ── Create Subjects (first, so teachers can ref them) ──
    console.log('\n📚 Creating subjects...');
    const createdSubjects = await Subject.insertMany(SUBJECT_DATA);
    console.log(`✅ ${createdSubjects.length} subjects created`);

    // Build lookup: subjectName -> subjectDoc (for class 10 subjects)
    const subjectByNameAndClass = {};
    createdSubjects.forEach(s => {
      const key = `${s.name}-${s.class}`;
      subjectByNameAndClass[key] = s;
    });

    // ── Create Teachers ────────────────────────
    console.log('\n👨‍🏫 Creating teachers...');
    const createdTeachers = [];
    for (const td of TEACHER_DATA) {
      const user = await User.create({
        name: td.name,
        email: td.email,
        password: 'Teacher@123',
        role: 'teacher',
        phone: td.phone,
      });

      // Find subject IDs that match this teacher's subjects
      const subjectIds = createdSubjects
        .filter(s => td.subjects.includes(s.name))
        .map(s => s._id);

      const teacher = await Teacher.create({
        user: user._id,
        employeeId: td.employeeId,
        qualification: td.qualification,
        designation: td.designation,
        salary: td.salary,
        gender: td.gender,
        subjects: subjectIds,
        classes: td.classes,
      });

      // Update subjects with teacher reference
      await Subject.updateMany(
        { _id: { $in: subjectIds } },
        { $set: { teacher: teacher._id } }
      );

      createdTeachers.push(teacher);
      console.log(`  ✅ ${td.name} (${td.employeeId})`);
    }

    // ── Create Classes ────────────────────────
    console.log('\n🏫 Creating classes...');
    const createdClasses = [];
    for (let i = 0; i < CLASSES.length; i++) {
      const cls = await Class.create({
        name: CLASSES[i],
        section: 'A',
        classTeacher: createdTeachers[i % createdTeachers.length]._id,
        capacity: 40,
      });
      createdClasses.push(cls);
    }
    console.log(`✅ ${createdClasses.length} classes created (1-12, Section A)`);

    // ── Create Students ────────────────────────
    console.log('\n🎒 Creating students...');
    const createdStudents = [];
    for (const sd of STUDENT_DATA) {
      const user = await User.create({
        name: sd.name,
        email: sd.email,
        password: 'Student@123',
        role: 'student',
        phone: sd.phone,
      });
      const student = await Student.create({
        user: user._id,
        rollNo: sd.rollNo,
        class: sd.class,
        section: sd.section,
        gender: sd.gender,
        address: sd.address,
        parentName: sd.parentName,
        parentPhone: sd.parentPhone,
        bloodGroup: sd.bloodGroup,
        dob: new Date(2005 + randomInt(0, 8), randomInt(0, 11), randomInt(1, 28)),
      });
      createdStudents.push(student);
    }
    console.log(`✅ ${createdStudents.length} students created`);

    // ── Create Exams ───────────────────────────
    console.log('\n📝 Creating exams...');
    const examData = [
      { name: 'Unit Test 1 - Class 10',  class: '10', section: 'A', term: 'Unit Test', startDate: new Date('2024-08-15'), endDate: new Date('2024-08-20'), totalMarks: 25,  passingMarks: 9  },
      { name: 'Term 1 Exam - Class 10',  class: '10', section: 'A', term: 'Term1',     startDate: new Date('2024-09-20'), endDate: new Date('2024-09-30'), totalMarks: 100, passingMarks: 33 },
      { name: 'Unit Test 2 - Class 10',  class: '10', section: 'A', term: 'Unit Test', startDate: new Date('2024-10-10'), endDate: new Date('2024-10-15'), totalMarks: 25,  passingMarks: 9  },
      { name: 'Term 2 Exam - Class 10',  class: '10', section: 'A', term: 'Term2',     startDate: new Date('2024-11-20'), endDate: new Date('2024-11-30'), totalMarks: 100, passingMarks: 33 },
      { name: 'Final Exam - Class 10',   class: '10', section: 'A', term: 'Final',     startDate: new Date('2025-02-10'), endDate: new Date('2025-02-25'), totalMarks: 100, passingMarks: 33 },
      { name: 'Term 1 Exam - Class 11',  class: '11', section: 'A', term: 'Term1',     startDate: new Date('2024-09-20'), endDate: new Date('2024-09-30'), totalMarks: 100, passingMarks: 33 },
      { name: 'Term 1 Exam - Class 12',  class: '12', section: 'A', term: 'Term1',     startDate: new Date('2024-09-20'), endDate: new Date('2024-09-30'), totalMarks: 100, passingMarks: 33 },
    ];
    const createdExams = await Exam.insertMany(examData);
    console.log(`✅ ${createdExams.length} exams created`);

    // ── Create Results for Class 10 students ──
    console.log('\n📊 Creating exam results...');
    const class10Students = createdStudents.filter(s => s.class === '10');
    const class10Subjects = createdSubjects.filter(s => s.class === '10');
    const class10Exams = createdExams.filter(e => e.class === '10');

    let resultsCreated = 0;
    for (const exam of class10Exams) {
      for (const student of class10Students) {
        for (const subject of class10Subjects) {
          const marksObtained = randomInt(
            Math.floor(exam.passingMarks * 0.8),
            exam.totalMarks
          );
          const percent = (marksObtained / exam.totalMarks) * 100;
          let grade = 'F';
          if (percent >= 90) grade = 'A+';
          else if (percent >= 80) grade = 'A';
          else if (percent >= 70) grade = 'B+';
          else if (percent >= 60) grade = 'B';
          else if (percent >= 50) grade = 'C';
          else if (percent >= 33) grade = 'D';

          await Result.create({
            student: student._id,
            exam: exam._id,
            subject: subject._id,
            marksObtained,
            totalMarks: exam.totalMarks,
            grade,
            remarks: grade === 'A+' ? 'Excellent' : grade === 'A' ? 'Very Good' : grade === 'B+' ? 'Good' : '',
          });
          resultsCreated++;
        }
      }
    }
    console.log(`✅ ${resultsCreated} result records created`);

    // ── Create Attendance (last 30 weekdays) ──
    console.log('\n📅 Creating attendance records...');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 42); // ~30 weekdays
    const workingDays = datesBetween(startDate, endDate);
    const workingDaysSample = workingDays.slice(-30); // last 30 working days

    // Use class 10 students + class 10 subjects for attendance demo
    let attendanceCreated = 0;
    const attendanceDocs = [];
    for (const date of workingDaysSample) {
      for (const student of class10Students) {
        for (const subject of class10Subjects) {
          const rand = Math.random();
          const status = rand < 0.75 ? 'present' : rand < 0.90 ? 'late' : 'absent';
          attendanceDocs.push({
            student: student._id,
            subject: subject._id,
            class: '10',
            section: 'A',
            date,
            status,
            markedBy: createdTeachers[0]._id,
          });
        }
      }
    }
    await Attendance.insertMany(attendanceDocs);
    attendanceCreated = attendanceDocs.length;
    console.log(`✅ ${attendanceCreated} attendance records created`);

    // ── Create Fees ────────────────────────────
    console.log('\n💰 Creating fee records...');
    const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October'];
    const feeDocs = [];
    for (const student of createdStudents) {
      for (let i = 0; i < months.length; i++) {
        const month = months[i];
        const amount = 2500;
        const rand = Math.random();
        let status, paidAmount, paidDate;
        if (rand < 0.65) {
          status = 'paid'; paidAmount = amount;
          paidDate = new Date(2024, 3 + i, randomInt(1, 20));
        } else if (rand < 0.80) {
          status = 'partial'; paidAmount = 1500;
        } else {
          status = 'pending'; paidAmount = 0;
        }
        feeDocs.push({
          student: student._id,
          amount,
          paidAmount,
          dueDate: new Date(2024, 3 + i, 10),
          paidDate: status === 'paid' ? paidDate : undefined,
          status,
          month,
          year: 2024,
          receiptNo: `RCP${Date.now()}${randomInt(100, 999)}`,
          feeType: 'Tuition Fee',
        });
      }
    }
    await Fee.insertMany(feeDocs);
    console.log(`✅ ${feeDocs.length} fee records created`);

    // ── Create Notices ─────────────────────────
    console.log('\n📢 Creating notices...');
    const noticeDocs = NOTICE_DATA.map(n => ({
      ...n,
      createdBy: adminUser._id,
      date: new Date(),
    }));
    await Notice.insertMany(noticeDocs);
    console.log(`✅ ${noticeDocs.length} notices created`);

    // ── Create Timetable for Class 10-A ───────
    console.log('\n📋 Creating timetable for Class 10-A...');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
      { periodNo: 1, startTime: '08:00', endTime: '08:45' },
      { periodNo: 2, startTime: '08:45', endTime: '09:30' },
      { periodNo: 3, startTime: '09:30', endTime: '10:15' },
      { periodNo: 4, startTime: '10:30', endTime: '11:15' }, // after break
      { periodNo: 5, startTime: '11:15', endTime: '12:00' },
      { periodNo: 6, startTime: '13:00', endTime: '13:45' }, // after lunch
    ];

    const class10SubIds = class10Subjects.map(s => s._id);
    const timetableDocs = [];
    for (const day of days) {
      const periods = timeSlots.map((slot, idx) => ({
        ...slot,
        subject: class10SubIds[idx % class10SubIds.length],
        teacher: createdTeachers[idx % createdTeachers.length]._id,
      }));
      timetableDocs.push({ class: '10', section: 'A', day, periods });
    }
    await Timetable.insertMany(timetableDocs);
    console.log(`✅ Timetable created for Class 10-A (${days.length} days)`);

    // ── Summary ────────────────────────────────
    console.log('\n' + '═'.repeat(50));
    console.log('🎉 SEEDING COMPLETE!');
    console.log('═'.repeat(50));
    console.log('\n📋 DEMO CREDENTIALS:');
    console.log('  Admin   → admin@codencampus.com  / Admin@123');
    console.log('  Teacher → rajesh@codencampus.com / Teacher@123');
    console.log('  Student → aarav@student.com      / Student@123');
    console.log('\n📊 DATA SUMMARY:');
    console.log(`  👤 Users:       ${1 + TEACHER_DATA.length + STUDENT_DATA.length}`);
    console.log(`  🎒 Students:    ${STUDENT_DATA.length}`);
    console.log(`  👨‍🏫 Teachers:    ${TEACHER_DATA.length}`);
    console.log(`  🏫 Classes:     ${CLASSES.length}`);
    console.log(`  📚 Subjects:    ${SUBJECT_DATA.length}`);
    console.log(`  📝 Exams:       ${examData.length}`);
    console.log(`  📊 Results:     ${resultsCreated}`);
    console.log(`  📅 Attendance:  ${attendanceCreated}`);
    console.log(`  💰 Fee Records: ${feeDocs.length}`);
    console.log(`  📢 Notices:     ${NOTICE_DATA.length}`);
    console.log(`  📋 Timetable:   Class 10-A (${days.length} days)`);
    console.log('═'.repeat(50));

  } catch (error) {
    console.error('\n❌ SEED ERROR:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ MongoDB disconnected. Exiting...');
    process.exit(0);
  }
};

seed();
