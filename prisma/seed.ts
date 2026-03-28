import { PrismaClient, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando população do banco de dados...')

    const password = await bcrypt.hash('password', 10);

    const user = await prisma.user.upsert({
        where: { email: 'admin@acme.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@acme.com',
            password: password

        }
    });

    console.log('Usuário criado com sucesso.');

    const customer_data = [{
        name: 'Alex Bessa',
        email: 'alex@email.com',
        imageUrl: 'https://ui-avatars.com/api/?name=Alex+Bessa&background=random'
    }, {
        name: 'Valdiana Bessa',
        email: 'valdiana@email.com',
        imageUrl: 'https://ui-avatars.com/api/?name=Valdiana+Bessa&background=random'
    },
    {
        name: 'Timóteo Bessa',
        email: 'timoteo@email.com',
        imageUrl: 'https://ui-avatars.com/api/?name=Timoteo+Bessa&background=random'
    }];

    const customers = [];

    for (const data of customer_data) {
        const customer = await prisma.customer.upsert({
            where: { email: data.email },
            update: {},
            create: data
        });

        customers.push(customer);
        console.log(`Cliente criado: ${customer.name}`);
    };

    const invoicesData = [{
        amount: 15785,
        status: InvoiceStatus.PAGO,
        date: '2026-05-29',
        customer: customers[0]
    }, {
        amount: 5757,
        status: InvoiceStatus.PENDENTE,
        date: '2026-05-21',
        customer: customers[1]
    }, {
        amount: 5747,
        status: InvoiceStatus.PENDENTE,
        date: '2026-05-15',
        customer: customers[2]
    }, {
        amount: 147854,
        status: InvoiceStatus.PAGO,
        date: '2026-05-01',
        customer: customers[0]
    }, {
        amount: 5777,
        status: InvoiceStatus.PENDENTE,
        date: '2026-05-05',
        customer: customers[1]
    }, {
        amount: 747,
        status: InvoiceStatus.PENDENTE,
        date: '2026-05-16',
        customer: customers[2]
    }, {
        amount: 7789,
        status: InvoiceStatus.PAGO,
        date: '2026-05-03',
        customer: customers[0]
    }, {
        amount: 16834,
        status: InvoiceStatus.PENDENTE,
        date: '2026-05-08',
        customer: customers[1]
    }, {
        amount: 235742,
        status: InvoiceStatus.PENDENTE,
        date: '2026-05-21',
        customer: customers[2]
    }, {
        amount: 6789,
        status: InvoiceStatus.PAGO,
        date: '2026-05-20',
        customer: customers[0]
    }, {
        amount: 3421,
        status: InvoiceStatus.PENDENTE,
        date: '2026-05-13',
        customer: customers[1]
    }, {
        amount: 5776,
        status: InvoiceStatus.PENDENTE,
        date: '2026-05-27',
        customer: customers[2]
    }];


    for (const data of invoicesData) {
        await prisma.invoice.create({
            data: {
                amount: data.amount,
                status: data.status,
                date: new Date(data.date),
                customerId: data.customer.id
            }
        });
    };

    console.log(`${invoicesData.length} faturas criadas.`);

    const revenueData = [
        { month: 'Jan', revenue: 65748461 },
        { month: 'Fev', revenue: 69562131 },
        { month: 'Mar', revenue: 8556565 },
        { month: 'Abr', revenue: 95653 },
        { month: 'Mai', revenue: 9756232 },
        { month: 'Jun', revenue: 98465103 },
        { month: 'Jul', revenue: 1541656 },
        { month: 'Ago', revenue: 8979613 },
        { month: 'Set', revenue: 784152103 },
        { month: 'Out', revenue: 3265232 },
        { month: 'Nov', revenue: 1656566565 },
        { month: 'Dez', revenue: 646462266 }
    ];

    for (const data of revenueData){
        await prisma.revenue.upsert({
            where: { month: data.month },
            update: { revenue: data.revenue },
            create: data
        });
    };

    console.log('Dados de receita mensal criados.');

    console.log('População concluída com sucesso.');
};

main()
    .catch((erro) => {
        console.log('Erro ao popular o banco:', erro);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });