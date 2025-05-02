import { faker } from '@faker-js/faker';
import * as fs from 'fs-extra';

type Address = {
  street_name: string;
  building_number: number;
  apartment_number: number | null;
  city: string;
  country: string;
};

type Warehouse = {
  name: string;
  contact_number: string;
};

type User = {
  email: string;
  password: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  role: 'client' | 'courier';
};

type Order = {
  order_type: string;
  description: string;
  cost: number;
  payment_method: 'cash' | 'credit_card' | 'online';
  weight: number;
  length: number;
  width: number;
  height: number;
};

type Feedback = {
  rating: number;
  comment: string;
};

async function generateData() {
  const warehouses: Warehouse[] = [];
  const addresses: Address[] = [];
  const users: User[] = [];
  const orders: Order[] = [];
  const feedbacks: Feedback[] = [];

  for (let i = 0; i < 1000; i++) {
    const address: Address = {
      street_name: faker.location.street().substring(0, 100),
      building_number: faker.number.int({ min: 1, max: 100 }),
      apartment_number: Math.random() > 0.5 ? faker.number.int({ min: 1, max: 100 }) : null,
      city: faker.location.city().substring(0, 50),
      country: faker.location.country().substring(0, 50),
    };
    addresses.push(address);

    const warehouse: Warehouse = {
      name: faker.company.name().substring(0, 50),
      contact_number: faker.phone.number({ style: 'international' }).substring(0, 20),
    };
    warehouses.push(warehouse);
  }

  for (let i = 0; i < 1000; i++) {
    const user: User = {
      email: faker.internet.email().substring(0, 100),
      password: faker.internet.password({ length: 12, memorable: true }),
      phone_number: faker.phone.number({ style: 'international' }).substring(0, 20),
      first_name: faker.person.firstName().substring(0, 20),
      last_name: faker.person.lastName().substring(0, 20),
      role: faker.helpers.arrayElement(['client', 'courier']),
    };
    users.push(user);
  }

  for (let i = 0; i < 1000; i++) {
    const order: Order = {
      order_type: faker.commerce.product().substring(0, 50),
      description: faker.commerce.productDescription().substring(0, 255),
      cost: faker.number.float({ min: 100, max: 50000, fractionDigits: 2 }),
      payment_method: faker.helpers.arrayElement(['cash', 'credit_card', 'online']),
      weight: faker.number.float({ min: 0.5, max: 30, fractionDigits: 1 }),
      length: faker.number.float({ min: 5, max: 100, fractionDigits: 1 }),
      width: faker.number.float({ min: 5, max: 100, fractionDigits: 1 }),
      height: faker.number.float({ min: 5, max: 100, fractionDigits: 1 }),
    };
    orders.push(order);
  }

  for (let i = 0; i < 1000; i++) {
    const feedback: Feedback = {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: Math.random() < 0.3 ? "" : faker.lorem.sentence().substring(0, 255),
    };
    feedbacks.push(feedback);
  }


  await fs.writeJson('../../../../../coursework/data.json', {
    addresses,
    warehouses,
    users,
    orders,
    feedbacks,
  }, { spaces: 2 });

  console.log('Дані успішно згенеровані та записані у data.json');
}

generateData();
