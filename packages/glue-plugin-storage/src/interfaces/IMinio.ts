export interface IMinio {
  publicBucketName: string;
  privateBucketName: string;
  getPublicBucketName(): string;
  getPrivateBucketName(): string;
}
