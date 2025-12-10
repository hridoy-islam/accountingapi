/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import path from "path";
import cron from "node-cron";
import multer from "multer";
import ScheduleInvoice from "./app/modules/scheduleInvoice/scheduleInvoice.model";
import Invoice from "./app/modules/invoice/invoice.model";
import mongoose from "mongoose";
import moment from "moment";

// const requestIp = require('request-ip')
const app: Application = express();

// app.use(requestIp.mw());
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use("/uploads", express.static("uploads"));

// app.use(
//   cors({
//     origin: "*",
//   })
// );

const generateUniqueInvId = async (
  companyId: string,
  session: mongoose.ClientSession // 👈 ADD SESSION PARAMETER
): Promise<string> => {
  const now = new Date();
  const dateStr = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;

  const prefix = dateStr;
  let nextNumber = 1;
  let invId = "";

  while (true) {
    const paddedNumber = String(nextNumber).padStart(3, "0");
    invId = `${prefix}${paddedNumber}`;

    // 🔑 Use the same session so we can see invoices created earlier in THIS transaction
    const exists = await Invoice.findOne({ invId, companyId }, null, {
      session,
    }).lean();

    if (!exists) {
      break;
    }
    nextNumber++;
  }

  return invId;
};

cron.schedule("0 0 * * *", async () => {
  // console.log(`⏰ [${moment().format()}] Starting Invoice Cron Job...`);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const now = moment(); // Today's date
    const currentDay = now.date(); // 1-31
    const currentMonth = now.month(); // 0-11 (Jan is 0)

    // Check if today is the last day of the current month (e.g., Feb 28, Apr 30, Jan 31)
    const isEndOfMonth = now.clone().endOf("month").isSame(now, "day");

    // Base criteria: Not deleted
    const queryConditions: any[] = [
      // 1. Standard Match (Day matches today)
      {
        frequency: "monthly",
        scheduledDay: currentDay,
      },
      {
        frequency: "yearly",
        scheduledDay: currentDay,
        scheduledMonth: currentMonth,
      },
    ];

    // 2. Short Month Handling (The "Proper" Logic)
    // If today is Feb 28th, we grab anyone scheduled for 29, 30, or 31.
    if (isEndOfMonth) {
      queryConditions.push({
        frequency: "monthly",
        scheduledDay: { $gt: currentDay }, // Grab days greater than today
      });

      queryConditions.push({
        frequency: "yearly",
        scheduledMonth: currentMonth,
        scheduledDay: { $gt: currentDay },
      });
    }

    const potentialSchedules = await ScheduleInvoice.find({
      isDeleted: false,
      $or: queryConditions,
    }).session(session);

    if (potentialSchedules.length === 0) {
      // console.log("✅ No scheduled invoices due today.");
      await session.commitTransaction();
      return;
    }

    // console.log(`Processing ${potentialSchedules.length} candidates...`);

    // --- PROCESS EACH SCHEDULE ---

    for (const schedule of potentialSchedules) {
      const lastRun = schedule.lastRunDate
        ? moment(schedule.lastRunDate)
        : null;
      let shouldRun = false;

      // --- IDEMPOTENCY CHECK ---
      if (!lastRun) {
        // Never ran before -> Run it
        shouldRun = true;
      } else {
        if (schedule.frequency === "monthly") {
          // Run if lastRun was NOT in this current month
          shouldRun = !lastRun.isSame(now, "month");
        } else if (schedule.frequency === "yearly") {
          // Run if lastRun was NOT in this current year
          shouldRun = !lastRun.isSame(now, "year");
        }
      }

      if (!shouldRun) {
        // This handles the case where the cron runs, crashes halfway, and restarts.
        // Or if you manually trigger it. It prevents duplicates.
        continue;
      }

      // --- CREATE INVOICE ---

      const newInvId = await generateUniqueInvId(
        schedule.companyId.toString(),
        session
      );

      // Calculate Due Date
      const daysToAdd = schedule.frequencyDueDate || 0;
      const dueDate = moment().add(Number(daysToAdd), "days").toDate();

      const scheduleObj = schedule.toObject();

      // Remove fields specific to the schedule, keep invoice data
      const {
        _id,
        frequency,
        scheduledDay,
        scheduledMonth,
        lastRunDate,
        createdAt,
        updatedAt,
        ...invoiceData
      } = scheduleObj;

      const invoicePayload = {
        ...invoiceData,
        invId: newInvId,
        invoiceDate: now.toDate(), // Invoice Date is TODAY
        dueDate: dueDate,
        isRecurring: true, // Generated invoices are static
        // Explicitly set references to ensure types are correct
        customer: schedule.customer,
        companyId: schedule.companyId,
        bank: schedule.bank,
      };

      await Invoice.create([invoicePayload], { session });

      // --- UPDATE SCHEDULE ---
      // Mark it as run today so it doesn't run again until next cycle
      await ScheduleInvoice.findByIdAndUpdate(
        schedule._id,
        { lastRunDate: now.toDate() },
        { session }
      );
    }

    await session.commitTransaction();
    // console.log("✅ Scheduled invoices processed successfully.");
  } catch (error) {
    console.error("❌ Error running invoice cron job:", error);
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://accountingsoft.netlify.app"],
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/transactions");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `transaction-${uniqueSuffix}${fileExtension}`);
  },
});

export const upload = multer({ storage });

// application routes
app.use("/api", router);

const test = async (req: Request, res: Response) => {
  return res.json({ message: "working nicely" });
};

app.get("/", test);

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
