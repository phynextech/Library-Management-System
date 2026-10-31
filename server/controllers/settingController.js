import Setting from '../models/Setting.js';
import { memoryStore, getIsMockMode } from '../config/db.js';

export const getSettings = async (req, res) => {
  try {
    if (getIsMockMode()) {
      return res.json({ success: true, settings: memoryStore.settings });
    }

    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({
        libraryName: 'Aetheria Digital Library',
        maxBooksPerStudent: 5,
        defaultBorrowDays: 14,
        finePerDay: 2,
        currencySymbol: '$',
        contactEmail: 'admin@aetheria.library'
      });
    }

    res.json({ success: true, settings: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body;

    if (getIsMockMode()) {
      Object.assign(memoryStore.settings, updates);
      return res.json({ success: true, settings: memoryStore.settings, message: 'Settings saved successfully' });
    }

    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting(updates);
    } else {
      Object.assign(setting, updates);
      setting.updatedAt = new Date();
    }
    await setting.save();

    res.json({ success: true, settings: setting, message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
