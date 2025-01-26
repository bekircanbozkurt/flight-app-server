import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalModule } from '../local/local.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { LocalJsonService } from '../local/local-json.service';
import { FirestoreService } from '../firebase/firestore.service';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [ConfigModule, LocalModule, FirebaseModule],
      providers: [
        {
          provide: 'DATABASE_SERVICE',
          useFactory: (configService: ConfigService) => {
            const useLocal = configService.get<boolean>('database.useLocal');
            return useLocal ? new LocalJsonService() : new FirestoreService();
          },
          inject: [ConfigService],
        },
      ],
      exports: ['DATABASE_SERVICE'],
    };
  }
}
