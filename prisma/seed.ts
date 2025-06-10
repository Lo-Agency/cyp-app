import { PrismaClient, TransactionType } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    const categories = [
        { name: 'درآمدها', type: TransactionType.INCOME },
        { name: 'هدیه', type: TransactionType.INCOME },
        { name: 'فروش', type: TransactionType.INCOME },
        { name: 'حقوق', type: TransactionType.INCOME },
        { name: 'خوراک', type: TransactionType.EXPENSE },
        { name: 'مسکن', type: TransactionType.EXPENSE },
        { name: 'حمل و نقل', type: TransactionType.EXPENSE },
        { name: 'سرگرمی', type: TransactionType.EXPENSE },
        { name: 'موارد دیگر', type: TransactionType.EXPENSE },
    ];

    for (const category of categories) {
        await prisma.category.create({
            data: category,
        });
    }

    console.log('✅ Categories seeded.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Error seeding categories:', e);
        await prisma.$disconnect();
        process.exit(1);
    });