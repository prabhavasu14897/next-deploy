import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { PlatformsService, type CredentialFieldDto } from './platforms.service.js';

class CredentialFieldBody implements CredentialFieldDto {
  key!: string;
  label!: string;
  secret!: boolean;
  value!: string;
}

class PlatformBody {
  name!: string;
  summary!: string;
  accountNoun!: string;
  accountNounPlural!: string;
  apiBaseUrl!: string;
  credentialFields!: CredentialFieldBody[];
}

@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Get()
  list() {
    return this.platformsService.list();
  }

  @Post()
  create(@Body() body: PlatformBody) {
    return this.platformsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: PlatformBody) {
    return this.platformsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.platformsService.remove(id);
  }

  @Post(':id/connect')
  connect(@Param('id') id: string) {
    return this.platformsService.connect(id);
  }
}
