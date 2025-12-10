import xlsx from 'xlsx';
import fs from 'fs';
import Member from '../models/Member.js';

/**
 * Helper function to convert Excel date to JavaScript Date
 */
function excelDateToJSDate(excelDate) {
  if (typeof excelDate === 'number') {
    // Excel stores dates as number of days since 1900-01-01
    return new Date((excelDate - 25569) * 86400 * 1000);
  }
  return excelDate;
}

/**
 * @desc    Get all members with pagination and filters
 * @route   GET /api/members
 * @access  Private
 */
export const getMembers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const { status } = req.query;

    // Build query
    const query = {};

    // Search in firstName and lastName
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Get total count for pagination
    const total = await Member.countDocuments(query);

    // Get members
    const members = await Member.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: {
        members,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single member by ID
 * @route   GET /api/members/:id
 * @access  Private
 */
export const getMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id).populate('createdBy', 'name email');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Membre non trouvé',
      });
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new member
 * @route   POST /api/members
 * @access  Private
 */
export const createMember = async (req, res, next) => {
  try {
    const memberData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const member = await Member.create(memberData);

    res.status(201).json({
      success: true,
      message: 'Membre créé avec succès',
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update member
 * @route   PUT /api/members/:id
 * @access  Private
 */
export const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Membre non trouvé',
      });
    }

    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Membre mis à jour avec succès',
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete member
 * @route   DELETE /api/members/:id
 * @access  Private
 */
export const deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Membre non trouvé',
      });
    }

    await Member.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Membre supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Import members from Excel file
 * @route   POST /api/members/import
 * @access  Private
 */
export const importMembers = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un fichier Excel',
      });
    }

    // Read the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: 'Le fichier Excel est vide',
      });
    }

    const results = {
      success: [],
      errors: [],
      total: data.length,
    };

    // Process each row
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < data.length; i += 1) {
      const row = data[i];

      try {
        // Map Excel columns to database fields
        // Adjust these mappings based on your Excel column names
        const memberData = {
          firstName: row['Prénom'] || row.Prenom || row.firstName || '',
          lastName: row.Nom || row.lastName || '',
          dateOfBirth:
            row['Date de naissance'] || row.dateOfBirth
              ? new Date(excelDateToJSDate(row['Date de naissance'] || row.dateOfBirth))
              : null,
          address: {
            full: row.Adresse || row.address || '',
            street: row.Rue || row.street || '',
            city: row.Ville || row.city || '',
            postalCode: row['Code postal'] || row.postalCode || '',
            country: row.Pays || row.country || 'France',
          },
          phone: row['Téléphone'] || row.Telephone || row.phone || '',
          email: row.Email || row.email || '',
          notes: row.Notes || row.notes || '',
          status: 'active',
          createdBy: req.user._id,
        };

        // Validate required fields
        if (!memberData.firstName || !memberData.lastName || !memberData.dateOfBirth) {
          results.errors.push({
            row: i + 2, // +2 because Excel rows start at 1 and we skip header
            data: row,
            error: 'Prénom, nom et date de naissance sont requis',
          });
        } else {
          // Create member - sequential processing to avoid overwhelming the database
          // eslint-disable-next-line no-await-in-loop
          const member = await Member.create(memberData);
          results.success.push({
            row: i + 2,
            member: {
              firstName: member.firstName,
              lastName: member.lastName,
              email: member.email,
            },
          });
        }
      } catch (error) {
        results.errors.push({
          row: i + 2,
          data: row,
          error: error.message,
        });
      }
    }

    // Delete uploaded file after processing
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: `Import terminé: ${results.success.length} réussis, ${results.errors.length} erreurs`,
      data: results,
    });
  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * @desc    Export members to Excel
 * @route   GET /api/members/export
 * @access  Private
 */
export const exportMembers = async (req, res, next) => {
  try {
    const members = await Member.find({}).sort({ lastName: 1, firstName: 1 });

    // Prepare data for Excel
    const data = members.map((member) => ({
      Prénom: member.firstName,
      Nom: member.lastName,
      'Date de naissance': member.dateOfBirth
        ? new Date(member.dateOfBirth).toLocaleDateString('fr-FR')
        : '',
      Âge: member.age || '',
      Adresse: member.address?.full || '',
      Ville: member.address?.city || '',
      'Code postal': member.address?.postalCode || '',
      Pays: member.address?.country || '',
      Téléphone: member.phone || '',
      Email: member.email || '',
      Statut: member.status || '',
      "Date d'adhésion": member.membershipDate
        ? new Date(member.membershipDate).toLocaleDateString('fr-FR')
        : '',
      Notes: member.notes || '',
    }));

    // Create workbook and worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(data);

    // Add worksheet to workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Membres');

    // Generate buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=membres-HFM-${Date.now()}.xlsx`);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get member statistics
 * @route   GET /api/members/stats
 * @access  Private
 */
export const getMemberStats = async (req, res, next) => {
  try {
    const total = await Member.countDocuments();
    const active = await Member.countDocuments({ status: 'active' });
    const inactive = await Member.countDocuments({ status: 'inactive' });
    const pending = await Member.countDocuments({ status: 'pending' });

    // Get age distribution
    const members = await Member.find({}, 'dateOfBirth');
    const ages = members.map((m) => m.age).filter((age) => age !== null);
    const avgAge =
      ages.length > 0 ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : 0;

    res.json({
      success: true,
      data: {
        total,
        active,
        inactive,
        pending,
        averageAge: avgAge,
      },
    });
  } catch (error) {
    next(error);
  }
};
