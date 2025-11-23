class QuotaManager {
  private readCount = 0;
  private resetTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  private readonly DAILY_LIMIT = 50000; // Firestore free tier limit

  canRead(count: number = 1): boolean {
    if (Date.now() > this.resetTime) {
      this.readCount = 0;
      this.resetTime = Date.now() + 24 * 60 * 60 * 1000;
    }
    return this.readCount + count <= this.DAILY_LIMIT;
  }

  recordReads(count: number) {
    this.readCount += count;
  }

  getRemainingReads(): number {
    return Math.max(0, this.DAILY_LIMIT - this.readCount);
  }
}

export const quotaManager = new QuotaManager();