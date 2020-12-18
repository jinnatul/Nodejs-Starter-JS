import AppError from '../../utils/AppError';
import catchAsync from '../middlewares/catchAsync';

// Response sessions
const sendData = (res, status, data) => {
  const date = new Date();
  res.status(status).json({
    status: 'ok',
    requestTime: date.toLocaleString(),
    data,
  });
};

// Create One
export const createOne = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const modelName = Model.collection.collectionName;
  console.log(modelName);
  switch (modelName) {
    case '': {
      if (!req.body.brandName) {
        return next(new AppError(''), 400);
      }
      break;
    }
    default: {
      break;
    }
  }

  const body = {
    ...req.body,
    lastModified: Date.now(),
  };

  const data = await Model.create(body);
  return sendData(res, 201, data);
});

// Get All
export const getAll = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const docs = await Model.find();
  return sendData(res, 200, docs);
});

// Get One
export const getOne = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const doc = await Model.findById(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  return sendData(res, 200, doc);
});

// Modify One
export const modifyOne = (Model) => catchAsync(async (req, res, next) => {
  res.setHeader('Content-type', 'application/json');

  const modelName = Model.collection.collectionName;

  switch (modelName) {
    case '': {
      const messages = 'ok';
      if (messages !== 'ok') {
        return next(new AppError(`${messages}`), 400);
      }
      break;
    }
    default: {
      break;
    }
  }

  const body = {
    ...req.body,
    lastModified: Date.now(),
  };

  const doc = await Model.findByIdAndUpdate(
    req.params.id,
    body, {
      new: true,
      runValidators: true,
    },
  );

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  return sendData(res, 200, doc);
});
