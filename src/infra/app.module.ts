import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { evnSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { EventsModule } from './events/events.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => evnSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    EventsModule,
  ],
})
export class AppModule {}