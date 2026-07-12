import Policy from "../models/Policy.js";
import PolicyAcknowledgement from "../models/PolicyAcknowledgement.js";

const createPolicy = async (req, res) => {
  try {
    const { title, content, description, version, status } = req.body;

    const existingPolicy = await Policy.findOne({ title: title.trim() });
    if (existingPolicy) {
      return res.status(409).json({
        success: false,
        message: "Policy with this title already exists",
      });
    }

    const policy = await Policy.create({
      title: title.trim(),
      content,
      description,
      version: version || "1.0",
      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Policy created successfully",
      policy,
    });
  } catch (error) {
    console.error("createPolicy() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating policy",
    });
  }
};

const getPolicies = async (req, res) => {
  try {
    const policies = await Policy.find();
    return res.status(200).json({
      success: true,
      policies,
    });
  } catch (error) {
    console.error("getPolicies() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching policies",
    });
  }
};

const getPolicyById = async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }
    return res.status(200).json({
      success: true,
      policy,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid policy ID",
      });
    }
    console.error("getPolicyById() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching policy",
    });
  }
};

const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, description, version, status } = req.body;

    const policy = await Policy.findById(id);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    if (title && title.trim() !== policy.title) {
      const existingPolicy = await Policy.findOne({ title: title.trim() });
      if (existingPolicy) {
        return res.status(409).json({
          success: false,
          message: "Policy with this title already exists",
        });
      }
      policy.title = title.trim();
    }

    if (content !== undefined) policy.content = content;
    if (description !== undefined) policy.description = description;
    if (version !== undefined) policy.version = version;
    if (status !== undefined) policy.status = status;

    const updatedPolicy = await policy.save();

    return res.status(200).json({
      success: true,
      message: "Policy updated successfully",
      policy: updatedPolicy,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid policy ID",
      });
    }
    console.error("updatePolicy() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating policy",
    });
  }
};

const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const policy = await Policy.findByIdAndDelete(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    await PolicyAcknowledgement.deleteMany({ policy: id });

    return res.status(200).json({
      success: true,
      message: "Policy deleted successfully along with its acknowledgements",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid policy ID",
      });
    }
    console.error("deletePolicy() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting policy",
    });
  }
};

const acknowledgePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.id;

    const policy = await Policy.findById(id);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found",
      });
    }

    let acknowledgement = await PolicyAcknowledgement.findOne({
      employee: employeeId,
      policy: id,
    });

    if (!acknowledgement) {
      acknowledgement = new PolicyAcknowledgement({
        employee: employeeId,
        policy: id,
      });
    }

    acknowledgement.status = "Accepted";
    acknowledgement.acknowledgementDate = new Date();
    acknowledgement.reminderDate = null;

    const savedAcknowledgement = await acknowledgement.save();

    return res.status(200).json({
      success: true,
      message: "Policy acknowledged successfully",
      acknowledgement: savedAcknowledgement,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid policy ID",
      });
    }
    console.error("acknowledgePolicy() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during policy acknowledgement",
    });
  }
};

const getPolicyAcknowledgements = async (req, res) => {
  try {
    const acknowledgements = await PolicyAcknowledgement.find()
      .populate("employee", "name email department role")
      .populate("policy", "title version");

    return res.status(200).json({
      success: true,
      acknowledgements,
    });
  } catch (error) {
    console.error("getPolicyAcknowledgements() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching acknowledgements",
    });
  }
};

const getMyAcknowledgements = async (req, res) => {
  try {
    const acknowledgements = await PolicyAcknowledgement.find({
      employee: req.user.id,
    }).populate("policy", "title content version status");

    return res.status(200).json({
      success: true,
      acknowledgements,
    });
  } catch (error) {
    console.error("getMyAcknowledgements() error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching your acknowledgements",
    });
  }
};

export {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
  acknowledgePolicy,
  getPolicyAcknowledgements,
  getMyAcknowledgements,
};
