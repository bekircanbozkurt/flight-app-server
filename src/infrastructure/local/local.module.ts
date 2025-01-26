import { Module } from '@nestjs/common';
import { LocalJsonService } from './local-json.service';

@Module({
  providers: [LocalJsonService],
  exports: [LocalJsonService],
})
export class LocalModule {}
