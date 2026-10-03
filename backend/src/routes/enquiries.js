const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const auth = require('../middleware/auth');
const { validateEnquiry } = require('../middleware/validateEnquiry');
const nodemailer = require('nodemailer');

const ENQUIRIES_PAGE_SIZE = 20;

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[character]);

async function sendEnquiryEmail(enquiry) {
  if (!process.env.ENQUIRY_EMAIL || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ENQUIRY_EMAIL,
      subject: `New Enquiry - ${enquiry.studentName} for Class ${enquiry.classSeeking}`,
      html: `<div style="font-family:Arial;max-width:600px;margin:0 auto">
        <div style="background:#1a2332;color:#d4af37;padding:20px;text-align:center">
          <h1 style="margin:0">New Enquiry - APS Khadakwasla</h1>
        </div>
        <div style="padding:20px;background:#f5f5f5">
          <p><strong>Parent Name:</strong> ${escapeHtml(enquiry.parentName)}</p>
          <p><strong>Student Name:</strong> ${escapeHtml(enquiry.studentName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(enquiry.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(enquiry.phone)}</p>
          <p><strong>Class Seeking:</strong> ${escapeHtml(enquiry.classSeeking)}</p>
          <p><strong>Message:</strong> ${escapeHtml(enquiry.message || 'N/A')}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN')}</p>
        </div>
      </div>`
    });
  } catch (err) {
    console.error('Enquiry email delivery failed:', err.message);
  }
}

router.get('/', auth, async (req, res) => {
  try {
    const pageValue = req.query.page ?? '1';
    const page = Number(pageValue);
    if (!/^[1-9]\d*$/.test(String(pageValue)) || !Number.isSafeInteger(page)) {
      return res.status(400).json({ success: false, message: 'page must be a positive integer' });
    }

    const skip = (page - 1) * ENQUIRIES_PAGE_SIZE;
    if (!Number.isSafeInteger(skip)) {
      return res.status(400).json({ success: false, message: 'page is out of range' });
    }

    const [enquiries, count] = await Promise.all([
      Enquiry.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ENQUIRIES_PAGE_SIZE)
        .lean(),
      Enquiry.countDocuments()
    ]);
    res.json({
      success: true,
      data: enquiries,
      count,
      page,
      limit: ENQUIRIES_PAGE_SIZE,
      totalPages: Math.ceil(count / ENQUIRIES_PAGE_SIZE)
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/', validateEnquiry, async (req, res) => {
  try {
    const { parentName, studentName, email, phone, classSeeking, message, source, contactTime } = req.body || {};
    const enquiry = await Enquiry.create({
      parentName,
      studentName,
      email,
      phone,
      classSeeking,
      message,
      source,
      contactTime
    });
    sendEnquiryEmail(enquiry); // non-blocking
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully', data: enquiry });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body || {};
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { ...(status !== undefined && { status }), ...(notes !== undefined && { notes }) },
      { new: true, runValidators: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, data: enquiry });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
