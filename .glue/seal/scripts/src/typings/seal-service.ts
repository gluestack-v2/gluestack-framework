export interface SealServicePlatform {
  envfile: string;
  build: string;
}

export interface SealService {
  container_name: string;
  platforms: Record<'local' | 'docker', SealServicePlatform>;
}
