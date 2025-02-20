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

  async getSchedule({ accessToken, refreshToken }: GetSchedule): Promise<any> {
    if (!accessToken || !refreshToken) throw new BadRequestException();

    const cacheKey = `schedule_${accessToken}`;

    // Check Redis cache first
    const cacheData = await this.redisService.get(cacheKey);
    if (cacheData) return cacheData;

    const semester = await this.getSemester(accessToken);

    try {
      const response = await axios.get(
        `${this.BASE_URL}/education/api/StudentCourseSubject/studentLoginUser/${semester.id}`,
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

  private async getSemester(accessToken: string): Promise<any> {
    if (!accessToken) throw new BadRequestException();

    const cacheKey = `semester_${accessToken}`;

    // Check Redis cache first
    const cacheData = await this.redisService.get(cacheKey);
    if (cacheData) return cacheData;

    try {
      const resp = await axios.get(
        `${this.BASE_URL}/education/api/semester/semester_info`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          httpsAgent: this.agent, // Attach the same custom HTTPS agent
        },
      );

      const semester = resp.data;

      // Save data to Redis with 1 day expiration
      await this.redisService.set(
        cacheKey,
        semester,
        this.TIME_EXPIRATION_OF_CLASS_SCHEDULE,
      );
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
