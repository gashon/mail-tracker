import aws from 'aws-sdk';
import type { EmailMetadata } from '@mail/extension/types';

aws.config.update({ region: process.env.AWS_REGION });

const ses = new aws.SES({ apiVersion: '2010-12-01' });

export const sendNotificationEmail = async (emailMetadata: EmailMetadata) => {
  await ses
    .sendEmail({
      Destination: {
        ToAddresses: [process.env.NOTIFICATION_RECEIVER__ADDRESS],
      },
      Message: {
        Body: {
          Text: {
            Data: `Pixel ${emailMetadata.subject} to ${emailMetadata.to} opened for the first time`,
          },
        },
        Subject: {
          Data: `[Pixel] ${emailMetadata?.subject} was opened`,
        },
      },
      Source: process.env.NOTIFICATION_SENDER_ADDRESS,
    })
    .promies();
};
