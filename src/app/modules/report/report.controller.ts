import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ReportServices } from "./report.service";


const getReport = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.query;
    const { id: companyId } = req.params;
  
    // Check if both startDate and endDate are provided in the query
    if (!startDate || !endDate) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Both startDate and endDate are required.",
        data:null
      });
    }
  
    // Validate date format
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
  
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Invalid date format provided.",
        data:null
      });
    }
  
    // Call service to fetch the report data
    const result = await ReportServices.getCompanyReportFromDB(companyId, {}, start.toISOString(), end.toISOString());
  
    // Respond with the fetched report data
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Report retrieved successfully",
      data: result,
    });
  });
  
  export const reportControllers = {
    getReport,
  };