import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function auditLog(model: string, operation: string, args: any) {
  if (model === 'AuditLog') return;
  if (model === 'User') return;

  const session = await auth();
  await prisma.auditLog.create({
    data: {
      action: operation,
      model: model,
      value: args.data ?? null,
      user: {
        connect: { id: session!.user!.id },
      },
    },
  });
}
