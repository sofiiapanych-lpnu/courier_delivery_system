import { faker } from '@faker-js/faker';
import { Address, Client, Courier, Warehouse } from '@prisma/client';
import * as argon from 'argon2'

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('../../../../../coursework/data.json', 'utf-8'));

async function addAddresses() {
  for (const address of data.addresses) {
    await prisma.address.create({
      data: address
    });
  }
}

async function addWarehouses() {
  const addresses = await prisma.address.findMany();

  for (const warehouse of data.warehouses) {
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];

    const addressExists = await prisma.address.findUnique({
      where: {
        address_id: randomAddress.address_id,
      },
    });

    if (addressExists) {
      await prisma.warehouse.create({
        data: {
          name: warehouse.name,
          contact_number: warehouse.contact_number,
          address_id: randomAddress.address_id,
        },
      });
    } else {
      console.log(`Address ID ${randomAddress.address_id} does not exist. Skipping warehouse ${warehouse.name}`);
    }
  }
}

async function addUsers() {
  const addresses = await prisma.address.findMany();
  const companyVehicles = await prisma.vehicle.findMany({
    where: {
      is_company_owner: true,
      Courier: null,
    },
  });
  const personalVehicles = await prisma.vehicle.findMany({
    where: {
      is_company_owner: false,
      Courier: null,
    },
  });

  for (const user of data.users) {
    const hash = await argon.hash(user.password);
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        hash: hash,
        phone_number: user.phone_number,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });

    if (user.role === "courier") {
      let vehicle;

      if (Math.random() > 0.5 && companyVehicles.length > 0) {
        vehicle = companyVehicles.splice(
          Math.floor(Math.random() * companyVehicles.length),
          1
        )[0];
      } else if (personalVehicles.length > 0) {
        vehicle = personalVehicles.splice(
          Math.floor(Math.random() * personalVehicles.length),
          1
        )[0];
      } else {
        vehicle = await prisma.vehicle.create({
          data: {
            license_plate: faker.vehicle.vrm(),
            model: faker.vehicle.manufacturer(),
            transport_type: faker.helpers.arrayElement(["car", "bicycle", "truck", "motorcycle"]),
            is_company_owner: Math.random() < 0.1,
          },
        });
      }

      await prisma.courier.create({
        data: {
          user: {
            connect: { user_id: createdUser.user_id },
          },
          vehicle: {
            connect: { license_plate: vehicle.license_plate },
          },
        },
      });
    }

    if (user.role === "client") {
      const randomAddress =
        addresses[Math.floor(Math.random() * addresses.length)];

      await prisma.client.create({
        data: {
          user_id: createdUser.user_id,
          address_id: randomAddress.address_id,
        },
      });
    }
  }
}

async function addOrders() {
  for (const order of data.orders) {
    await prisma.order.create({
      data: order
    });
  }
}

async function addFeedbacks() {
  const couriers = await prisma.courier.findMany();
  const clients = await prisma.client.findMany();

  for (const feedback of data.feedbacks) {
    const randomCourier = couriers[Math.floor(Math.random() * couriers.length)];
    const randomClient = clients[Math.floor(Math.random() * clients.length)];

    await prisma.feedback.create({
      data: {
        comment: feedback.comment,
        rating: feedback.rating,
        courier_id: randomCourier.courier_id,
        client_id: randomClient.client_id,
      },
    });
  }
}

async function addCourierSchedules() {
  const couriers = await prisma.courier.findMany();

  for (const courier of couriers) {
    const createdSchedule = await prisma.courierSchedule.create({
      data: {
        courier_id: courier.courier_id,
        schedule_status: "active",
      },
    });

    const daysOfWeek = [1, 2, 3, 4, 5, 6, 7];
    for (const day of daysOfWeek) {
      const isWorkingDay = Math.random() < 0.7;

      if (!isWorkingDay) continue;

      const startHour = Math.floor(Math.random() * 24);
      const startMinutes = Math.random() < 0.5 ? 0 : 30;
      const startTime = new Date();
      startTime.setHours(startHour, startMinutes, 0, 0);

      const maxWorkingHours = 12;
      let endHour = startHour + Math.floor(Math.random() * 3) + 4;

      if (endHour >= 24) {
        endHour -= 24;
      } else if (endHour > startHour + maxWorkingHours) {
        endHour = startHour + maxWorkingHours;
      }

      const endMinutes = Math.random() < 0.5 ? 0 : 30;
      const endTime = new Date(startTime);
      endTime.setHours(endHour, endMinutes, 0, 0);

      await prisma.courierWeeklySchedule.create({
        data: {
          schedule_id: createdSchedule.schedule_id,
          day_of_week: day,
          start_time: startTime,
          end_time: endTime,
          is_working_day: true,
        },
      });
    }
  }
}

async function addVehicles() {
  for (let i = 0; i < 1000; i++) {
    const licensePlate = faker.vehicle.vrm();
    const model = faker.vehicle.manufacturer();
    const transportType = faker.helpers.arrayElement(["car", "bicycle", "truck", "motorcycle"]);
    const isCompanyOwner = Math.random() < 0.1;

    await prisma.vehicle.create({
      data: {
        license_plate: licensePlate,
        model: model,
        transport_type: transportType,
        is_company_owner: isCompanyOwner,
      },
    });
  }
}

async function addDeliveries() {
  const orders = await prisma.order.findMany();
  const couriers = await prisma.courier.findMany();
  const clients = await prisma.client.findMany();
  const addresses = await prisma.address.findMany();
  const warehouses = await prisma.warehouse.findMany();

  for (const order of orders) {
    const randomCourier: Courier = faker.helpers.arrayElement(couriers);
    const randomClient: Client = faker.helpers.arrayElement(clients);
    const randomAddress: Address = faker.helpers.arrayElement(addresses);
    const randomWarehouse: Warehouse = faker.helpers.arrayElement(warehouses);

    const deliveryType = faker.helpers.arrayElement(["standard", "express", "overnight"]);
    const paymentMethod = faker.helpers.arrayElement(["cash", "credit_card", "online"]);

    const startTime = faker.date.between({
      from: '2023-01-01',
      to: '2025-12-31'
    });

    startTime.setHours(faker.number.int({ min: 0, max: 23 }));
    startTime.setMinutes(faker.number.int({ min: 0, max: 59 }));
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);

    const endTime = new Date(startTime);
    const deliveryDuration = faker.number.int({ min: 1, max: 5 });
    endTime.setHours(startTime.getHours() + deliveryDuration);

    const deliveryCost = faker.number.float({ min: 5, max: 50, fractionDigits: 2 });

    await prisma.delivery.create({
      data: {
        order_id: order.order_id,
        courier_id: randomCourier ? randomCourier.courier_id : null,
        client_id: randomClient ? randomClient.client_id : null,
        address_id: randomAddress.address_id,
        delivery_type: deliveryType,
        delivery_cost: deliveryCost,
        payment_method: paymentMethod,
        delivery_status: "pending",
        start_time: startTime,
        end_time: endTime,
        desired_duration: deliveryDuration,
        warehouse_id: randomWarehouse.warehouse_id,
      },
    });
  }
}


async function main() {
  try {
    await addAddresses();
    await addWarehouses();
    await addVehicles();
    await addOrders();
    await addUsers();
    await addFeedbacks();
    await addCourierSchedules();
    await addDeliveries();
    console.log('Дані успішно додано в базу даних');
  } catch (error) {
    console.error('Помилка при додаванні даних:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
