


export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

  if(!file)  return callback(new Error('No file uploaded'), false);
  const fileExtension = file.mimetype.split('/')[1];
  const validExtension = ['jpg', 'jpeg', 'png', 'gif'];

  if(validExtension.includes(fileExtension)) return callback(null, true);

  return callback(new Error('Only image files are allowed!'), false);
}