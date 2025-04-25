import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Feedback, Prisma } from '@prisma/client';

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
    clientName?: string;
    courierName?: string;
    rating?: number;
    hasComment?: string;
    comment?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    items: Feedback[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { clientName, courierName, rating, comment, hasComment, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.FeedbackWhereInput = {
      ...(rating && { rating }),
      ...(comment && {
        comment: {
          contains: comment,
          mode: 'insensitive',
        },
      }),
      ...(hasComment === 'true' && {
        comment: {
          not: '',
        },
      }),
      ...(hasComment === 'false' && {
        OR: [
          { comment: null },
          { comment: '' },
        ],
      }),
      ...(courierName && {
        courier: {
          user: {
            OR: [
              { first_name: { contains: courierName, mode: 'insensitive' } },
              { last_name: { contains: courierName, mode: 'insensitive' } },
            ],
          },
        },
      }),
      ...(clientName && {
        client: {
          user: {
            OR: [
              { first_name: { contains: clientName, mode: 'insensitive' } },
              { last_name: { contains: clientName, mode: 'insensitive' } },
            ],
          },
        },
      }),
    };

    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          client: {
            include: {
              user: true,
            }
          },
          courier: {
            include: {
              user: true,
            }
          }
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.feedback.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: feedbacks,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      },
    };
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

  async getFeedbackByCourierId(
    id: number,
    query: {
      clientName?: string;
      rating?: number;
      hasComment?: string;
      comment?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    items: Feedback[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { clientName, rating, comment, hasComment, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.FeedbackWhereInput = {
      courier_id: id,
      ...(rating && { rating }),
      ...(comment && {
        comment: {
          contains: comment,
          mode: 'insensitive',
        },
      }),
      ...(hasComment === 'true' && {
        comment: {
          not: '',
        },
      }),
      ...(hasComment === 'false' && {
        OR: [
          { comment: null },
          { comment: '' },
        ],
      }),
      ...(clientName && {
        client: {
          user: {
            OR: [
              { first_name: { contains: clientName, mode: 'insensitive' } },
              { last_name: { contains: clientName, mode: 'insensitive' } },
            ],
          },
        },
      }),
    };

    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          client: {
            include: {
              user: true,
            }
          },
          courier: {
            include: {
              user: true,
            }
          }
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.feedback.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: feedbacks,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      },
    };
  }

  async getFeedbackByClientId(
    id: number,
    query: {
      courierName?: string;
      rating?: number;
      hasComment?: string;
      comment?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    items: Feedback[];
    meta: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    const { courierName, rating, comment, hasComment, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.FeedbackWhereInput = {
      client_id: id,
      ...(rating && { rating }),
      ...(comment && {
        comment: {
          contains: comment,
          mode: 'insensitive',
        },
      }),
      ...(hasComment === 'true' && {
        comment: {
          not: '',
        },
      }),
      ...(hasComment === 'false' && {
        OR: [
          { comment: null },
          { comment: '' },
        ],
      }),
      ...(courierName && {
        courier: {
          user: {
            OR: [
              { first_name: { contains: courierName, mode: 'insensitive' } },
              { last_name: { contains: courierName, mode: 'insensitive' } },
            ],
          },
        },
      }),
    };
    console.log(id, whereClause)

    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          client: {
            include: {
              user: true,
            }
          },
          courier: {
            include: {
              user: true,
            }
          }
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.feedback.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: feedbacks,
      meta: {
        totalItems: total,
        totalPages,
        currentPage: page,
      },
    };
  }
}
