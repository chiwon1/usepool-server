import mongoose from 'mongoose';

const connectMongoDB = async (): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') {
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', console.log.bind(console, 'Connected to database..'));

    await mongoose.connect(process.env.DB_HOST!);
  }
};

export default connectMongoDB;
