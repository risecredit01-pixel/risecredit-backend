const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');


// Brute-force protection: Limit login attempts to 5 per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 attempts per window
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/settings/verify
// Securely check the password and issue a JWT
router.post('/verify', loginLimiter, async (req, res) => {
  try {
    const { password: rawPassword } = req.body;
    const password = rawPassword ? rawPassword.trim() : '';
    
    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required' });
    }

    let passSetting = await Settings.findOne({ key: 'adminPassword' });
    let correctPassword;
    
    if (passSetting) {
      correctPassword = passSetting.value;
    } else {
      // Fallback to environment variable ONLY (No hardcoded passwords in code!)
      correctPassword = process.env.ADMIN_PASSWORD;
      
      if (!correctPassword) {
          console.error('❌ CRITICAL: No admin password set in DB or Environment Variables!');
          return res.status(500).json({ success: false, message: 'Server configuration error' });
      }
    }
    
    // Check if the stored password is a bcrypt hash
    const isHashed = correctPassword.startsWith('$2');
    let isMatch = false;

    if (isHashed) {
      isMatch = await bcrypt.compare(password, correctPassword);
    } else {
      // Plain text comparison (for initial setup/migration)
      isMatch = (password === correctPassword);
      
      // AUTO-MIGRATION: If plain text matches, hash it immediately for future security
      if (isMatch) {
        console.log('🛡️ Auto-migrating plain-text password to secure hash...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        if (passSetting) {
          passSetting.value = hashedPassword;
          await passSetting.save();
        } else {
          await new Settings({ key: 'adminPassword', value: hashedPassword }).save();
        }
        console.log('✅ Password secured successfully.');
      }
    }
    
    if (isMatch) {
      console.log('✅ Admin login successful');
      


      const secret = process.env.JWT_SECRET || 'rise_credit_default_secure_key_2024';
      const token = jwt.sign({ id: 'admin' }, secret, { expiresIn: '4h' });
      res.json({ success: true, token, message: 'Authenticated' });
    } else {

      
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('VERIFY_ERROR:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/settings/password
// Protected by auth middleware
router.post('/password', auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'Password cannot be empty' });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    let passSetting = await Settings.findOne({ key: 'adminPassword' });
    if (!passSetting) {
      passSetting = new Settings({ key: 'adminPassword', value: hashedPassword });
    } else {
      passSetting.value = hashedPassword;
    }
    
    await passSetting.save();
    
    // Update .env file for environment variable consistency
    try {
      const envPath = path.resolve(__dirname, '..', '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split(/\r?\n/);
        let found = false;
        
        const updatedLines = lines.map(line => {
          if (line.trim().startsWith('ADMIN_PASSWORD=')) {
            found = true;
            return `ADMIN_PASSWORD=${newPassword}`;
          }
          return line;
        });
        
        if (!found) updatedLines.push(`ADMIN_PASSWORD=${newPassword}`);
        fs.writeFileSync(envPath, updatedLines.join('\n'), 'utf8');
        process.env.ADMIN_PASSWORD = newPassword;
      }
    } catch (envError) {
      console.error('❌ Error updating .env file:', envError.message);
    }

    res.json({ success: true, message: 'Password updated and secured successfully' });
  } catch (error) {
    console.error('PASSWORD_UPDATE_FATAL:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



module.exports = router;
