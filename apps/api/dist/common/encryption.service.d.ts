import { ConfigService } from '@nestjs/config';
export declare class EncryptionService {
    private readonly key;
    constructor(config: ConfigService);
    encrypt(plaintext: string): string;
    decrypt(stored: string): string;
}
