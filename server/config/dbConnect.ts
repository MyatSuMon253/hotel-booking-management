import mongoose from 'mongoose';

export const dbConnect = async () => {
  try {
    let connectionString = process.env.MONGODB_URI!!;
    
    await mongoose.connect(connectionString).then(() => {
      console.log('Connected to MongoDB')
    })
  } catch (error) {
    console.log("Error connecting to MongoDB", error)
  }
}