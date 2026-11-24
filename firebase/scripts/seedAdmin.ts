/**
 * Firebase Admin Provisioning and Seed Script
 * Assigns custom admin claims and provisions initial demo records in Cloud Firestore.
 */
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (Uses GOOGLE_APPLICATION_CREDENTIALS or default app)
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (e) {
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'premier-banking-platform',
    });
  }
}

const auth = admin.auth();
const db = admin.firestore();

export async function provisionAdmin(email: string = 'admin@premierbanking.com') {
  console.log(`Setting custom admin claims for: ${email}`);
  try {
    const user = await auth.getUserByEmail(email);
    await auth.setCustomUserClaims(user.uid, {
      admin: true,
      role: 'superadmin',
    });

    // Update in Firestore users collection as well
    await db.collection('users').doc(user.uid).set(
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Victoria Sterling (Super Admin)',
        role: 'superadmin',
        accountStatus: 'active',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`Successfully assigned custom admin claims to ${email} (UID: ${user.uid})`);
  } catch (error) {
    console.error(`Failed to assign custom admin claims:`, error);
  }
}

// If invoked directly
if (require.main === module) {
  const targetEmail = process.argv[2] || 'admin@premierbanking.com';
  provisionAdmin(targetEmail).then(() => process.exit(0)).catch(() => process.exit(1));
}
