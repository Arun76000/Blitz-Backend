import { Request, Response, NextFunction } from "express";
import mongoose, { Model, Types } from "mongoose";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import hogan from "hogan.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { promises as fs } from "fs";
import * as filesystem from "fs";
import twilio from "twilio";
import moment from "moment";
import { constants } from "../configuration/constants-variables";
import { ExpressRequest } from "../configuration/express-request-extend";
import { roleType } from "../../types/common.types";

// Module-level cache for templates
const templateCache = new Map<string, any>();

// Render a template using Hogan.js
export async function renderTemplate(
  templateName: string,
  context: any
): Promise<string> {
  const templatePath = path.join(
    process.cwd(),
    "public/templates",
    templateName
  );
  try {
    if (templateCache.get(templateName)) {
      const compiledTemplate = templateCache.get(templateName);
      return compiledTemplate.render(context);
    }
    // Read the template file
    const templateContent = await fs.readFile(templatePath, "utf-8");
    // Compile the template using Hogan.js
    const compiledTemplate = hogan.compile(templateContent);
    // Cache the compiled template
    templateCache.set(templateName, compiledTemplate);
    // Render the template
    return compiledTemplate.render(context);
  } catch (error: any) {
    throw new Error(`Error reading or rendering template: ${error.message}`);
  }
}

// Compare two version strings
export function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split(".").map(Number);
  const v2Parts = version2.split(".").map(Number);
  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const v1 = v1Parts[i] || 0;
    const v2 = v2Parts[i] || 0;
    if (v1 > v2) return 1;
    if (v1 < v2) return -1;
  }
  return 0;
}

// Role-based middleware to restrict access
export const restrictTo = (...roles: ("agency" | "agent" | "admin")[]) => {
  return (req: ExpressRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req?.role as roleType)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// Generate a random string
export function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generate a random OTP
export async function generateRandomOtp(length: number): Promise<number> {
  const digits = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return parseInt(result);
}

// Validate an email
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Format a date
export function formatDate(date: Date, locale: string = "en-US"): string {
  return new Intl.DateTimeFormat(locale).format(date);
}

// Format a date using moment
export function getFormatDate(
  date: string | Date = "",
  format = "MM-DD-YYYY"
): string {
  const value = date ? new Date(date) : new Date();
  return moment(value).format(format);
}

// Deep clone an object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Generate a UUID
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Send a standardized response
export function sendResponse(
  res: Response,
  statusCode: number = 200,
  message: string = "Success",
  data?: any,
  otherData?: Record<string, any>
) {
  const status = statusCode && statusCode >= 400 ? 202 : 200;
  return res.status(status).json({
    flag: !(statusCode && statusCode >= 400),
    statusCode,
    message,
    data: data || undefined,
    ...(otherData || {}),
  });
}

// Async error handler
export function catchAsync(
  handler: (
    req: ExpressRequest,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) {
  return async (req: ExpressRequest, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: any) {
      console.log("====================================");
      console.log("error==> ", error);
      console.log("====================================");

      //   if (req.files) {
      //     const directory = path.join(__dirname, '..', '..', 'public');
      //     if (Array.isArray(req.files) && req.files['logo']) {
      //       const filePath = '/documents/' + req.files['logo'][0].filename;
      //       const serverFilePath = path.join(directory, filePath);
      //       if (filesystem.existsSync(serverFilePath)) {
      //         filesystem.unlinkSync(serverFilePath);
      //       }
      //     } else if (Array.isArray(req.files) && req.files['file']) {
      //       const filePath = '/documents/' + req.files['file'][0].filename;
      //       const serverFilePath = path.join(directory, filePath);
      //       if (filesystem.existsSync(serverFilePath)) {
      //         filesystem.unlinkSync(serverFilePath);
      //       }
      //     }
      //   }

      let languageSpecificMessage: string | null = null;
      if (error.name === "TokenExpiredError") {
        languageSpecificMessage = "Invalid Token Provided!";
        throw new Error(languageSpecificMessage);
      }
      if (error.code === 11000) {
        languageSpecificMessage = "Duplicate Key Found!";
        const key = Object.keys(error.keyValue)[0];
        let keyUpdated = languageSpecificMessage.replace("key", key); //.replaceAll('key', key);
        let updatedMsg = keyUpdated.replace("value", error.keyValue[key]); //replaceAll('value', error.keyValue[key]);
        throw new Error(updatedMsg);
      }

      next(error);
    }
  };
}

// Paginate query results
export async function paginate(requestQuery: any) {
  const page = parseInt(requestQuery.page, 10) || 1;
  const limit = parseInt(requestQuery.limit, 10) || 10;
  const skip = (page - 1) * limit;
  return { page, skip, limit };
}

// Parse sorting fields
export async function sorting(sortParams: string) {
  const sortFields: Record<string, number> = {};
  sortParams.split(",").forEach((param) => {
    const [field, order] = param.split(":");
    if (field && order) sortFields[field] = parseInt(order, 10);
  });
  return sortFields;
}

// Parse filter fields
export async function filter(filterParams: string) {
  if (!filterParams) {
    return [];
  }

  const filterFields = await Promise.all(
    filterParams.split(",").map(async (param) => {
      const [field, value] = param.split(":");
      let finalData: any = value;
      try {
        await isValidMongoId(value);
        finalData = new Types.ObjectId(value);
      } catch (error) {
        // Fallback to original value
      }
      return field && value ? { [field]: finalData } : null;
    })
  );

  return filterFields.filter(Boolean);
}

// Sanitize search key
export async function searchKey(searchParams: string) {
  const dataString = searchParams ? decodeURIComponent(searchParams) : "";
  return dataString.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Handle sorting, searching, filtering, and pagination
export async function sortSearchFilterPagination(
  req: Request,
  orArray: string[] = [],
  idVariable: { key: string; value: string }[] = []
) {
  if (!req || !Array.isArray(orArray) || !Array.isArray(idVariable)) {
    throw new Error("Request, orArray, and idVariable are required!");
  }

  const requestQuery = req.query;
  const { page, skip, limit } = await paginate(requestQuery);
  const search = await searchKey(requestQuery.search as string);
  const sortFields = await sorting(
    (requestQuery.sort as string) || "createdAt:-1"
  );
  const filterFields = await filter((requestQuery.filter as string) || "");

  const variableData = idVariable.map((item) => {
    if (!item.value || !mongoose.isValidObjectId(item.value)) {
      throw new Error(`${item.key} Invalid MongoId in IdVariable's array!`);
    }
    return { [item.key]: new mongoose.Types.ObjectId(item.value) };
  });

  const combinedVariableData = Object.assign({}, ...variableData);
  let findQuery: any = {};
  if (search) {
    findQuery = {
      ...findQuery,
      ...(orArray.length > 0
        ? { $or: orArray.map((item) => ({ [item]: new RegExp(search, "i") })) }
        : {}),
    };
  }

  findQuery = {
    ...findQuery,
    ...combinedVariableData,
  };

  if (filterFields.length > 0) {
    Object.assign(findQuery, ...filterFields);
  }

  return { findQuery, pagination: { page, skip, limit }, sortFields };
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Compare a password with its hash
export async function compareHash(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Check if an object is empty
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

// Validate MongoDB ObjectId
export async function isValidMongoId(id: string): Promise<void> {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid MongoID Provided!");
  }
}

// Paginate Mongoose data
export async function paginationData(
  req: Request,
  Model: any,
  additionalQuery: any[] = [],
  orArray: string[] = [],
  idVariable: any[] = []
) {
  const { findQuery, pagination, sortFields } =
    await sortSearchFilterPagination(req, orArray, idVariable);
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;
  const aggregatePipeline = [
    {
      $match: { ...findQuery, softDelete: false },
    },
    ...additionalQuery,
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $sort: sortFields }, { $skip: skip }, { $limit: limit }],
      },
    },
    { $unwind: "$metadata" },
  ];
  const result = await Model.aggregate(aggregatePipeline);

  const data = result.length > 0 ? result[0].data : [];
  const totalCount = result.length > 0 ? result[0].metadata.total : 0;
  const page_data = {
    page: pagination.page,
    limit: pagination.limit,
    total: totalCount,
  };
  return { data, page_data };
}

export async function FindById(
  Model: any,
  id: string,
  populateArray: {
    path: string;
    select: string | object;
    options?: object;
  }[] = []
) {
  const data = await Model.findById(id)
  if (!data) {
    throw new Error("Data not found!");
  }
  if (populateArray.length > 0) {
    await data.populate(populateArray);
    // for (const item of populateArray) {
    //   await data.populate(item.path, item.select, item.options);
    // }
  }
  return data;
  // const data = await Model.findById(id);
  // if (!data) {
  //   throw new Error("Data not found!");
  // }
  // return data;
}

// Delete a file from the server
export async function deleteFileFromServer(filePath: string): Promise<void> {
  const fileBasePath = filePath.split("api")[1];
  const directory = path.join(__dirname, "..", "..", "public");
  const file = path.join(directory, fileBasePath);
  if (filesystem.existsSync(file)) {
    filesystem.unlinkSync(file);
  }
}

// Update a document's array field
export async function updateDocumentFieldArray(
  Model: any,
  documentId: string,
  field: string,
  value: string,
  operation: "$addToSet" | "$pull"
) {
  const update = { [operation]: { [field]: value } };
  return await Model.findByIdAndUpdate(documentId, update, { new: true });
}

// Create a document
export async function createDocument(Model: any, createDto: object) {
  try {
    const newDocument = new Model(createDto);
    await newDocument.save();
    return newDocument;
  } catch (error: any) {
    if (error.code === 11000) {
      const updatedDocument = await Model.findOneAndUpdate(
        { ...error.keyValue, softDelete: true },
        {
          $set: {
            ...createDto,
            softDelete: false,
            status: true,
          },
        },
        { new: true, upsert: true }
      );
      if (!updatedDocument) {
        throw error;
      }
      return updatedDocument;
    }
    throw error;
  }
}

// Update or create a device token
export async function updateOrCreateDeviceToken(
  userId: string,
  deviceToken: string,
  Model: any,
  data?: any
) {
  const result = await Model.findOneAndUpdate(
    { userId, deviceToken },
    { $set: { status: true } },
    { returnDocument: "after" }
  );

  if (result) {
    await Model.updateMany(
      { userId, deviceToken: { $ne: deviceToken } },
      { $set: { status: false } }
    );
  } else {
    await Model.updateMany({ userId }, { $set: { status: false } });
    const newDeviceToken = new Model({
      userId,
      ...data,
      status: true,
    });
    await newDeviceToken.save();
  }
}

// Get last 4 digits of a string
export function getLast4Digit(value = ""): string {
  return value ? value.slice(-4) : value;
}

// Decode mask format
export function decodeMaskFormat(value = ""): string {
  const maskFormat = /[ ()_-]+/g;
  return value ? value.replace(maskFormat, "").trim() : value;
}

// Convert to lowercase
export function getToLowerCase(value = ""): string {
  return value ? value.toLowerCase() : value;
}

// Increase a date
export function increaseDate(
  date: Date | null = null,
  type = "",
  duration = 0,
  format = "YYYY-MM-DD"
): string {
  const inputDate = date ? new Date(date) : new Date();
  let increasedDate: string;

  if (type === "Yearly") {
    increasedDate = getFormatDate(
      new Date(
        inputDate.getFullYear() + duration,
        inputDate.getMonth(),
        inputDate.getDate()
      ),
      format
    );
  } else if (type === "Monthly") {
    increasedDate = getFormatDate(
      new Date(inputDate.setMonth(inputDate.getMonth() + duration)),
      format
    );
  } else if (type === "Weekly") {
    increasedDate = getFormatDate(
      new Date(inputDate.setDate(inputDate.getDate() + 7 * duration)),
      format
    );
  } else if (type === "days") {
    increasedDate = getFormatDate(
      new Date(inputDate.setDate(inputDate.getDate() + duration)),
      format
    );
  } else {
    increasedDate = getFormatDate(inputDate, format);
  }

  return increasedDate;
}

// Decrease a date
export function decreaseDate(
  date: Date | null = null,
  type = "",
  duration = 0,
  format = "YYYY-MM-DD"
): string {
  const inputDate = date ? new Date(date) : new Date();
  let decreasedDate: string;

  if (type === "year") {
    decreasedDate = getFormatDate(
      new Date(
        inputDate.getFullYear() - duration,
        inputDate.getMonth(),
        inputDate.getDate()
      ),
      format
    );
  } else if (type === "month") {
    decreasedDate = getFormatDate(
      new Date(inputDate.setMonth(inputDate.getMonth() - duration)),
      format
    );
  } else if (type === "week") {
    decreasedDate = getFormatDate(
      new Date(inputDate.setDate(inputDate.getDate() - 7 * duration)),
      format
    );
  } else if (type === "days") {
    decreasedDate = getFormatDate(
      new Date(inputDate.setDate(inputDate.getDate() - duration)),
      format
    );
  } else {
    decreasedDate = getFormatDate(inputDate, format);
  }

  return decreasedDate;
}

// Calculate percentage
export function calPercentage(num = 0, per = 0): number {
  const result = (num / 100) * per;
  return parseFloat(result.toString()) || 0;
}

// Get date difference in days
export function getDateDifference(
  date1: Date | null = null,
  date2: Date | null = null
): number {
  const d1 = date1 ? new Date(date1) : new Date();
  const d2 = date2 ? new Date(date2) : new Date();
  return Math.floor(
    (Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()) -
      Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate())) /
      (1000 * 60 * 60 * 24)
  );
}

// Increase minutes
export function increaseMinutes(
  duration = 0,
  type: string = "",
  format = ""
): string {
  return type
    ? moment()
        .add(duration, type as moment.unitOfTime.DurationConstructor)
        .format(format)
    : "";
}

// Sort settings by order
export function sortSettingsByOrder(arr: any[], order: string[]) {
  const orderMap = new Map(order.map((slug, index) => [slug, index]));
  return arr.sort((a, b) => {
    const aIndex = orderMap.get(a.type) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = orderMap.get(b.type) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}
