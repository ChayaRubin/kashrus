// import * as feedbackService from "../services/feedbackService.js";

// export async function submitFeedback(req, res) {
//   try {
//     let { restaurantId, message } = req.body;
//     const userId = req.user?.id || null;

//     if (!message) {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     // ensure restaurantId is either null or an integer
//     restaurantId = restaurantId ? parseInt(restaurantId, 10) : null;

//     const fb = await feedbackService.createFeedback({ userId, restaurantId, message });
//     res.status(201).json(fb);
//   } catch (err) {
//     console.error("submitFeedback error:", err);
//     res.status(500).json({ error: "Failed to submit feedback" });
//   }
// }

// export async function listFeedback(req, res) {
//   try {
//     const feedback = await feedbackService.listFeedback();
//     res.json(feedback);
//   } catch (err) {
//     console.error("listFeedback error:", err);
//     res.status(500).json({ error: "Failed to load feedback" });
//   }
// }

// export async function updateFeedback(req, res) {
//   try {
//     const { status } = req.body;
//     const fb = await feedbackService.updateFeedbackStatus(req.params.id, status);
//     res.json(fb);
//   } catch (err) {
//     console.error("updateFeedback error:", err);
//     res.status(500).json({ error: "Failed to update feedback" });
//   }
// }

// export async function deleteFeedback(req, res) {
//   try {
//     await feedbackService.deleteFeedback(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     console.error("deleteFeedback error:", err);
//     res.status(500).json({ error: "Failed to delete feedback" });
//   }
// }
import { sendEmail } from "../services/emailService.js";
import { feedbackTemplate } from "../templates/emailTemplates.js";
import * as feedbackService from "../services/feedbackService.js";

// Create new feedback
export async function submitFeedback(req, res) {
  try {
    let { restaurantId, message } = req.body;
    const userId = req.user?.id || null;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    restaurantId = restaurantId ? parseInt(restaurantId, 10) : null;

    // 1. Save in DB
    const fb = await feedbackService.createFeedback({
      userId,
      restaurantId,
      message,
    });

    // 2. Send email
    await sendEmail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // admin inbox
      subject: "New Feedback Submitted",
      html: feedbackTemplate({
        userName: req.user?.name,
        restaurantId,
        message,
      }),
    });

    res.status(201).json(fb);
  } catch (err) {
    console.error("submitFeedback error:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
}

// List all feedback (Admin)
export async function listFeedback(req, res) {
  try {
    const feedback = await feedbackService.listFeedback();
    res.json(feedback);
  } catch (err) {
    console.error("listFeedback error:", err);
    res.status(500).json({ error: "Failed to load feedback" });
  }
}

// Update feedback status (Admin)
export async function updateFeedback(req, res) {
  try {
    const { status } = req.body;
    const fb = await feedbackService.updateFeedbackStatus(
      req.params.id,
      status
    );
    res.json(fb);
  } catch (err) {
    console.error("updateFeedback error:", err);
    res.status(500).json({ error: "Failed to update feedback" });
  }
}

// Delete feedback (Admin)
export async function deleteFeedback(req, res) {
  try {
    await feedbackService.deleteFeedback(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("deleteFeedback error:", err);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
}
