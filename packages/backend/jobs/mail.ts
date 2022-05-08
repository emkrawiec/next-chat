import { ProcessPromiseFunction } from "bull";
import { MailJobDTO } from "../dto/mail-dto";
import { sendMail } from "../services/mail";

export const mailJobHandler: ProcessPromiseFunction<MailJobDTO> = async (job) => {
  const { ...dto } = job.data;

  await sendMail(dto);
};