const express = require('express');
const prisma = require('../../lib/prisma');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Multer configuration for irrigation image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../../frontend/public/uploads/irrigation');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const fileExtension = originalName.split('.').pop();
    const filename = `irrigation_${timestamp}.${fileExtension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * @openapi
 * /api/admin/irrigation-profiles:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all irrigation profiles (admin)
 *     description: Retrieve a paginated list of all irrigation profiles with search
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A paginated list of irrigation profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/IrrigationProfile'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - Admin
 *     summary: Create an irrigation profile
 *     description: Create a new irrigation profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - area
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               latitude:
 *                 type: number
 *                 format: float
 *               longitude:
 *                 type: number
 *                 format: float
 *               area:
 *                 type: number
 *               waterLevel:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [normal, low, high, critical]
 *               canals:
 *                 type: integer
 *               gates:
 *                 type: integer
 *               waterSource:
 *                 type: string
 *     responses:
 *       201:
 *         description: Irrigation profile created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update an irrigation profile
 *     description: Update an existing irrigation profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - area
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               latitude:
 *                 type: number
 *                 format: float
 *               longitude:
 *                 type: number
 *                 format: float
 *               area:
 *                 type: number
 *               waterLevel:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [normal, low, high, critical]
 *               canals:
 *                 type: integer
 *               gates:
 *                 type: integer
 *               waterSource:
 *                 type: string
 *     responses:
 *       200:
 *         description: Irrigation profile updated
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete an irrigation profile
 *     description: Delete an irrigation profile by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Irrigation profile deleted
 *       400:
 *         description: ID parameter is required
 *       500:
 *         description: Internal server error
 */
// GET /api/admin/irrigation-profiles
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = search ? {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ],
    } : {};

    const [profiles, totalCount] = await Promise.all([
      prisma.irrigationProfile.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take,
      }),
      prisma.irrigationProfile.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      data: profiles,
      pagination: {
        page: parseInt(page),
        limit: take,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching irrigation profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/admin/irrigation-profiles/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await prisma.irrigationProfile.findUnique({ where: { id } });
    if (!profile) {
      return res.status(404).json({ message: 'Irrigation profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching irrigation profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/irrigation-profiles
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      latitude,
      longitude,
      area,
      waterLevel,
      status,
      canals,
      gates,
      waterSource,
      regency,
      constructionYear,
      servedVillages,
      potentialArea,
      functionalArea,
      dischargeCapacity,
      channelLength,
      watershedArea,
      productivity,
      totalStructures,
      mainStructure,
      divisionStructure,
      intakeStructure,
      dropStructure,
      aqueduct,
      drainageCulvert,
      roadCulvert,
      slopingDrain,
      buildingScheme,
      networkScheme,
      p3aGroupList,
      farmingBusinessAnalysis,
      rttg,
      plantingSchedule,
    } = req.body;

    if (!name || !area) {
      return res.status(400).json({ message: 'Name and area are required' });
    }

    const profile = await prisma.irrigationProfile.create({
      data: {
        name,
        description: description || '',
        location: location || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        area: parseFloat(area),
        waterLevel: waterLevel ? parseFloat(waterLevel) : null,
        status: status || 'normal',
        canals: canals ? parseInt(canals) : null,
        gates: gates ? parseInt(gates) : null,
        waterSource: waterSource || null,
        regency: regency || null,
        constructionYear: constructionYear ? parseInt(constructionYear) : null,
        servedVillages: servedVillages || null,
        potentialArea: potentialArea ? parseFloat(potentialArea) : null,
        functionalArea: functionalArea ? parseFloat(functionalArea) : null,
        dischargeCapacity: dischargeCapacity ? parseFloat(dischargeCapacity) : null,
        channelLength: channelLength ? parseFloat(channelLength) : null,
        watershedArea: watershedArea ? parseFloat(watershedArea) : null,
        productivity: productivity || null,
        totalStructures: totalStructures ? parseInt(totalStructures) : null,
        mainStructure: mainStructure || null,
        divisionStructure: divisionStructure ? parseInt(divisionStructure) : null,
        intakeStructure: intakeStructure ? parseInt(intakeStructure) : null,
        dropStructure: dropStructure ? parseInt(dropStructure) : null,
        aqueduct: aqueduct ? parseInt(aqueduct) : null,
        drainageCulvert: drainageCulvert ? parseInt(drainageCulvert) : null,
        roadCulvert: roadCulvert ? parseInt(roadCulvert) : null,
        slopingDrain: slopingDrain ? parseInt(slopingDrain) : null,
        buildingScheme: buildingScheme || null,
        networkScheme: networkScheme || null,
        p3aGroupList: p3aGroupList || null,
        farmingBusinessAnalysis: farmingBusinessAnalysis || null,
        rttg: rttg || null,
        plantingSchedule: plantingSchedule || null,
      },
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating irrigation profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/admin/irrigation-profiles/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      location,
      latitude,
      longitude,
      area,
      waterLevel,
      status,
      canals,
      gates,
      waterSource,
      regency,
      constructionYear,
      servedVillages,
      potentialArea,
      functionalArea,
      dischargeCapacity,
      channelLength,
      watershedArea,
      productivity,
      totalStructures,
      mainStructure,
      divisionStructure,
      intakeStructure,
      dropStructure,
      aqueduct,
      drainageCulvert,
      roadCulvert,
      slopingDrain,
      buildingScheme,
      networkScheme,
      p3aGroupList,
      farmingBusinessAnalysis,
      rttg,
      plantingSchedule,
    } = req.body;

    const existing = await prisma.irrigationProfile.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Irrigation profile not found' });
    }

    if (!name || !area) {
      return res.status(400).json({ message: 'Name and area are required' });
    }

    const updatedProfile = await prisma.irrigationProfile.update({
      where: { id },
      data: {
        name,
        description: description !== undefined ? description : existing.description,
        location: location !== undefined ? location : existing.location,
        latitude: latitude !== undefined ? (latitude ? parseFloat(latitude) : null) : existing.latitude,
        longitude: longitude !== undefined ? (longitude ? parseFloat(longitude) : null) : existing.longitude,
        area: parseFloat(area),
        waterLevel: waterLevel !== undefined ? (waterLevel ? parseFloat(waterLevel) : null) : existing.waterLevel,
        status: status || existing.status,
        canals: canals !== undefined ? (canals ? parseInt(canals) : null) : existing.canals,
        gates: gates !== undefined ? (gates ? parseInt(gates) : null) : existing.gates,
        waterSource: waterSource !== undefined ? waterSource : existing.waterSource,
        regency: regency !== undefined ? regency : existing.regency,
        constructionYear: constructionYear !== undefined ? (constructionYear ? parseInt(constructionYear) : null) : existing.constructionYear,
        servedVillages: servedVillages !== undefined ? servedVillages : existing.servedVillages,
        potentialArea: potentialArea !== undefined ? (potentialArea ? parseFloat(potentialArea) : null) : existing.potentialArea,
        functionalArea: functionalArea !== undefined ? (functionalArea ? parseFloat(functionalArea) : null) : existing.functionalArea,
        dischargeCapacity: dischargeCapacity !== undefined ? (dischargeCapacity ? parseFloat(dischargeCapacity) : null) : existing.dischargeCapacity,
        channelLength: channelLength !== undefined ? (channelLength ? parseFloat(channelLength) : null) : existing.channelLength,
        watershedArea: watershedArea !== undefined ? (watershedArea ? parseFloat(watershedArea) : null) : existing.watershedArea,
        productivity: productivity !== undefined ? productivity : existing.productivity,
        totalStructures: totalStructures !== undefined ? (totalStructures ? parseInt(totalStructures) : null) : existing.totalStructures,
        mainStructure: mainStructure !== undefined ? mainStructure : existing.mainStructure,
        divisionStructure: divisionStructure !== undefined ? (divisionStructure ? parseInt(divisionStructure) : null) : existing.divisionStructure,
        intakeStructure: intakeStructure !== undefined ? (intakeStructure ? parseInt(intakeStructure) : null) : existing.intakeStructure,
        dropStructure: dropStructure !== undefined ? (dropStructure ? parseInt(dropStructure) : null) : existing.dropStructure,
        aqueduct: aqueduct !== undefined ? (aqueduct ? parseInt(aqueduct) : null) : existing.aqueduct,
        drainageCulvert: drainageCulvert !== undefined ? (drainageCulvert ? parseInt(drainageCulvert) : null) : existing.drainageCulvert,
        roadCulvert: roadCulvert !== undefined ? (roadCulvert ? parseInt(roadCulvert) : null) : existing.roadCulvert,
        slopingDrain: slopingDrain !== undefined ? (slopingDrain ? parseInt(slopingDrain) : null) : existing.slopingDrain,
        buildingScheme: buildingScheme !== undefined ? buildingScheme : existing.buildingScheme,
        networkScheme: networkScheme !== undefined ? networkScheme : existing.networkScheme,
        p3aGroupList: p3aGroupList !== undefined ? p3aGroupList : existing.p3aGroupList,
        farmingBusinessAnalysis: farmingBusinessAnalysis !== undefined ? farmingBusinessAnalysis : existing.farmingBusinessAnalysis,
        rttg: rttg !== undefined ? rttg : existing.rttg,
        plantingSchedule: plantingSchedule !== undefined ? plantingSchedule : existing.plantingSchedule,
      },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating irrigation profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/admin/irrigation-profiles/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.irrigationProfile.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Irrigation profile not found' });
    }

    await prisma.irrigationProfile.delete({
      where: { id },
    });

    res.json({ message: 'Irrigation profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting irrigation profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/admin/irrigation-profiles/upload - Upload irrigation image
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const publicUrl = `/uploads/irrigation/${req.file.filename}`;
    res.json({ url: publicUrl });
  } catch (error) {
    console.error('Error uploading irrigation image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
