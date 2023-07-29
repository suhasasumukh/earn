import { verifySignature } from '@upstash/qstash/nextjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { NextApiRequest, NextApiResponse } from 'next';

import { DeadlineSponsorEmailTemplate } from '@/components/emails/deadlineSponsorTemplate';
import { prisma } from '@/prisma';
import resendMail from '@/utils/resend';

dayjs.extend(utc);

async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const bounties = await prisma.bounties.findMany({
      where: {
        isPublished: true,
        isActive: true,
        isArchived: false,
        status: 'OPEN',
        deadline: {
          lt: dayjs().toISOString(),
        },
      },
    });

    await Promise.all(
      bounties.map(async (bounty) => {
        const checkLogs = await prisma.emailLogs.findFirst({
          where: {
            bountyId: bounty.id,
            type: 'BOUNTY_DEADLINE',
          },
        });

        if (checkLogs) {
          return;
        }

        const subscribe = await prisma.subscribeBounty.findMany({
          where: {
            bountyId: bounty.id,
          },
          include: {
            User: true,
          },
        });

        const subEmail = subscribe.map((sub) => {
          return {
            email: sub.User.email,
            name: sub.User.firstName,
          };
        });

        const emailsSent: string[] = [];
        await Promise.all(
          subEmail.map(async (e) => {
            if (emailsSent.includes(e.email) || !e.email) {
              return;
            }
            await resendMail.emails.send({
              from: `Kash from Superteam <${process.env.SENDGRID_EMAIL}>`,
              to: [e.email],
              bcc: ['pratik.dholani1@gmail.com'],
              subject: 'Bounty Deadline Exceeded',
              react: DeadlineSponsorEmailTemplate({
                name: e.name!,
                bountyName: bounty.title,
              }),
            });
            emailsSent.push(e.email);

            await prisma.emailLogs.create({
              data: {
                type: 'BOUNTY_DEADLINE',
                bountyId: bounty.id,
              },
            });
          })
        );
      })
    );

    return res.status(200).json({ message: 'Ok' });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: 'Something went wrong. Check server logs for details.' });
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
