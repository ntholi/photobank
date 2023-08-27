import { prisma } from '@/lib/db';
import commonUrlPatterns from './commonUrlPatterns';
import { User as FirebaseUser } from 'firebase/auth';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
