import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Feedback } from '@prisma/client';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) { }

  async createFeedback(dto: CreateFeedbackDto): Promise<Feedback> {
    return await this.prisma.feedback.create({
      data: {
        client_id: dto.clientId,
        courier_id: dto.courierId,
        rating: dto.rating,
        comment: dto.comment
      },
    });
  }

  async getAllFeedback(query: {
    clientId?: number;
    courierId?: number;
    rating?: number;
    comment?: string;
    page?: number;
    limit?: number;
  }): Promise<Feedback[]> {
    const { clientId, courierId, rating, comment, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    return this.prisma.feedback.findMany({
      where: {
        AND: [
          clientId ? { client_id: clientId } : {},
          courierId ? { courier_id: courierId } : {},
          rating ? { rating } : {},
          comment ? { comment: { contains: comment, mode: 'insensitive' } } : {},
        ]
      },
      skip,
      take: limit,
    });
  }

  async getFeedbackById(id: number): Promise<Feedback> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { feedback_id: id },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  async updateFeedback(id: number, dto: UpdateFeedbackDto): Promise<Feedback> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { feedback_id: id },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return this.prisma.feedback.update({
      where: { feedback_id: id },
      data: {
        client_id: dto.clientId,
        courier_id: dto.courierId,
        rating: dto.rating,
        comment: dto.comment
      },
    });
  }

  async deleteFeedback(id: number): Promise<{ message: string }> {
    const feedback = await this.prisma.feedback.findUnique({
      where: { feedback_id: id },
    });

    if (!feedback) {
      throw new Error(`Feedback with ID ${id} not found`);
    }

    await this.prisma.feedback.delete({
      where: { feedback_id: id },
    });

    return { message: `Feedback with ID ${id} deleted successfully` };
  }
}
