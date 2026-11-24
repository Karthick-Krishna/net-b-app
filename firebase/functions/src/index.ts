import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcryptjs';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

/**
 * Assign Custom Admin Claims
 * Only callable by authenticated Super Admins.
 */
export const grantAdminRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || context.auth.token.role !== 'superadmin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only verified Super Administrators can grant administrative privileges.'
    );
  }

  const { targetEmail, role = 'admin' } = data;
  if (!targetEmail) {
    throw new functions.https.HttpsError('invalid-argument', 'Target email is required.');
  }

  const user = await auth.getUserByEmail(targetEmail);
  await auth.setCustomUserClaims(user.uid, {
    admin: true,
    role: role,
  });

  await db.collection('users').doc(user.uid).set(
    {
      role: role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { success: true, message: `Admin privileges granted to ${targetEmail}` };
});

/**
 * Secure App-Lock PIN Verification & Failed Attempt Counter
 */
export const verifyAppLockPin = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { pin } = data;
  const uid = context.auth.uid;

  if (!pin || pin.length !== 6) {
    throw new functions.https.HttpsError('invalid-argument', 'PIN must be 6 digits.');
  }

  const secDocRef = db.collection('security').doc(uid);
  const secDoc = await secDocRef.get();

  if (!secDoc.exists || !secDoc.data()?.pinHash) {
    throw new functions.https.HttpsError('not-found', 'App lock PIN is not configured.');
  }

  const secData = secDoc.data()!;

  // Check lockout
  if (secData.lockedUntil && new Date(secData.lockedUntil) > new Date()) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      `App is temporarily locked until ${new Date(secData.lockedUntil).toLocaleTimeString()}.`
    );
  }

  const match = bcrypt.compareSync(pin, secData.pinHash);

  if (!match) {
    const failedAttempts = (secData.failedAttempts || 0) + 1;
    let lockedUntil: string | null = null;

    if (failedAttempts >= 5) {
      // Lock for 15 minutes
      lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    }

    await secDocRef.update({
      failedAttempts,
      lockedUntil,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: false,
      error: lockedUntil ? 'App locked for 15 minutes due to 5 failed attempts.' : 'Incorrect PIN.',
      remainingAttempts: Math.max(0, 5 - failedAttempts),
    };
  }

  // Reset failed attempts on success
  await secDocRef.update({
    failedAttempts: 0,
    lockedUntil: null,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, verified: true };
});

/**
 * Admin Initiate App-Lock Reset
 * Allows an administrator to reset a customer's lock state without ever viewing or knowing their PIN.
 */
export const adminResetAppLock = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Administrative privileges required to initiate security credential resets.'
    );
  }

  const { targetUid, reason } = data;
  if (!targetUid) {
    throw new functions.https.HttpsError('invalid-argument', 'Target customer UID required.');
  }

  await db.collection('security').doc(targetUid).set(
    {
      appLockEnabled: false,
      pinHash: null,
      failedAttempts: 0,
      lockedUntil: null,
      resetRequestedByAdmin: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // Record immutable audit log
  await db.collection('auditLogs').add({
    logId: db.collection('auditLogs').doc().id,
    adminUid: context.auth.uid,
    adminEmail: context.auth.token.email || 'admin@premierbanking.com',
    action: 'APP_LOCK_RESET',
    targetUid,
    targetRecord: `security/${targetUid}`,
    reason: reason || 'Customer requested PIN reset through secure banking verification',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: 'Customer app-lock PIN successfully reset.' };
});
