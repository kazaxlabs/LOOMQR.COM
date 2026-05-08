import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { mailService } from '@/lib/services/mail.service';

export async function GET(req: Request) {
  // Simple auth check for cron (e.g., CRON_SECRET)
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    // Find users whose lastActivityAt is older than 14 days and haven't been emailed yet this month
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef, 
      where('lastActivityAt', '<', fourteenDaysAgo.toISOString()),
      where('tier', '==', 'free') // Prioritize converting free users or retaining at-risk ones
    );

    const snapshot = await getDocs(q);
    const results = [];

    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      
      // Prevent spam: only email if we haven't sent a retention email in the last 30 days
      const lastRetentionEmail = userData.lastRetentionEmailAt ? new Date(userData.lastRetentionEmailAt) : null;
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      if (!lastRetentionEmail || lastRetentionEmail < thirtyDaysAgo) {
        console.log(`Sending retention email to ${userData.email}`);
        
        await mailService.sendReengagementEmail(userData.email);
        
        // Mark as emailed
        await updateDoc(doc(db, 'users', userDoc.id), {
          lastRetentionEmailAt: now.toISOString()
        });
        
        results.push(userData.email);
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: results.length,
      emails: results 
    });
  } catch (err: any) {
    console.error('Retention Cron Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
