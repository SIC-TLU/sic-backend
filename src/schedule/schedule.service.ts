import * as https from 'https';
import axios from 'axios';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginToGetSchedule } from './dto/login-to-get-schedule.dto';
import { GetSchedule } from './dto/get-schedule.dto';
import { RedisService } from '@/modules/redis/redis.service';

@Injectable()
export class ScheduleService {
  private readonly BASE_URL = 'https://sinhvien1.tlu.edu.vn';
  private readonly agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL verification (for testing only)
  });
  private readonly TIME_EXPIRATION_OF_CLASS_SCHEDULE = 60 * 60 * 24;

  constructor(private redisService: RedisService) {}

  async create({ username, password }: LoginToGetSchedule): Promise<any> {
    try {
      const data = new URLSearchParams({
        client_id: 'education_client',
        grant_type: 'password',
        password,
        username,
        client_secret: 'password',
      });

      const response = await axios.post(
        `${this.BASE_URL}/education/oauth/token`,
        data,
        {
          httpsAgent: this.agent,
        },
      );

      return response.data;
    } catch (error) {
      if (error?.response?.data?.error === 'invalid_grant') {
        throw new UnauthorizedException('Invalid usernane or password!');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSchedule({
    accessToken,
    refreshToken,
    semesterId,
  }: GetSchedule): Promise<any> {
    if (!accessToken || !refreshToken || !semesterId)
      throw new BadRequestException();

    const cacheKey = `schedule_${accessToken}`;

    // Check Redis cache first
    const cacheData = await this.redisService.get(cacheKey);
    if (cacheData) return cacheData;

    try {
      const response = await axios.get(
        `${this.BASE_URL}/education/api/StudentCourseSubject/studentLoginUser/${semesterId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          httpsAgent: this.agent,
        },
      );
      const schedule = response.data;

      // Save data to Redis with 1 day expiration
      await this.redisService.set(
        cacheKey,
        schedule,
        this.TIME_EXPIRATION_OF_CLASS_SCHEDULE,
      );

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching schedule');
    }
  }
}
