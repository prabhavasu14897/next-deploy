var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
const ALGORITHM = 'aes-256-gcm';
let EncryptionService = class EncryptionService {
    key;
    constructor(config) {
        const raw = config.get('ENCRYPTION_KEY');
        if (!raw) {
            throw new Error('ENCRYPTION_KEY is not set — required to store credential fields securely.');
        }
        this.key = Buffer.from(raw, 'hex');
        if (this.key.length !== 32) {
            throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters).');
        }
    }
    encrypt(plaintext) {
        const iv = randomBytes(12);
        const cipher = createCipheriv(ALGORITHM, this.key, iv);
        const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();
        return [iv, authTag, ciphertext].map((buf) => buf.toString('hex')).join(':');
    }
    decrypt(stored) {
        const [ivHex, tagHex, dataHex] = stored.split(':');
        if (!ivHex || !tagHex || !dataHex) {
            throw new Error('Malformed encrypted value.');
        }
        const decipher = createDecipheriv(ALGORITHM, this.key, Buffer.from(ivHex, 'hex'));
        decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
        return Buffer.concat([decipher.update(Buffer.from(dataHex, 'hex')), decipher.final()]).toString('utf8');
    }
};
EncryptionService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], EncryptionService);
export { EncryptionService };
//# sourceMappingURL=encryption.service.js.map