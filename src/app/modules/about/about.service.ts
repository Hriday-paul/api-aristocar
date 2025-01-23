import About from './about.models';

const createabout = async (description: string) => {
  const newAbout = await About.create({ description });
  return newAbout;
};

const getAllabout = async () => {
  const aboutList = await About.find();
  return aboutList;
};

const getaboutById = async (id: string) => {
  const about = await About.findById(id);
  return about;
};

const updateabout = async (id: string, description: string) => {
  const updatedAbout = await About.findByIdAndUpdate(
    id,
    { description },
    { new: true },
  );
  return updatedAbout;
};

const deleteabout = async (id: string) => {
  const deletedAbout = await About.findByIdAndDelete(id);
  return deletedAbout;
};

export const aboutService = {
  createabout,
  getAllabout,
  getaboutById,
  updateabout,
  deleteabout,
};
