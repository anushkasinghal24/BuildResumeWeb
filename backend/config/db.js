import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://anushkasinghal233:Resume123@cluster0.v2bioib.mongodb.net/RESUME?retryWrites=true&w=majority')
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    });
}
    