import Member from '../models/Member.js';
import {
  generateMemberNumber,
  generateMemberQRCode,
  saveQRCodeToFile,
} from '../utils/qrCodeGenerator.js';
import { sendApprovalEmail } from '../utils/emailService.js';

/**
 * @desc    Submit a new membership application (Public)
 * @route   POST /api/applications
 * @access  Public
 */
export const submitApplication = async (req, res, next) => {
  try {
    // Check if email already exists
    const existingMember = await Member.findOne({ email: req.body.email });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Un membre avec cet email existe déjà',
      });
    }

    // Create new member with pending status
    const member = await Member.create({
      ...req.body,
      status: 'pending',
      applicationDate: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Demande d\'adhésion soumise avec succès. Vous recevrez une réponse prochainement.',
      data: {
        _id: member._id,
        fullName: member.fullName,
        email: member.email,
        status: member.status,
        applicationDate: member.applicationDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all pending applications
 * @route   GET /api/applications/pending
 * @access  Private (Admin only)
 */
export const getPendingApplications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Member.countDocuments({ status: 'pending' });

    const applications = await Member.find({ status: 'pending' })
      .sort({ applicationDate: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        applications,
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
 * @desc    Get single application details
 * @route   GET /api/applications/:id
 * @access  Private
 */
export const getApplication = async (req, res, next) => {
  try {
    const application = await Member.findById(req.params.id)
      .populate('approvedBy', 'name email')
      .populate('rejectedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée',
      });
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve a membership application
 * @route   PUT /api/applications/:id/approve
 * @access  Private (Admin only)
 */
export const approveApplication = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée',
      });
    }

    if (member.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cette demande ne peut pas être approuvée (statut actuel: ${member.status})`,
      });
    }

    // Generate member number
    const memberNumber = await generateMemberNumber(Member);
    member.memberNumber = memberNumber;

    // Update member status
    member.status = 'active';
    member.approvedBy = req.user._id;
    member.approvalDate = new Date();
    member.membershipDate = new Date();

    if (req.body.notes) {
      member.notes = req.body.notes;
    }

    await member.save();

    // Generate QR code for the member
    const qrCodeData = await generateMemberQRCode(member);

    // Save QR code to file system
    const qrCodeImageUrl = await saveQRCodeToFile(
      qrCodeData.buffer,
      member._id
    );

    // Update member with QR code information
    member.qrCode = {
      code: qrCodeData.code,
      imageUrl: qrCodeImageUrl,
      generatedAt: new Date(),
    };

    await member.save();

    // Send approval email with QR code
    try {
      await sendApprovalEmail(member, qrCodeData);
      console.log(`Approval email sent to ${member.email}`);
    } catch (emailError) {
      console.error('Error sending approval email:', emailError);
      // Continue even if email fails - the member is still approved
    }

    const updatedMember = await Member.findById(member._id).populate(
      'approvedBy',
      'name email'
    );

    res.json({
      success: true,
      message: `Adhésion de ${member.fullName} approuvée avec succès. Un email de confirmation a été envoyé.`,
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject a membership application
 * @route   PUT /api/applications/:id/reject
 * @access  Private (Admin only)
 */
export const rejectApplication = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée',
      });
    }

    if (member.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cette demande ne peut pas être rejetée (statut actuel: ${member.status})`,
      });
    }

    // Update member status
    member.status = 'rejected';
    member.rejectedBy = req.user._id;
    member.rejectionDate = new Date();
    member.rejectionReason = req.body.rejectionReason;

    await member.save();

    const updatedMember = await Member.findById(member._id)
      .populate('rejectedBy', 'name email');

    res.json({
      success: true,
      message: `Adhésion de ${member.fullName} rejetée`,
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Suspend a member
 * @route   PUT /api/applications/:id/suspend
 * @access  Private (Admin only)
 */
export const suspendMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Membre non trouvé',
      });
    }

    if (member.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Seuls les membres actifs peuvent être suspendus',
      });
    }

    member.status = 'suspended';

    if (req.body.reason) {
      member.notes = `Suspendu: ${req.body.reason}. ${member.notes || ''}`;
    }

    await member.save();

    res.json({
      success: true,
      message: `Membre ${member.fullName} suspendu`,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reactivate a suspended or inactive member
 * @route   PUT /api/applications/:id/reactivate
 * @access  Private (Admin only)
 */
export const reactivateMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Membre non trouvé',
      });
    }

    if (member.status === 'active') {
      return res.status(400).json({
        success: false,
        message: 'Ce membre est déjà actif',
      });
    }

    if (member.status === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Utilisez l\'endpoint d\'approbation pour les demandes en attente',
      });
    }

    member.status = 'active';
    member.membershipDate = new Date();

    if (req.body.notes) {
      member.notes = `Réactivé: ${req.body.notes}. ${member.notes || ''}`;
    }

    await member.save();

    res.json({
      success: true,
      message: `Membre ${member.fullName} réactivé avec succès`,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get membership statistics
 * @route   GET /api/applications/stats
 * @access  Private
 */
export const getApplicationStats = async (req, res, next) => {
  try {
    const stats = await Member.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const typeStats = await Member.aggregate([
      {
        $match: { status: 'active' },
      },
      {
        $group: {
          _id: '$memberType',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format stats
    const statusCounts = {};
    stats.forEach((stat) => {
      statusCounts[stat._id] = stat.count;
    });

    const typeCounts = {};
    typeStats.forEach((stat) => {
      typeCounts[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        byStatus: {
          pending: statusCounts.pending || 0,
          active: statusCounts.active || 0,
          inactive: statusCounts.inactive || 0,
          rejected: statusCounts.rejected || 0,
          suspended: statusCounts.suspended || 0,
        },
        byType: {
          regular: typeCounts.regular || 0,
          student: typeCounts.student || 0,
          honorary: typeCounts.honorary || 0,
          family: typeCounts.family || 0,
        },
        total: Object.values(statusCounts).reduce((a, b) => a + b, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};
