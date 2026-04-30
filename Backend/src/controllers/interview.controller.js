const path = require("node:path")
const { pathToFileURL } = require("node:url")
const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

const standardFontDataUrl = `${pathToFileURL(
    path.join(process.cwd(), "node_modules", "pdfjs-dist", "standard_fonts")
).href}/`




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const selfDescription = req.body.selfDescription?.trim() || ""
        const jobDescription = req.body.jobDescription?.trim() || ""

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required."
            })
        }

        if (!req.file && !selfDescription) {
            return res.status(400).json({
                message: "Upload a PDF resume or add a self-description to continue."
            })
        }

        if (req.file && req.file.mimetype !== "application/pdf") {
            return res.status(400).json({
                message: "Only PDF resume uploads are supported right now."
            })
        }

        let resumeText = ""

        if (req.file) {
            const parser = new pdfParse.PDFParse({
                data: Uint8Array.from(req.file.buffer),
                standardFontDataUrl
            })

            try {
                const resumeContent = await parser.getText()
                resumeText = resumeContent.text?.trim() || ""
            } finally {
                await parser.destroy()
            }
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Interview report generation error:", error)
        return res.status(500).json({
            message: "Unable to generate the interview report right now."
        })
    }

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }
