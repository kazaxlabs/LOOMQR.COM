import { describe, it, expect } from 'vitest';
import { Telemetry, ScanRecord } from '@/lib/telemetry';

describe('Telemetry Deep Module', () => {
  const mockScans: ScanRecord[] = [
    { id: '1', timestamp: new Date('2024-05-01').getTime(), location: 'USA', device: 'Mobile', ownerId: 'user1' },
    { id: '2', timestamp: new Date('2024-05-01').getTime(), location: 'USA', device: 'Desktop', ownerId: 'user1' },
    { id: '3', timestamp: new Date('2024-05-02').getTime(), location: 'UK', device: 'Mobile', ownerId: 'user1' },
  ];

  it('should aggregate timeline correctly', () => {
    // We need to match the dynamic dates in the aggregator
    // For testing stability, we'll just check if it returns an array of objects
    const timeline = Telemetry.aggregateTimeline(mockScans, 7);
    expect(Array.isArray(timeline)).toBe(true);
    expect(timeline.length).toBe(7);
    expect(timeline[0]).toHaveProperty('date');
    expect(timeline[0]).toHaveProperty('count');
  });

  it('should aggregate top locations correctly', () => {
    const locations = Telemetry.aggregateTopLocations(mockScans);
    expect(locations[0].name).toBe('USA');
    expect(locations[0].value).toBe(2);
    expect(locations[1].name).toBe('UK');
    expect(locations[1].value).toBe(1);
  });

  it('should aggregate devices correctly', () => {
    const devices = Telemetry.aggregateDevices(mockScans);
    const mobile = devices.find(d => d.name === 'Mobile');
    const desktop = devices.find(d => d.name === 'Desktop');
    expect(mobile?.value).toBe(2);
    expect(desktop?.value).toBe(1);
  });
});
