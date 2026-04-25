import { db } from "../firebase";
import { updateProfile } from "firebase/auth";
import {
  arrayRemove,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { User } from "firebase/auth";
import type {
  Mentor,
  EventData,
  UserData,
  AnnouncementData,
  CourseData,
} from "@/BackEnd/type";
import {
  checkRateLimit,
  RateLimitExceededError,
  type UserRole,
} from "../rate_limiting/rateLimiter";
