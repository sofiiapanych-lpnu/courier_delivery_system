import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) { }

  async createFeedback(dto: CreateFeedbackDto) {
    return await this.prisma.feedback.create({
      data: {
        client_id: dto.clientId,
        courier_id: dto.courierId,
        rating: dto.rating,
        comment: dto.comment
      },
    });
  }

  async getAllFeedback() {
    return this.prisma.feedback.findMany();
  }

  async getFeedbackById(id: number) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { feedback_id: id },
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  async updateFeedback(id: number, dto: UpdateFeedbackDto) {
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

  async deleteFeedback(id: number) {
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
