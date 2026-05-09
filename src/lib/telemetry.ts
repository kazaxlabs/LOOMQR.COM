import { collection, query, where, onSnapshot, orderBy, Unsubscribe } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ScanRecord {
  id: string;
  timestamp: string | number;
  location?: string;
  device?: string;
  os?: string;
  browser?: string;
  ownerId: string;
}

export interface ChartPoint {
  date: string;
  count: number;
}

export interface BucketPoint {
  name: string;
  value: number;
}

/**
 * DEEP MODULE: Telemetry
 * High-leverage module for real-time scan analytics and data aggregation.
 */
export const Telemetry = {
  /**
   * Subscribes to real-time scan data for a specific user.
   */
  subscribeToUserScans(userId: string, onData: (scans: ScanRecord[]) => void, onError?: (err: any) => void): Unsubscribe {
    const q = query(
      collection(db, 'scans'),
      where('ownerId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const scans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScanRecord[];
      onData(scans);
    }, (error) => {
      console.error("TELEMETRY_STREAM_ERROR:", error);
      if (onError) onError(error);
    });
  },

  /**
   * Aggregates scans by date for timeline charts.
   */
  aggregateTimeline(scans: ScanRecord[], days: number = 7): ChartPoint[] {
    const groups: Record<string, number> = {};
    const lastDays = Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    lastDays.forEach(date => { groups[date] = 0; });

    scans.forEach(scan => {
      const date = new Date(scan.timestamp).toLocaleDateString();
      if (groups[date] !== undefined) {
        groups[date]++;
      }
    });

    return Object.entries(groups).map(([date, count]) => ({
      // Format as MM/DD
      date: date.split('/')[0] + '/' + date.split('/')[1],
      count
    }));
  },

  /**
   * Aggregates scans by geographic location.
   */
  aggregateTopLocations(scans: ScanRecord[], limit: number = 5): BucketPoint[] {
    const groups: Record<string, number> = {};
    scans.forEach(scan => {
      const loc = scan.location || 'Unknown';
      groups[loc] = (groups[loc] || 0) + 1;
    });
    return Object.entries(groups)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  },

  /**
   * Aggregates scans by device type.
   */
  aggregateDevices(scans: ScanRecord[]): BucketPoint[] {
    const groups: Record<string, number> = {};
    scans.forEach(scan => {
      const dev = scan.device || 'Other';
      groups[dev] = (groups[dev] || 0) + 1;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }
};
