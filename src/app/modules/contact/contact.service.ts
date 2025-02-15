import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { Icontact } from './contact.interface';
import { contactController } from './contact.controller';
import contact from './contact.models';
import path from 'path';
import { sendEmail } from '../../utils/mailSender';
import { User } from '../user/user.models';
import fs from 'fs';
import config from '../../config';

const createContact = async (payload: Icontact) => {

  const emailPath = path.join(
    __dirname,
    '../../../../public/view/supportEmail.html',
  );
  // If 'isApproved' is set to true, send an email
  await sendEmail(
    config.supportemail!,
    'Got a support message from Aristocar',
    fs
      .readFileSync(emailPath, 'utf8')
      .replace('{{name}}', payload?.firstName + ' ' + payload?.lastName)
      .replace('{{email}}', payload?.email)
      .replace('{{details}}', payload?.description)
  );


  const contacts = await contact.create(payload);

  if (!contacts) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create contact',
    );
  }
  return contacts;
};

const getAllcontact = async (query: Record<string, any>) => {
  const contactModel = new QueryBuilder(contact.find(), query)
    .search(['name', 'email', 'phoneNumber', 'status'])
    .filter()
    .paginate()
    .sort();

  const data: any = await contactModel.modelQuery;
  const meta = await contactModel.countTotal();

  return {
    data,
    meta,
  };
};

const getcontactById = async (id: string) => {
  const contactById = await contact.findById(id);
  if (!contactById) {
    throw new AppError(httpStatus.NOT_FOUND, 'Contact not found');
  }
  return contactById;
};

const getcontactByUserId = async (userId: string) => {
  const contactByUserId = await contact.find({ userId });
  if (!contactByUserId) {
    throw new AppError(httpStatus.NOT_FOUND, 'Contact not found');
  }
  return contactByUserId;
};

const updatecontact = async (id: string, payload: Partial<Icontact>) => {
  const updatedContact = await contact.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedContact) {
    throw new AppError(httpStatus.NOT_FOUND, 'Contact not found to update');
  }
  return updatedContact;
};

const deletecontact = async (id: string) => {
  const deletedContact = await contact.findByIdAndDelete(id);
  if (!deletedContact) {
    throw new AppError(httpStatus.NOT_FOUND, 'Contact not found to delete');
  }
  return deletedContact;
};

export const contactService = {
  createContact,
  getAllcontact,
  getcontactById,
  updatecontact,
  deletecontact,
  getcontactByUserId,
};
